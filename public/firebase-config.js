// firebase-config.js
// Configuración de Firebase - Reemplaza con tus datos
const firebaseConfig = {
    apiKey: "AIzaSyBSyYmLegbNuhqMLp6SUpi7kFL_zKkivA0",
    authDomain: "clientes-app-920c3.firebaseapp.com",
    projectId: "clientes-app-920c3",
    storageBucket: "clientes-app-920c3.firebasestorage.app",
    messagingSenderId: "67361172916",
    appId: "1:67361172916:web:3b5425bcbd7cc2f86fd6e1"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar Firestore
const db = firebase.firestore();

// Exportar para usar en otros archivos
window.db = db;
window.firebaseApp = firebase.app();