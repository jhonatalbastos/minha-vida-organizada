package com.jhona.organizacao.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

import com.jhona.organizacao.R;

public class RoutineWidgetProvider extends AppWidgetProvider {

    private static final String PREFS_NAME = "MinhaVidaWidget";
    private static final String PREFS_KEY = "widget_data";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            // Always start with a safe fallback — try/catch ensures no crash
            try {
                RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_layout_minimal);

                // Try reading prefs, but don't crash if it fails
                try {
                    SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
                    String jsonString = prefs.getString(PREFS_KEY, "");
                    if (jsonString.isEmpty()) {
                        views.setTextViewText(R.id.widget_text, "📋 Minha Vida\nAbra o app para carregar");
                    } else {
                        views.setTextViewText(R.id.widget_text, "📋 Minha Vida\nDados carregados! ✅");
                    }
                } catch (Exception e) {
                    views.setTextViewText(R.id.widget_text, "📋 Minha Vida\nAguardando dados...");
                }

                appWidgetManager.updateAppWidget(appWidgetId, views);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void onEnabled(Context context) {
        try {
            AppWidgetManager manager = AppWidgetManager.getInstance(context);
            android.content.ComponentName cn = new android.content.ComponentName(context, RoutineWidgetProvider.class);
            int[] ids = manager.getAppWidgetIds(cn);
            onUpdate(context, manager, ids);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
