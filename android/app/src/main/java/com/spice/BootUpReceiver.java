package com.spice;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/**
 * When registered, this class guarantees that the service will start when the device restarts.
 */
public class BootUpReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        context.startService(new Intent(context, DBServiceImplementation.class));
    }
}
