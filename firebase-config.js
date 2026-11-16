// ===================================================
//  DemoSender — Firebase Cloud Database Configuration
// ===================================================

const firebaseConfig = {
  apiKey: "AIzaSyCP963iDqc8r0jYkmlHhkA17IZ1UlPLDf0",
  authDomain: "demosender.firebaseapp.com",
  projectId: "demosender",
  storageBucket: "demosender.firebasestorage.app",
  messagingSenderId: "35339045232",
  appId: "1:35339045232:web:b5b908ed3882eb631167b5",
  measurementId: "G-FB68N4BEV9"
};

var db = null;
var isFirebaseReady = false;

try {
  if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();

    // Enable offline persistence for seamless local & cloud experience
    if (typeof db.enablePersistence === 'function') {
      db.enablePersistence({ synchronizeTabs: true }).catch(function (err) {
        if (err.code === 'failed-precondition') {
          console.warn('Multiple tabs open, persistence enabled in first tab only.');
        } else if (err.code === 'unimplemented') {
          console.warn('Current browser does not support offline persistence.');
        }
      });
    }

    isFirebaseReady = true;
    console.log('🔥 Firebase Cloud Firestore initialized successfully!');
  }
} catch (e) {
  console.warn('Firebase init notice:', e);
  isFirebaseReady = false;
}
