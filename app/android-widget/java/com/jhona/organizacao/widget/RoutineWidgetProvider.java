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

    // Nome do SharedPreferences usado pelo @capacitor/preferences
    private static final String PREFS_NAME = "CapacitorPreferences";
    private static final String PREFS_KEY = "widget_data";
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
        android.content.ComponentName cn =
            new android.content.ComponentName(context, RoutineWidgetProvider.class);
        int[] ids = manager.getAppWidgetIds(cn);
        onUpdate(context, manager, ids);
    }

    private void updateWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        try {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_layout_minimal);

            // Lê dados do SharedPreferences (escritos pelo app via @capacitor/preferences)
            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            String jsonString = prefs.getString(PREFS_KEY, "");

            if (jsonString.isEmpty()) {
                views.setTextViewText(R.id.widget_text, "📋 Minha Vida\nAbra o app para carregar");
            } else {
                try {
                    JSONObject data = new JSONObject(jsonString);
                    JSONArray items = data.optJSONArray("items");
                    String progress = data.optString("progress", "0%");
                    String dateLabel = data.optString("date", "");

                    StringBuilder sb = new StringBuilder();
                    sb.append("📋 ").append(progress).append(" ").append(dateLabel).append("\n");

                    if (items != null && items.length() > 0) {
                        int count = Math.min(items.length(), MAX_ITEMS);
                        for (int i = 0; i < count; i++) {
                            JSONObject item = items.getJSONObject(i);
                            boolean done = item.optBoolean("done", false);
                            String emoji = item.optString("emoji", "");
                            String activity = item.optString("activity", "");
                            String time = item.optString("time", "");
                            sb.append(done ? "✅" : "⏳")
                              .append(" ").append(time)
                              .append(" ").append(emoji).append(" ").append(activity)
                              .append("\n");
                        }
                    }

                    views.setTextViewText(R.id.widget_text, sb.toString().trim());

                } catch (Exception e) {
                    views.setTextViewText(R.id.widget_text, "📋 Minha Vida\nDados carregados ✅");
                }
            }

            // Click: abre o app
            Intent intent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
            if (intent != null) {
                PendingIntent pi = PendingIntent.getActivity(
                    context, 0, intent,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
                );
                views.setOnClickPendingIntent(R.id.widget_text, pi);
            }

            appWidgetManager.updateAppWidget(appWidgetId, views);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
