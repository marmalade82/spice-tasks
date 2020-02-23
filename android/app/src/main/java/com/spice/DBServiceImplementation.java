package com.spice;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Binder;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;

import androidx.core.app.NotificationCompat;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class DBServiceImplementation extends Service {

    public DBServiceImplementation() {

    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private Handler handler = new Handler();
    private Runnable runnable = new Runnable() {
        @Override
        public void run() {
            //reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("Refresh",null);
            handler.postDelayed(this, 1000);// Run every second
        }
    };

    private static final String CHANNEL_ID = "SPICE_DB_SERVICE";

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "SPICE_DB_SERVICE", importance);
            channel.setDescription("Keeping your Spice tasks up to date...");
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    private static final int DB_SERVICE_NOTIFICATION_ID = 1;

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        ReactContext r = ((MainApplication) getApplicationContext()).getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
        r.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("Refresh",null);

        //this.handler.post(this.runnable);
        /*createNotificationChannel(); // Creating channel for API 26+
        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent contentIntent = PendingIntent.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_CANCEL_CURRENT);
        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Spice Service")
                .setContentText("Running…")
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentIntent(contentIntent)
                .setOngoing(true)
                .build();
        startForeground(DB_SERVICE_NOTIFICATION_ID, notification);*/

        return START_NOT_STICKY;
    }

}
