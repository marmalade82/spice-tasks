package com.spice;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;

import androidx.work.ListenableWorker;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.common.util.concurrent.ListenableFuture;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import android.widget.Toast;


import javax.annotation.Nonnull;

public class DBWorker extends Worker {
    private static ReactApplicationContext reactContext;

    public DBWorker( @Nonnull Context context,
                    @Nonnull WorkerParameters params

                    ) {
        super(context, params);
    }

    @Override
    public Result doWork() {


        Intent service = new Intent(getApplicationContext(), HeadlessDBService.class);
        Bundle bundle = new Bundle();

        service.putExtras(bundle);

        getApplicationContext().startService(service);

        return Result.success();
    }
}
