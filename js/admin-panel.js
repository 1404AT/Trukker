// ==========================================
// ADMIN PANEL - FUNCIONES ADMINISTRATIVAS
// ==========================================

const db = firebase.firestore();
let allUsers = [];
let allSolicitudes = [];
let allCapacidades = [];

// Cargar todos los datos
async function loadAdminData() {
    try {
        // Cargar usuarios
        const usersSnapshot = await db.collection('users').get();
        allUsers = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        displayUsers();

        // Cargar solicitudes
        const solicitudesSnapshot = await db.collection('solicitudes').get();
        allSolicitudes = solicitudesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        displaySolicitudes();

        // Cargar capacidades
        const capacidadesSnapshot = await db.collection('capacidades').get();
        allCapacidades = capacidadesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        displayCapacidades();

        // Actualizar estadísticas
        updateStats();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Mostrar usuarios
function displayUsers() {
    const tbody = document.getElementById('usuarios-table')?.querySelector('tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    allUsers.forEach(user => {
        const row = `
            <tr>
                <td>${user.email}</td>
                <td>${user.nombre || '-'}</td>
                <td>${user.role === 'transportista' ? '🚚 Transportista' : '📦 Empresa'}</td>
                <td>
                    <span class="status-badge ${user.verificado ? 'status-verificado' : 'status-pendiente'}">
                        ${user.verificado ? '✓ Verificado' : '⏳ Pendiente'}
                    </span>
                </td>
                <td>${user.createdAt ? new Date(user.createdAt.toDate()).toLocaleDateString('es-MX') : '-'}</td>
                <td>
                    <button onclick="verifyUser('${user.id}')" class="btn" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;">Verificar</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    const empty = document.getElementById('usuarios-empty');
    if (empty) empty.style.display = allUsers.length === 0 ? 'block' : 'none';
}

// Mostrar solicitudes
function displaySolicitudes() {
    const tbody = document.getElementById('solicitudes-table')?.querySelector('tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    allSolicitudes.forEach(sol => {
        const row = `
            <tr>
                <td>${sol.origen} → ${sol.destino}</td>
                <td>${sol.peso || 0}T</td>
                <td>$${sol.presupuesto || 0}</td>
                <td>${sol.estado || 'pendiente'}</td>
                <td>${sol.createdAt ? new Date(sol.createdAt.toDate()).toLocaleDateString('es-MX') : '-'}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    const empty = document.getElementById('solicitudes-empty');
    if (empty) empty.style.display = allSolicitudes.length === 0 ? 'block' : 'none';
}

// Mostrar capacidades
function displayCapacidades() {
    const tbody = document.getElementById('capacidades-table')?.querySelector('tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    allCapacidades.forEach(cap => {
        const row = `
            <tr>
                <td>${cap.origen}</td>
                <td>${cap.destino}</td>
                <td>${cap.toneladas || 0}T</td>
                <td>$${cap.precio || 0}</td>
                <td>${cap.estado || 'activa'}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    const empty = document.getElementById('capacidades-empty');
    if (empty) empty.style.display = allCapacidades.length === 0 ? 'block' : 'none';
}

// Actualizar estadísticas
function updateStats() {
    // Total usuarios
    const totalUsuarios = document.getElementById('total-usuarios');
    if (totalUsuarios) totalUsuarios.textContent = allUsers.length;

    // Transportistas vs Empresas
    const transportistas = allUsers.filter(u => u.role === 'transportista').length;
    const empresas = allUsers.filter(u => u.role === 'empresa').length;
    
    const totalTransportistas = document.getElementById('total-transportistas');
    const totalEmpresas = document.getElementById('total-empresas');
    
    if (totalTransportistas) totalTransportistas.textContent = transportistas;
    if (totalEmpresas) totalEmpresas.textContent = empresas;
    if (document.getElementById('count-transportistas')) {
        document.getElementById('count-transportistas').textContent = transportistas;
    }
    if (document.getElementById('count-empresas')) {
        document.getElementById('count-empresas').textContent = empresas;
    }

    // Total viajes
    const totalViajes = document.getElementById('total-viajes');
    if (totalViajes) totalViajes.textContent = allSolicitudes.length;

    // Usuarios verificados
    const verificados = allUsers.filter(u => u.verificado).length;
    const usuariosVerificados = document.getElementById('usuarios-verificados');
    if (usuariosVerificados) usuariosVerificados.textContent = verificados;

    // Viajes activos
    const viajesProgreso = allSolicitudes.filter(s => s.estado === 'aceptado').length;
    const viajesCompletados = allSolicitudes.filter(s => s.estado === 'completado').length;
    
    if (document.getElementById('viajes-progreso')) {
        document.getElementById('viajes-progreso').textContent = viajesProgreso;
    }
    if (document.getElementById('viajes-completados')) {
        document.getElementById('viajes-completados').textContent = viajesCompletados;
    }

    // Calcular ingresos (comisión 10%)
    const totalIngresos = allSolicitudes.reduce((sum, sol) => {
        return sum + (sol.presupuesto ? sol.presupuesto * 0.1 : 0);
    }, 0);
    const totalIngresosEl = document.getElementById('total-ingresos');
    if (totalIngresosEl) totalIngresosEl.textContent = '$' + totalIngresos.toLocaleString('es-MX');
}

// Verificar usuario
async function verifyUser(uid) {
    try {
        await db.collection('users').doc(uid).update({ verificado: true });
        alert('✅ Usuario verificado correctamente');
        loadAdminData();
    } catch (error) {
        alert('❌ Error: ' + error.message);
    }
}

// Exportar datos a CSV
function exportToCSV() {
    let csv = 'Email,Nombre,Rol,Verificado,Fecha Registro\n';
    
    allUsers.forEach(user => {
        const row = [
            user.email,
            user.nombre || '',
            user.role,
            user.verificado ? 'Sí' : 'No',
            user.createdAt ? new Date(user.createdAt.toDate()).toLocaleDateString('es-MX') : ''
        ].join(',');
        csv += row + '\n';
    });

    // Crear archivo descargable
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', 'usuarios-trukker.csv');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    alert('✅ CSV descargado');
}

// Filtrar usuarios
function filterUsers(type) {
    const tbody = document.getElementById('usuarios-table')?.querySelector('tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    let filtered = allUsers;
    
    if (type === 'transportista') {
        filtered = allUsers.filter(u => u.role === 'transportista');
    } else if (type === 'empresa') {
        filtered = allUsers.filter(u => u.role === 'empresa');
    } else if (type === 'verificados') {
        filtered = allUsers.filter(u => u.verificado);
    } else if (type === 'pendientes') {
        filtered = allUsers.filter(u => !u.verificado);
    }

    filtered.forEach(user => {
        const row = `
            <tr>
                <td>${user.email}</td>
                <td>${user.nombre || '-'}</td>
                <td>${user.role === 'transportista' ? '🚚 Transportista' : '📦 Empresa'}</td>
                <td>
                    <span class="status-badge ${user.verificado ? 'status-verificado' : 'status-pendiente'}">
                        ${user.verificado ? '✓ Verificado' : '⏳ Pendiente'}
                    </span>
                </td>
                <td>${user.createdAt ? new Date(user.createdAt.toDate()).toLocaleDateString('es-MX') : '-'}</td>
                <td>
                    <button onclick="verifyUser('${user.id}')" class="btn" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;">Verificar</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Monitorear actividad en tiempo real
function monitorActivity() {
    db.collection('users').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
                console.log('👤 Nuevo usuario:', change.doc.data().email);
            }
            if (change.type === 'modified') {
                console.log('✏️ Usuario actualizado:', change.doc.data().email);
            }
        });
    });

    db.collection('solicitudes').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
                console.log('📭 Nueva solicitud:', change.doc.data().origen, '→', change.doc.data().destino);
            }
        });
    });
}

// Logout
function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = 'login.html';
    });
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = 'login.html';
        } else {
            // Verificar que sea admin
            loadAdminData();
            monitorActivity();
        }
    });
});

console.log('✅ Admin-panel.js cargado');