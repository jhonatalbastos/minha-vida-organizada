package com.jhona.organizacao.plugin;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.jhona.organizacao.widget.RoutineWidgetProvider;

@CapacitorPlugin(name = "WidgetDataBridge")
public class WidgetDataBridge extends Plugin {

    private static final String PREFS_NAME = "MinhaVidaWidget";
    private static final String PREFS_KEY = "widget_data";

    @PluginMethod
    public void syncWidgetData(PluginCall call) {
        String data = call.getString("data");
        if (data == null) {
            call.reject("Data parameter is required");
            return;
        }

        // Save to a dedicated SharedPreferences file
        SharedPreferences prefs = getActivity().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().putString(PREFS_KEY, data).apply();

        // Trigger widget update
        triggerWidgetUpdate();

        JSObject result = new JSObject();
        result.put("success", true);
        call.resolve(result);
    }

    private void triggerWidgetUpdate() {
        Context context = getActivity().getApplicationContext();
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        ComponentName componentName = new ComponentName(context, RoutineWidgetProvider.class);
        int[] appWidgetIds = manager.getAppWidgetIds(componentName);

        if (appWidgetIds != null && appWidgetIds.length > 0) {
            Intent intent = new Intent(context, RoutineWidgetProvider.class);
            intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
            intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, appWidgetIds);
            context.sendBroadcast(intent);
        }
    }
}
