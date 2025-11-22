export function logError(error: Error, context?: Record<string, unknown>) {
  // In a real app, this would send to Sentry/OpenTelemetry
  console.error("[Observability] Error:", error.message, context);
}

export function logEvent(name: string, properties?: Record<string, unknown>) {
  // In a real app, this would send to PostHog/Mixpanel
  console.log("[Observability] Event:", name, properties);
}
