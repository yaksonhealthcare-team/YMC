importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBfgTaIp8DbdpsZOQMgSKTwAIlMx7RwIcE',
  authDomain: 'therapist-dd196.firebaseapp.com',
  projectId: 'therapist-dd196',
  storageBucket: 'therapist-dd196.firebasestorage.app',
  messagingSenderId: '39001505358',
  appId: '1:39001505358:web:a68d1851390d2e766d4d1f',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('백그라운드 메시지 수신:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
}); 