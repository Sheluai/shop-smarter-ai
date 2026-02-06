// ShopXAI Service Worker for Push Notifications

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

// Listen for messages from the app to show notifications
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SHOW_NOTIFICATION") {
    const { title, body, icon, data } = event.data.payload;
    self.registration.showNotification(title, {
      body,
      icon: icon || "/favicon.ico",
      badge: "/favicon.ico",
      vibrate: [200, 100, 200],
      data,
      actions: [
        { action: "view", title: "View Deal" },
        { action: "dismiss", title: "Dismiss" },
      ],
    });
  }
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const productId = event.notification.data?.productId;
  const url = productId ? `/product/${productId}` : "/alerts";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // Focus existing window if available
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin)) {
          client.navigate(url);
          return client.focus();
        }
      }
      // Otherwise open new window
      return clients.openWindow(url);
    })
  );
});

