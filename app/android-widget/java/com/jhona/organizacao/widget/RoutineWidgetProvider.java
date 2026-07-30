package com.jhona.organizacao.widget;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

import com.jhona.organizacao.R;
import org.json.JSONArray;
import org.json.JSONObject;

public class RoutineWidgetProvider extends AppWidgetProvider {

    private static final String PREFS_NAME = "MinhaVidaWidget";
    private static final String PREFS_KEY = "widget_data";

    private static final int[] ITEM_VIEWS = {
        R.id.item_1, R.id.item_2, R.id.item_3, R.id.item_4, R.id.item_5
    };
    private static final int[] ITEM_CHECKS = {
        R.id.item_1_check, R.id.item_2_check, R.id.item_3_check,
        R.id.item_4_check, R.id.item_5_check
    };
    private static final int[] ITEM_TIMES = {
        R.id.item_1_time, R.id.item_2_time, R.id.item_3_time,
        R.id.item_4_time, R.id.item_5_time
    };
    private static final int[] ITEM_TEXTS = {
        R.id.item_1_text, R.id.item_2_text, R.id.item_3_text,
        R.id.item_4_text, R.id.item_5_text
    };

    private static final int MAX_ITEMS = 5;

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId);
        }
    }

    @Override
    public void onEnabled(Context context) {
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        android.content.ComponentName componentName =
            new android.content.ComponentName(context, RoutineWidgetProvider.class);
        int[] ids = manager.getAppWidgetIds(componentName);
        onUpdate(context, manager, ids);
    }

    private void updateWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_layout);

        // Read data from SharedPreferences (written by the web app)
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String jsonString = prefs.getString(PREFS_KEY, "{}");

        try {
            JSONObject data = new JSONObject(jsonString);
            JSONArray items = data.optJSONArray("items");
            String progress = data.optString("progress", "0%");
            String dateLabel = data.optString("date", "");

            // Update progress header
            views.setTextViewText(R.id.widget_progress, progress + " " + dateLabel);

            if (items != null && items.length() > 0) {
                // Hide empty state
                views.setViewVisibility(R.id.widget_empty, android.view.View.GONE);

                int count = Math.min(items.length(), MAX_ITEMS);
                for (int i = 0; i < count; i++) {
                    JSONObject item = items.getJSONObject(i);

                    views.setViewVisibility(ITEM_VIEWS[i], android.view.View.VISIBLE);

                    boolean isDone = item.optBoolean("done", false);
                    views.setTextViewText(ITEM_CHECKS[i], isDone ? "✅" : "⏳");
                    views.setTextViewText(ITEM_TIMES[i], item.optString("time", ""));

                    String emoji = item.optString("emoji", "");
                    String activity = item.optString("activity", "");
                    views.setTextViewText(ITEM_TEXTS[i], emoji + " " + activity);
                }

                // Hide remaining unused slots
                for (int i = count; i < MAX_ITEMS; i++) {
                    views.setViewVisibility(ITEM_VIEWS[i], android.view.View.GONE);
                }
            } else {
                views.setViewVisibility(R.id.widget_empty, android.view.View.VISIBLE);
                for (int i = 0; i < MAX_ITEMS; i++) {
                    views.setViewVisibility(ITEM_VIEWS[i], android.view.View.GONE);
                }
            }
        } catch (Exception e) {
            views.setViewVisibility(R.id.widget_empty, android.view.View.VISIBLE);
            views.setTextViewText(R.id.widget_empty, "📋 Abra o app para carregar");
            for (int i = 0; i < MAX_ITEMS; i++) {
                views.setViewVisibility(ITEM_VIEWS[i], android.view.View.GONE);
            }
        }

        // Click handler: open the app when tapping the footer
        Intent intent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
        if (intent != null) {
            PendingIntent pendingIntent = PendingIntent.getActivity(
                context, 0, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
            views.setOnClickPendingIntent(R.id.widget_footer, pendingIntent);
        }

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}
