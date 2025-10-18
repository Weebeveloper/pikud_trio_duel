self.addEventListener("push", function (event) {
  const options = {
    body: "זומן עליך TRIO DUEL",
    icon: "assets/alert.png",
    vibrate: [100, 50, 100],
    data: { dateOfArrival: Date.now(), primaryKey: "2" },
  };

  event.waitUntil(self.registration.showNotification("התראת פלישה", options));
});
