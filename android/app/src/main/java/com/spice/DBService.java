package com.spice;

import android.content.Context;
import android.content.Intent;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import android.os.Handler;
import android.widget.Toast;
import androidx.work.*;

import java.util.concurrent.TimeUnit;

import javax.annotation.Nonnull;

public class DBService extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    public DBService(@Nonnull ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "SpiceDBService";
    }


    @ReactMethod
    public void startService() {
        stopService(); // make sure to clear any existing running work requests before starting another one.
        PeriodicWorkRequest r = new PeriodicWorkRequest.Builder(DBWorker.class, 15, TimeUnit.MINUTES).addTag("DB").build();

        WorkManager.getInstance(getCurrentActivity()).enqueue(r);
    }

    @ReactMethod
    public void stopService() {
        WorkManager.getInstance(getCurrentActivity()).cancelAllWorkByTag("DB");
    }
}
