package com.jhona.organizacao.plugin;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.jhona.organizacao.widget.RoutineWidgetProvider;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;

@CapacitorPlugin(name = "WidgetDataBridge")
public class WidgetDataBridge extends Plugin {

    @PluginMethod
    public void syncWidgetData(PluginCall call) {
        String data = call.getString("data");
        if (data == null) {
            call.reject("Data parameter is required");
            return;
        }

        Context context = getActivity().getApplicationContext();

        // 1) Salva no mesmo arquivo que o widget lê
        try {
            File dir = new File(context.getFilesDir(), "Documents");
            if (!dir.exists()) dir.mkdirs();
            File file = new File(dir, "widget_data.json");
            FileOutputStream fos = new FileOutputStream(file);
            OutputStreamWriter writer = new OutputStreamWriter(fos, StandardCharsets.UTF_8);
            writer.write(data);
            writer.flush();
            writer.close();
            fos.close();
        } catch (Exception e) {
            call.reject("Failed to write file: " + e.getMessage());
            return;
        }

        // 2) Força atualização do widget imediatamente
        try {
            AppWidgetManager manager = AppWidgetManager.getInstance(context);
            ComponentName componentName = new ComponentName(context, RoutineWidgetProvider.class);
            int[] appWidgetIds = manager.getAppWidgetIds(componentName);
            if (appWidgetIds != null && appWidgetIds.length > 0) {
                Intent intent = new Intent(context, RoutineWidgetProvider.class);
                intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
                intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, appWidgetIds);
                context.sendBroadcast(intent);
            }
        } catch (Exception e) {
            // Não crítico — widget atualiza no próximo ciclo
            System.err.println("Widget refresh failed: " + e.getMessage());
        }

        JSObject result = new JSObject();
        result.put("success", true);
        call.resolve(result);
    }
}
