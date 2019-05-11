#include "PjSipModule.h"
#include <unistd.h>
#include <android/log.h>
#include <pthread.h>

static int pfd[2];
static pthread_t thr;
static const char *tag = "myapp";

static void *thread_func(void*)
{
    ssize_t rdsz;
    char buf[128];
    while((rdsz = read(pfd[0], buf, sizeof buf - 1)) > 0) {
        if(buf[rdsz - 1] == '\n') --rdsz;
        buf[rdsz] = 0;  /* add null-terminator */
        __android_log_write(ANDROID_LOG_DEBUG, tag, buf);
    }
    return 0;
}

int start_logger(const char *app_name)
{
    tag = app_name;

    /* make stdout line-buffered and stderr unbuffered */
    setvbuf(stdout, 0, _IOLBF, 0);
    setvbuf(stderr, 0, _IONBF, 0);

    /* create the pipe and redirect stdout and stderr */
    pipe(pfd);
    dup2(pfd[1], 1);
    dup2(pfd[1], 2);

    /* spawn the logging thread */
    if(pthread_create(&thr, 0, thread_func, 0) == -1)
        return -1;
    pthread_detach(thr);
    return 0;
}

PjSipModule::PjSipModule(jobject _nativeThis, JavaVM *_jvm, jclass _javaClass){
        start_logger("FakeCaller");
        /* Create pjsua first! */
        nativeThis = _nativeThis;
        jvm = _jvm;
        javaClass = _javaClass;

        isMuted = false;
        status = pjsua_create();
        if (status != PJ_SUCCESS) error_exit("Error in pjsua_create()", status);


        //    /* If argument is specified, it's got to be a valid SIP URL */
        //    status = pjsua_verify_url(argv[1]);
        //    if (status != PJ_SUCCESS) error_exit("Invalid URL in argv", status);

        /* Init pjsua */
        {
            pjsua_config cfg;
            pjsua_logging_config log_cfg;

            pjsua_config_default(&cfg);
            //      cfg.cb.on_incoming_call = &on_incoming_call;
            cfg.cb.on_call_media_state = &on_call_media_state;
            cfg.cb.on_call_state = &on_call_state;

            pjsua_logging_config_default(&log_cfg);
            log_cfg.console_level = 4;

            status = pjsua_init(&cfg, &log_cfg, NULL);
            if (status != PJ_SUCCESS) error_exit("Error in pjsua_init()", status);
        }

        /* Add UDP transport. */
        {
            pjsua_transport_config cfg;

            pjsua_transport_config_default(&cfg);
            cfg.port = 0;
            status = pjsua_transport_create(PJSIP_TRANSPORT_UDP, &cfg, NULL);
            if (status != PJ_SUCCESS) error_exit("Error creating transport", status);
        }

        /* Initialization is done, now start pjsua */
        status = pjsua_start();
        if (status != PJ_SUCCESS) error_exit("Error starting pjsua", status);

        /* Register to SIP server by creating SIP account. */
        {
            pjsua_acc_config cfg;

            pjsua_acc_config_default(&cfg);
            cfg.id = pj_str("sip:" SIP_USER "@" SIP_DOMAIN);
//      cfg.reg_uri = pj_str("sip:" SIP_DOMAIN ":5066");
            cfg.cred_count = 1;
            cfg.cred_info[0].realm = pj_str(SIP_DOMAIN);
            cfg.cred_info[0].scheme = pj_str("digest");
            cfg.cred_info[0].username = pj_str(SIP_USER);
            cfg.cred_info[0].data_type = PJSIP_CRED_DATA_PLAIN_PASSWD;
            cfg.cred_info[0].data = pj_str(SIP_PASSWD);

            status = pjsua_acc_add(&cfg, PJ_TRUE, &acc_id);
            if (status != PJ_SUCCESS) error_exit("Error adding account", status);
        }

        //    if (argc > 1) {
        //        pj_str_t uri = pj_str(argv[1]);
        //        status = pjsua_call_make_call(acc_id, &uri, 0, NULL, NULL, NULL);
        //        if (status != PJ_SUCCESS) error_exit("Error making call", status);
        //    }
    }

    PjSipModule::~PjSipModule(){
        pjsua_destroy();
    }

    void onCallDisconnected(){
        JNIEnv *env1;
        jint rs = jvm->AttachCurrentThread(&env1, NULL);
        jmethodID mid = env1->GetMethodID(javaClass, "bombom", "()V");
        env1->CallVoidMethod(nativeThis, mid);
        jvm->DetachCurrentThread();
    }

    void PjSipModule::on_call_state(pjsua_call_id call_id, pjsip_event *e)
    {
        pjsua_call_info ci;
        PJ_UNUSED_ARG(e);
        last_call_id = call_id;
        pjsua_call_get_info(call_id, &ci);

        if(ci.state == PJSIP_INV_STATE_DISCONNECTED){
            onCallDisconnected();
        }

        PJ_LOG(3,(THIS_FILE, "Call %d state=%.*s", call_id,
                (int)ci.state_text.slen,
                ci.state_text.ptr));
    }

    void PjSipModule::on_call_media_state(pjsua_call_id call_id)
    {
        pjsua_call_info ci;
        last_call_id = call_id;
        pjsua_call_get_info(call_id, &ci);

        //  pjmedia_aud_dev_route route = PJMEDIA_AUD_DEV_ROUTE_LOUDSPEAKER;
        //  pj_status_t status = pjsua_snd_set_setting(PJMEDIA_AUD_DEV_CAP_OUTPUT_ROUTE, &route, PJ_TRUE);
        //  if (status != PJ_SUCCESS){
        //    NSLog(@"Error enabling loudspeaker");
        //  }


        if (ci.media_status == PJSUA_CALL_MEDIA_ACTIVE) {
            // When media is active, connect call to sound device.
            pjsua_conf_connect(ci.conf_slot, 0);
            if(!isMuted)
                pjsua_conf_connect(0, ci.conf_slot);
            pjsipConfAudioId = ci.conf_slot;
        }
    }

    void PjSipModule::error_exit(const char *title, pj_status_t status)
    {
        pjsua_perror(THIS_FILE, title, status);
        //  pjsua_destroy();
        //  exit(1);
    }

    void PjSipModule::call(const char *currentUserId)
    {
        pj_thread_desc a_thread_desc;
        pj_thread_t *a_thread;
        if (!pj_thread_is_registered()) {
            pj_thread_register(NULL, a_thread_desc, &a_thread);
        }

        pj_str_t call_to = pj_str("sip:ghostcall@sip.ghostchat.app:5066");
        if (pj_strlen(&call_to) > 0) {

            pjsua_msg_data msg_data;
            pjsua_msg_data_init(&msg_data);

            pj_str_t headerKey = (pj_str_t)pj_str("CallerID");
            pj_str_t headerValue = (pj_str_t)pj_str((char*)currentUserId);

            pjsip_generic_string_hdr subject;
            pjsip_generic_string_hdr_init2 (&subject, &headerKey, &headerValue);
            pj_list_push_back(&msg_data.hdr_list, &subject);

            status = pjsua_call_make_call(acc_id, &call_to, 0, NULL, &msg_data, NULL);
            if (status != PJ_SUCCESS) error_exit("Error making call", status);
        }
    }

    void PjSipModule::hang()
    {
        pj_thread_desc a_thread_desc;
        pj_thread_t *a_thread;
        if (!pj_thread_is_registered()) {
            pj_thread_register(NULL, a_thread_desc, &a_thread);
        }

        pjsua_call_hangup_all();

    }

void PjSipModule::setMuted(bool isMute)
{
    isMuted = isMute;

    pj_thread_desc a_thread_desc;
    pj_thread_t *a_thread;
    if (!pj_thread_is_registered()) {
        pj_thread_register(NULL, a_thread_desc, &a_thread);
    }

    if( pjsipConfAudioId != 0 ) {
        if(isMuted)
            pjsua_conf_disconnect(0, pjsipConfAudioId);
        else
            pjsua_conf_connect(0,pjsipConfAudioId);
    }
}

void PjSipModule::sendKey(const char *key)
{
    pj_thread_desc a_thread_desc;
    pj_thread_t *a_thread;
    if (!pj_thread_is_registered()) {
        pj_thread_register(NULL, a_thread_desc, &a_thread);
    }

    pj_str_t dtmf_digits = pj_str((char*)key);
    status = pjsua_call_dial_dtmf(last_call_id, &dtmf_digits);
    if (status != PJ_SUCCESS) error_exit("Error making call", status);
}
