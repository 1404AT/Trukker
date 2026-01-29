// ==========================================
// AUTENTICACIÓN REAL - FIREBASE AUTH
// ==========================================

// Verificar usuario autenticado
function checkAuth() {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            // Usuario no autenticado, redirige a login
            if (window.location.pathname !== '/login.html' && window.location.pathname !== '/register.html') {
                window.location.href = 'login.html';
            }
        }
    });
}

// Registrar usuario
async function registerUser(email, password, userData) {
    try {
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const uid = userCredential.user.uid;

        // Guardar datos en Firestore
        await firebase.firestore().collection('users').doc(uid).set({
            uid: uid,
            email: email,
            ...userData,
            createdAt: new Date(),
            verificado: false
        });

        return { success: true, uid: uid };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Login usuario
async function loginUser(email, password) {
    try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        const uid = userCredential.user.uid;

        // Obtener rol
        const userDoc = await firebase.firestore().collection('users').doc(uid).get();
        const role = userDoc.data().role;

        return { success: true, uid: uid, role: role };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Logout usuario
async function logoutUser() {
    try {
        await firebase.auth().signOut();
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error logout:', error);
    }
}

// Recuperar contraseña
async function resetPassword(email) {
    try {
        await firebase.auth().sendPasswordResetEmail(email);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Obtener usuario actual
function getCurrentUser() {
    return firebase.auth().currentUser;
}

// Escuchar cambios de autenticación
function onAuthChange(callback) {
    firebase.auth().onAuthStateChanged(callback);
}

console.log('✅ Auth-real.js cargado');