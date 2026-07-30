package com.jhona.organizacao.widget;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.widget.RemoteViews;

import com.jhona.organizacao.R;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;

public class RoutineWidgetProvider extends AppWidgetProvider {

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

            // Lê o arquivo JSON escrito pelo app via @capacitor/filesystem
            String jsonString = readWidgetFile(context);

            if (jsonString == null || jsonString.isEmpty()) {
                views.setTextViewText(R.id.widget_text, "📋 Minha Vida\nAbra o app e toque em 'Sincronizar widget'");
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
                    } else {
                        sb.append("🎉 Dia livre!");
                    }

                    views.setTextViewText(R.id.widget_text, sb.toString().trim());

                } catch (Exception e) {
                    views.setTextViewText(R.id.widget_text, "📋 Minha Vida\nErro ao ler dados");
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

    /**
     * Lê o arquivo widget_data.json do diretório Documents do app.
     * Este arquivo é escrito pelo @capacitor/filesystem.
     */
    private String readWidgetFile(Context context) {
        try {
            File file = new File(context.getFilesDir(), "Documents/widget_data.json");
            if (!file.exists()) return null;

            FileInputStream fis = new FileInputStream(file);
            BufferedReader reader = new BufferedReader(new InputStreamReader(fis, "UTF-8"));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            reader.close();
            fis.close();
            return sb.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
