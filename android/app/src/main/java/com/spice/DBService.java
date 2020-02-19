package com.spice;

import android.content.Intent;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class DBService extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    public DBService(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "SpiceDBService";
    }

    @ReactMethod
    public void startService() {
        this.reactContext.startService(new Intent(this.reactContext, DBServiceImplementation.class));
    }

    @ReactMethod
    public void stopService() {

    }
}
