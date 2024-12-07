import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAyAXpz90m27RtzQ86tm3TZenmPcGvZyeE",
  authDomain: "back-end-t-shop.firebaseapp.com",
  databaseURL: "https://back-end-t-shop-default-rtdb.firebaseio.com",
  projectId: "back-end-t-shop",
  storageBucket: "back-end-t-shop.appspot.com",
  messagingSenderId: "139108154186",
  appId: "1:139108154186:web:c73ef4350e00b23a721fb3",
  measurementId: "G-E03GQR5Z2Z"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  console.log(permission);
  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: "BEm6eOKiNtv7_RufJJLzUleks9uFa-E1apoJkJFLvfksO7886sd6btxAQhJmo3zn41VmayZRM4nT7c_MkHgOqrI"
    });
    console.log(token);
   
  }
};

