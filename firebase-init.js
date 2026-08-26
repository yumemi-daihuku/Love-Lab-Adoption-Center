// Firebase 初期化（Realtime Database を使用）
// このファイルは全ページから <script type="module"> で読み込まれる共通モジュール。
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  get,
  update,
  remove,
  onValue,
  child,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBpf3a57JlglC2-MyVoyznQ3DxceHme83w",
  authDomain: "mederabo.firebaseapp.com",
  projectId: "mederabo",
  storageBucket: "mederabo.firebasestorage.app",
  messagingSenderId: "493346433634",
  appId: "1:493346433634:web:bba57512e31d686ef4bf3b",
  measurementId: "G-NZ47KEH7PW",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { app, db, ref, push, set, get, update, remove, onValue, child };
