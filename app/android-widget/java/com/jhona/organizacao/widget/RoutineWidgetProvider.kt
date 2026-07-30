package com.jhona.organizacao.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import org.json.JSONArray
import org.json.JSONObject

class RoutineWidgetProvider : AppWidgetProvider() {

    companion object {
        private val ITEM_VIEWS = intArrayOf(
            R.id.item_1, R.id.item_2, R.id.item_3, R.id.item_4, R.id.item_5
        )
        private val ITEM_CHECKS = intArrayOf(
            R.id.item_1_check, R.id.item_2_check, R.id.item_3_check,
            R.id.item_4_check, R.id.item_5_check
        )
        private val ITEM_TIMES = intArrayOf(
            R.id.item_1_time, R.id.item_2_time, R.id.item_3_time,
            R.id.item_4_time, R.id.item_5_time
        )
        private val ITEM_TEXTS = intArrayOf(
            R.id.item_1_text, R.id.item_2_text, R.id.item_3_text,
            R.id.item_4_text, R.id.item_5_text
        )
    }

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onEnabled(context: Context) {
        // Called when the first widget instance is added — force immediate update
        val manager = AppWidgetManager.getInstance(context)
        val componentName = android.content.ComponentName(
            context, RoutineWidgetProvider::class.java
        )
        val ids = manager.getAppWidgetIds(componentName)
        onUpdate(context, manager, ids)
    }

    private fun updateWidget(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetId: Int
    ) {
        val views = RemoteViews(context.packageName, R.layout.widget_layout)

        // --- Read data from SharedPreferences (written by the web app) ---
        val prefs = context.getSharedPreferences("MinhaVidaWidget", Context.MODE_PRIVATE)
        val jsonString = prefs.getString("widget_data", "{}") ?: "{}"

        try {
            val data = JSONObject(jsonString)
            val items = data.optJSONArray("items")
            val progress = data.optString("progress", "0%")
            val dateLabel = data.optString("date", "")

            // Update progress header
            views.setTextViewText(R.id.widget_progress, "$progress $dateLabel")

            if (items != null && items.length() > 0) {
                views.setViewVisibility(R.id.widget_empty, android.view.View.GONE)

                val count = minOf(items.length(), 5)
                for (i in 0 until count) {
                    val item = items.getJSONObject(i)
                    views.setViewVisibility(ITEM_VIEWS[i], android.view.View.VISIBLE)

                    val isDone = item.optBoolean("done", false)
                    views.setTextViewText(ITEM_CHECKS[i], if (isDone) "✅" else "⏳")
                    views.setTextViewText(ITEM_TIMES[i], item.optString("time", ""))

                    val emoji = item.optString("emoji", "")
                    val activity = item.optString("activity", "")
                    views.setTextViewText(ITEM_TEXTS[i], "$emoji $activity")
                }

                // Hide remaining unused slots
                for (i in count until 5) {
                    views.setViewVisibility(ITEM_VIEWS[i], android.view.View.GONE)
                }
            } else {
                views.setViewVisibility(R.id.widget_empty, android.view.View.VISIBLE)
                for (i in 0 until 5) {
                    views.setViewVisibility(ITEM_VIEWS[i], android.view.View.GONE)
                }
            }
        } catch (e: Exception) {
            views.setViewVisibility(R.id.widget_empty, android.view.View.VISIBLE)
            views.setTextViewText(R.id.widget_empty, "📋 Abra o app para carregar")
            for (i in 0 until 5) {
                views.setViewVisibility(ITEM_VIEWS[i], android.view.View.GONE)
            }
        }

        // --- Click handler: open the app ---
        val intent = context.packageManager.getLaunchIntentForPackage(context.packageName)
        if (intent != null) {
            val pendingIntent = PendingIntent.getActivity(
                context, 0, intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_footer, pendingIntent)
        }

        appWidgetManager.updateAppWidget(appWidgetId, views)
    }
}
