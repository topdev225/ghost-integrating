#include <jni.h>
#include "PjSipModule.h"


extern "C"
JNIEXPORT jint JNICALL
Java_com_symbaventures_ghostchat_PjSipModule_initPjSip(
        JNIEnv *env,
        jobject /* this */) {
    return 0;
}

extern "C"
JNIEXPORT PjSipModule* JNICALL
Java_com_symbaventures_ghostchat_PjSipModule_call(
        JNIEnv *env,
        jobject _this, jstring currentUserId, jint pointer) {
    PjSipModule* pjSip;
    if(pointer == 0) {

        JavaVM *jvm;
        jobject nativeThis;
        env->GetJavaVM(&jvm);
        nativeThis = env->NewGlobalRef(_this);
        jclass javaClass = env->FindClass("com/symbaventures/ghostchat/PjSipModule");
        jclass globallJavaClass = (_jclass*)env->NewGlobalRef(javaClass);
        env->DeleteLocalRef(javaClass);

        pjSip = new PjSipModule(nativeThis, jvm, globallJavaClass);
    }
    else
        pjSip = (PjSipModule*) pointer;
    pjSip->call(env->GetStringUTFChars(currentUserId, 0));
    return pjSip;
}

extern "C"
JNIEXPORT jint JNICALL
Java_com_symbaventures_ghostchat_PjSipModule_hang(
        JNIEnv *env,
        jobject /* this */, jint pointer) {

    PjSipModule* pjSip = (PjSipModule*)pointer;
    pjSip->hang();
    return 0;
}

extern "C"
JNIEXPORT jint JNICALL
Java_com_symbaventures_ghostchat_PjSipModule_setMuted(
        JNIEnv *env,
        jobject /* this */, jboolean isMuted, jint pointer) {

    PjSipModule* pjSip = (PjSipModule*)pointer;
    pjSip->setMuted(isMuted);
    return 0;
}


extern "C"
JNIEXPORT jint JNICALL
Java_com_symbaventures_ghostchat_PjSipModule_sendKey(
        JNIEnv *env,
        jobject /* this */, jstring key, jint pointer) {
    const char *native_key = env->GetStringUTFChars(key, 0);
    PjSipModule* pjSip = (PjSipModule*)pointer;
    pjSip->sendKey(native_key);
    env->ReleaseStringUTFChars(key, native_key);
    return 0;
}

