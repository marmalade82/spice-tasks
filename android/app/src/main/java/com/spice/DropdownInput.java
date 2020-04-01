package com.spice;


import android.content.Context;
import android.content.res.TypedArray;
import android.util.AttributeSet;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;

import androidx.appcompat.widget.AppCompatSpinner;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.ArrayList;


public class DropdownInput extends AppCompatSpinner {

    private int mHeight = 0;
    private int mWidth = 0;

    public static final String CHANGE_CHOICE = "changeChoice";

    AdapterView.OnItemSelectedListener mSelectListener = new AdapterView.OnItemSelectedListener() {
        @Override
        public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
            WritableMap event = Arguments.createMap();
            String choice = parent.getItemAtPosition(position).toString();
            event.putString("message", choice);
            ReactContext reactContext = (ReactContext) getContext();
            reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                    getId(),
                    CHANGE_CHOICE,
                    event);
        }

        @Override
        public void onNothingSelected(AdapterView<?> parent) {

        }
    };

    AdapterView.OnItemClickListener mClickListener = new AdapterView.OnItemClickListener() {
        @Override
        public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
            WritableMap event = Arguments.createMap();
            ArrayAdapter<String> adapter = (ArrayAdapter<String>)(parent.getAdapter());
            if(adapter != null) {
                String choice = adapter.getItem(position);
                if(choice != null) {
                    event.putString("message", choice);
                    ReactContext reactContext = (ReactContext) getContext();
                    reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                            getId(),
                            CHANGE_CHOICE,
                            event);
                } else {
                    event.putString("message", "CHOICE NOT FOUND");
                    ReactContext reactContext = (ReactContext) getContext();
                    reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                            getId(),
                            CHANGE_CHOICE,
                            event);
                    throw new RuntimeException();
                }
            } else {
                event.putString("message", "ADAPTER NOT FOUND");
                ReactContext reactContext = (ReactContext) getContext();
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                        getId(),
                        CHANGE_CHOICE,
                        event);
                throw new RuntimeException();
            }
        }
    };


    public DropdownInput(Context context) {
        super(context);

        this.setOnItemSelectedListener(mSelectListener);
    }

    public DropdownInput(Context context, int mode) {
        super(context, mode);

        this.setOnItemSelectedListener(mSelectListener);
    }

    public DropdownInput(Context context, AttributeSet attrs) {
        super(context, attrs);
        TypedArray a = context.getTheme().obtainStyledAttributes(
                attrs, R.styleable.Spinner, 0, 0
        );

        try {
            //mHeight = a.getInteger(R.styleable.Spinner_android_layout_height, 0);
            //mWidth = a.getInteger(R.styleable.Spinner_popupTheme, 0)
            this.setOnItemSelectedListener(mSelectListener);
        } finally {
            a.recycle();
        }
    }

    public void setHeight(int height) {
        mHeight = height;
        LayoutParams params = this.getLayoutParams();
        if(params == null) {
            params = new LayoutParams(this.width(), this.height());
        }
        params.height = height;
        this.setLayoutParams(params);
    }

    public void setWidth(int width) {
        mWidth = width;
        LayoutParams params = this.getLayoutParams();
        if(params == null) {
            params = new LayoutParams(this.width(), this.height());
        }
        params.width = width;
        this.setLayoutParams(params);
    }

    public int height() {
        LayoutParams params = this.getLayoutParams();
        if(params == null) {
            return 0;
        }
        return params.height;
    }

    public int width() {
        LayoutParams params = this.getLayoutParams();
        if(params == null) {
            return 0;
        }
        return params.width;
    }

    public void setChoices(ArrayList<Object> choices) {
        ArrayAdapter<Object> adapter = new ArrayAdapter<>(this.getContext(), android.R.layout.simple_spinner_item);
        adapter.addAll(choices);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        this.setAdapter(adapter);
        adapter.notifyDataSetChanged();

        this.setOnItemSelectedListener(mSelectListener);
    }

    public void setCurrent(int newPos) {
        Runnable setCurrent =
                new Runnable() {
                    public void run() {
                        setSelection(newPos, false);
                    }
                };
        postDelayed(setCurrent, 100);
    }


    private final Runnable measureAndLayout =
        new Runnable() {
            @Override
            public void run() {
                measure(
                        MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                        MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
                layout(getLeft(), getTop(), getRight(), getBottom());
            }
        };

    @Override
    public void requestLayout() {
        super.requestLayout();

        post(measureAndLayout);
    }
}
