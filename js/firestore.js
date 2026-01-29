// ==========================================
// FIRESTORE - MANEJO DE BASE DE DATOS
// ==========================================

const db = firebase.firestore();

// ===== USUARIOS =====

// Crear usuario
async function crearUsuario(uid, datos) {
    try {
        await db.collection('users').doc(uid).set(datos);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Obtener usuario
async function obtenerUsuario(uid) {
    try {
        const doc = await db.collection('users').doc(uid).get();
        return doc.exists ? doc.data() : null;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// Actualizar usuario
async function actualizarUsuario(uid, datos) {
    try {
        await db.collection('users').doc(uid).update(datos);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ===== TRANSPORTISTAS =====

// Crear perfil transportista
async function crearTransportista(uid, datos) {
    try {
        await db.collection('transportistas').doc(uid).set(datos);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Obtener perfil transportista
async function obtenerTransportista(uid) {
    try {
        const doc = await db.collection('transportistas').doc(uid).get();
        return doc.exists ? doc.data() : null;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// Listar todos los transportistas
async function listarTransportistas() {
    try {
        const snapshot = await db.collection('transportistas').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// ===== EMPRESAS =====

// Crear perfil empresa
async function crearEmpresa(uid, datos) {
    try {
        await db.collection('empresas').doc(uid).set(datos);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Obtener perfil empresa
async function obtenerEmpresa(uid) {
    try {
        const doc = await db.collection('empresas').doc(uid).get();
        return doc.exists ? doc.data() : null;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// Listar todas las empresas
async function listarEmpresas() {
    try {
        const snapshot = await db.collection('empresas').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// ===== CAPACIDADES =====

// Crear capacidad
async function crearCapacidad(datos) {
    try {
        const ref = await db.collection('capacidades').add(datos);
        return { success: true, id: ref.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Obtener capacidades de un transportista
async function obtenerCapacidades(uid) {
    try {
        const snapshot = await db.collection('capacidades').where('uid', '==', uid).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// Listar todas las capacidades
async function listarCapacidades() {
    try {
        const snapshot = await db.collection('capacidades').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// Eliminar capacidad
async function eliminarCapacidad(capacidadId) {
    try {
        await db.collection('capacidades').doc(capacidadId).delete();
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ===== SOLICITUDES =====

// Crear solicitud
async function crearSolicitud(datos) {
    try {
        const ref = await db.collection('solicitudes').add(datos);
        return { success: true, id: ref.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Obtener solicitudes de una empresa
async function obtenerSolicitudes(uid) {
    try {
        const snapshot = await db.collection('solicitudes').where('uid', '==', uid).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// Listar todas las solicitudes
async function listarSolicitudes() {
    try {
        const snapshot = await db.collection('solicitudes').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// Eliminar solicitud
async function eliminarSolicitud(solicitudId) {
    try {
        await db.collection('solicitudes').doc(solicitudId).delete();
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ===== MATCHES (VIAJES ACEPTADOS) =====

// Crear match (viaje aceptado)
async function crearMatch(datos) {
    try {
        const ref = await db.collection('matches').add(datos);
        return { success: true, id: ref.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Obtener matches de un transportista
async function obtenerMatchesTransportista(uid) {
    try {
        const snapshot = await db.collection('matches').where('transportistaId', '==', uid).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// Obtener matches de una empresa
async function obtenerMatchesEmpresa(uid) {
    try {
        const snapshot = await db.collection('matches').where('empresaId', '==', uid).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// Actualizar estado match
async function actualizarMatch(matchId, estado) {
    try {
        await db.collection('matches').doc(matchId).update({ estado: estado });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ===== ESTADÍSTICAS =====

// Obtener estadísticas globales
async function obtenerEstadisticas() {
    try {
        const usersSnap = await db.collection('users').get();
        const capacidadesSnap = await db.collection('capacidades').get();
        const solicitudesSnap = await db.collection('solicitudes').get();
        const matchesSnap = await db.collection('matches').get();

        return {
            totalUsuarios: usersSnap.size,
            totalCapacidades: capacidadesSnap.size,
            totalSolicitudes: solicitudesSnap.size,
            totalMatches: matchesSnap.size
        };
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

console.log('✅ Firestore.js cargado');