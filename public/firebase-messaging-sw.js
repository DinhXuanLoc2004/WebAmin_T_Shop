importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');
firebase.initializeApp({
  apiKey: "AIzaSyAyAXpz90m27RtzQ86tm3TZenmPcGvZyeE",
  authDomain: "back-end-t-shop.firebaseapp.com",
  databaseURL: "https://back-end-t-shop-default-rtdb.firebaseio.com",
  projectId: "back-end-t-shop",
  storageBucket: "back-end-t-shop.appspot.com",
  messagingSenderId: "139108154186",
  appId: "1:139108154186:web:c73ef4350e00b23a721fb3",
  measurementId: "G-E03GQR5Z2Z"
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage(function(payload) {
  console.log('[Firebase Messaging] Background Message received: ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});