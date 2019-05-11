#ifndef FAKECALLER_PJSIPMODULE_H
#define FAKECALLER_PJSIPMODULE_H

#endif //FAKECALLER_PJSIPMODULE_H

#include <jni.h>
#include <string>
#include <pjsua.h>

static pjsua_acc_id acc_id;
static pj_status_t status;
static pjsua_call_id last_call_id;
static pjsua_conf_port_id pjsipConfAudioId;
static bool isMuted;
static jobject nativeThis;
static JavaVM *jvm;
static jclass javaClass;

class PjSipModule{

#define THIS_FILE "APP"
#define SIP_DOMAIN "sip.ghostchat.app"
#define SIP_USER "android"
#define SIP_PASSWD "s3cr3tp455w0rdz!!"

public:

    PjSipModule(jobject _nativeThis, JavaVM *jvm, jclass javaClass);

    ~PjSipModule();

    static void on_call_state(pjsua_call_id call_id, pjsip_event *e);

    static void on_call_media_state(pjsua_call_id call_id);

    void error_exit(const char *title, pj_status_t status);

    void call(const char *currentUserId);

    void hang();

    void setMuted(bool isMuted);

    void sendKey(const char *key);

};


