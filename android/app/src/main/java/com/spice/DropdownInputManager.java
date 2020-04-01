package com.spice;

import android.content.DialogInterface;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Spinner;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableNativeArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.ArrayList;
import java.util.Map;

public class DropdownInputManager extends SimpleViewManager<DropdownInput> {
    public static final String REACT_CLASS = "RCTDropdownInput";
    ReactApplicationContext mCallerContext;

    public DropdownInputManager(ReactApplicationContext context) {
        mCallerContext = context;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public DropdownInput createViewInstance(ThemedReactContext context) {
        //DropdownInput input = (DropdownInput) findViewById(R.id.dropdown);
        DropdownInput input = new DropdownInput(context, Spinner.MODE_DROPDOWN);

        return input;
    }

    @ReactProp(name = "height")
    public void setHeight(DropdownInput input, int height) {
        input.setHeight(height);
    }

    @ReactProp(name = "width")
    public void setWidth(DropdownInput input, int width) {
        input.setWidth(width);
    }

    @ReactProp(name ="choices")
    public void setChoices(DropdownInput input, ReadableArray arr) {
        ReadableNativeArray nat = (ReadableNativeArray) arr;
        ArrayList<Object> choices = (ArrayList<Object>)nat.toArrayList();
        input.setChoices(choices);
    }


    @ReactProp(name = "current")
    public void setCurrent(DropdownInput input, int current) {
        input.setCurrent(current);
    }

    public Map getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.builder()
                .put(
                        DropdownInput.CHANGE_CHOICE,
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of("bubbled", "onChange")))
                .build();
    }

}
