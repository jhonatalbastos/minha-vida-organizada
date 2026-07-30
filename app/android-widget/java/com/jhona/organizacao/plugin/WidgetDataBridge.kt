package com.jhona.organizacao.plugin

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.jhona.organizacao.widget.RoutineWidgetProvider

@com.getcapacitor.annotation.CapacitorPlugin(name = "WidgetDataBridge")
class WidgetDataBridge : Plugin() {

    @PluginMethod
    fun syncWidgetData(call: PluginCall) {
        val data = call.getString("data")
        if (data == null) {
            call.reject("Data parameter is required")
            return
        }

        // Save to a dedicated SharedPreferences file
        val prefs = activity.getSharedPreferences("MinhaVidaWidget", Context.MODE_PRIVATE)
        prefs.edit().putString("widget_data", data).apply()

        // Trigger widget update
        triggerWidgetUpdate()

        call.resolve(JSObject().apply {
            put("success", true)
        })
    }

    private fun triggerWidgetUpdate() {
        val context = activity.applicationContext
        val manager = AppWidgetManager.getInstance(context)
        val componentName = ComponentName(context, RoutineWidgetProvider::class.java)
        val appWidgetIds = manager.getAppWidgetIds(componentName)

        if (appWidgetIds.isNotEmpty()) {
            // Send broadcast to update all widgets
            val intent = Intent(context, RoutineWidgetProvider::class.java)
            intent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
            intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, appWidgetIds)
            context.sendBroadcast(intent)
        }
    }
}
