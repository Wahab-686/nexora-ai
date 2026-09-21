import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDC8ZAWBRZ_ThOSiBFzvYDlbhPdE2BYrfk",
  authDomain: "nexora-ai-c0df6.firebaseapp.com",
  projectId: "nexora-ai-c0df6",
  storageBucket: "nexora-ai-c0df6.firebasestorage.app",
  messagingSenderId: "474319168857",
  appId: "1:474319168857:web:99cf4a42c6969c33605848",
  measurementId: "G-QVLGBWT1LV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;