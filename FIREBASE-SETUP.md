# 🔥 FIREBASE SETUP GUIDE - CONFIGURACIÓN COMPLETA

## 📋 Tabla de Contenidos
1. [Crear Proyecto en Firebase](#crear-proyecto)
2. [Configurar Authentication](#authentication)
3. [Configurar Firestore Database](#firestore)
4. [Reglas de Seguridad](#reglas)
5. [Obtener Credenciales](#credenciales)
6. [Verificar Funcionamiento](#verificar)

---

## 🎯 Crear Proyecto en Firebase {#crear-proyecto}

### Paso 1: Ir a Firebase Console
```
1. Ve a: https://console.firebase.google.com
2. Haz clic en "Crear Proyecto"
3. Nombre: trukker-mvp
4. Aceptar términos
5. Clic en "Crear proyecto"
6. Espera 1-2 minutos
```

### Paso 2: Habilitar Google Analytics (Opcional)
```
- Si pregunta por analytics → Sí (recomendado)
- Continuar
- Seleccionar cuenta Google
- Crear proyecto
```

---

## 🔐 Configurar Authentication {#authentication}

### Paso 1: Habilitar Auth
```
1. En Firebase Console, selecciona tu proyecto
2. Left menu → Build → Authentication
3. Haz clic en "Get Started"
4. Selecciona "Email/Password"
5. Habilitar → Guardar
```

### Paso 2: Habilitar Google Sign-In (Opcional)
```
1. En Authentication → Sign-in method
2. Google → Habilitar
3. Proyecto Name: trukker-mvp
4. Email de soporte: tu-email@gmail.com
5. Guardar
```

### Paso 3: Verificación de Email
```
1. Authentication → Templates
2. Email verification → Editar
3. Personalizar nombre y URL (opcional)
4. Guardar
```

---

## 💾 Configurar Firestore Database {#firestore}

### Paso 1: Crear Base de Datos
```
1. Left menu → Build → Firestore Database
2. Haz clic en "Create database"
3. Elegir región: us-central1 (recomendado)
4. Modo de seguridad: "Start in production mode"
5. Crear
```

### Paso 2: Crear Colecciones
```
Una vez creada, crea estas colecciones:

✅ users
   ├─ uid (documento)
   │  ├─ email: string
   │  ├─ nombre: string
   │  ├─ role: string (transportista/empresa)
   │  ├─ verificado: boolean
   │  ├─ createdAt: timestamp
   │  └─ ...otros campos

✅ transportistas
   ├─ uid (documento)
   │  ├─ nombre: string
   │  ├─ telefono: string
   │  ├─ cedula: string
   │  ├─ vehiculo: string
   │  ├─ placa: string
   │  ├─ toneladas: number
   │  └─ calificacion: number

✅ empresas
   ├─ uid (documento)
   │  ├─ nombre: string
   │  ├─ rfc: string
   │  ├─ telefono: string
   │  ├─ direccion: string
   │  └─ contacto: string

✅ capacidades
   ├─ capacidadId (auto-generado)
   │  ├─ uid: string
   │  ├─ origen: string
   │  ├─ destino: string
   │  ├─ toneladas: number
   │  ├─ precio: number
   │  ├─ estado: string (activa/inactiva)
   │  ├─ createdAt: timestamp
   │  └─ updatedAt: timestamp

✅ solicitudes
   ├─ solicitudId (auto-generado)
   │  ├─ uid: string (empresa)
   │  ├─ origen: string
   │  ├─ destino: string
   │  ├─ peso: number
   │  ├─ presupuesto: number
   │  ├─ descripcion: string
   │  ├─ estado: string (pendiente/aceptado/completado)
   │  ├─ transportista: string (uid)
   │  ├─ createdAt: timestamp
   │  └─ completedAt: timestamp

✅ matches
   ├─ matchId (auto-generado)
   │  ├─ transportistaId: string
   │  ├─ empresaId: string
   │  ├─ solicitudId: string
   │  ├─ capacidadId: string
   │  ├─ precio: number
   │  ├─ estado: string (aceptado/en_transito/completado)
   │  ├─ startDate: timestamp
   │  ├─ endDate: timestamp
   │  └─ calificacion: number

✅ reviews
   ├─ reviewId (auto-generado)
   │  ├─ transportistaId: string
   │  ├─ empresaId: string
   │  ├─ matchId: string
   │  ├─ calificacion: number (1-5)
   │  ├─ comentario: string
   │  ├─ createdAt: timestamp
   │  └─ tipo: string (transportista/empresa)

✅ conversations
   ├─ conversationId (auto-generado)
   │  ├─ participants: array (uid1, uid2)
   │  ├─ lastMessage: string
   │  ├─ lastMessageTime: timestamp
   │  └─ createdAt: timestamp

✅ messages
   ├─ messageId (auto-generado)
   │  ├─ conversationId: string
   │  ├─ senderId: string
   │  ├─ text: string
   │  ├─ timestamp: timestamp
   │  └─ read: boolean
```

### Paso 3: Habilitar Storage (Opcional - para fotos)
```
1. Left menu → Build → Storage
2. Get Started
3. Región: us-central1
4. Modo: Production
5. Crear
```

---

## 🔒 Reglas de Seguridad {#reglas}

### Firestore Rules
```
Ver archivo: firestore-rules.txt
(se proporciona separado)
```

### Storage Rules (si usas)
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

---

## 📄 Obtener Credenciales {#credenciales}

### Paso 1: Ir a Project Settings
```
1. En Firebase Console (arriba a la izquierda)
2. Haz clic en ⚙️ (Configuración del Proyecto)
3. Project Settings
4. Selecciona pestaña "General"
```

### Paso 2: Copiar firebaseConfig
```
Baja hasta "Your apps"
Haz clic en la app web (</> icono)
Copiar el objeto firebaseConfig completo:

{
  apiKey: "AIzaSyAsJbsK9uoZc4EAnntXZ2SQlZC6aV2g0ik",
  authDomain: "trukker-mvp-687e4.firebaseapp.com",
  projectId: "trukker-mvp-687e4",
  storageBucket: "trukker-mvp-687e4.firebasestorage.app",
  messagingSenderId: "342881835995",
  appId: "1:342881835995:web:7ab531b91d31659276a5fe",
  measurementId: "G-HTL0BYHY19"
}
```

### Paso 3: Guardar en firebase-config.js
```javascript
// En tu proyecto, archivo: js/firebase-config.js

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID",
  measurementId: "TU_MEASUREMENT_ID"
};

firebase.initializeApp(firebaseConfig);
```

---

## ✅ Verificar Funcionamiento {#verificar}

### Test 1: Crear Usuario
```
1. Abre la app en http://localhost:8000
2. Haz clic en "Registrar"
3. Selecciona rol: "Transportista"
4. Llena el formulario:
   - Email: test@gmail.com
   - Contraseña: Test123!@
5. Haz clic en "Registrar"
6. Verifica que se redirige a dashboard
```

### Test 2: Verificar en Firebase
```
1. Ve a Firebase Console
2. Authentication → Users
3. Debes ver el usuario test@gmail.com creado
4. Estado: Email not verified (normal)
```

### Test 3: Verificar Firestore
```
1. Ve a Firestore Database
2. Colección "users"
3. Documento con UID del usuario
4. Debe contener:
   - email: test@gmail.com
   - nombre: Tu Nombre
   - role: transportista
   - verificado: false
```

### Test 4: Login
```
1. Abre Login
2. Email: test@gmail.com
3. Contraseña: Test123!@
4. Haz clic en "Inicia Sesión"
5. Verifica que entra al dashboard
```

---

## 🚨 Problemas Comunes

### Error: "Firebase is not defined"
```
❌ Problema: firebase-config.js no está incluido
✅ Solución: 
   1. Verifica que existe en: js/firebase-config.js
   2. En cada HTML, antes de otros scripts:
      <script src="js/firebase-config.js"></script>
   3. Luego los otros scripts
```

### Error: "Auth Error: Configuration"
```
❌ Problema: Credenciales incorrectas
✅ Solución:
   1. Verifica firebase-config.js tenga datos correctos
   2. Copia nuevamente desde Firebase Console
   3. Limpia cache del navegador (Ctrl+Shift+Delete)
   4. Recarga la página
```

### Error: "Permission denied" en Firestore
```
❌ Problema: Reglas de seguridad restrictivas
✅ Solución:
   1. Ve a Firestore → Rules
   2. Reemplaza con reglas de firestore-rules.txt
   3. Publica
   4. Espera 1-2 minutos a que se propague
```

### Error: "User already exists"
```
❌ Problema: Email ya registrado
✅ Solución:
   1. Usa un email diferente
   2. O borra el usuario desde Firebase Console
   3. Authentication → Users → Eliminar
```

---

## 📊 Estructura de Datos Recomendada

### User Document (Ejemplo)
```javascript
{
  uid: "xyz123",
  email: "driver@gmail.com",
  nombre: "Juan Pérez",
  role: "transportista",
  verificado: true,
  createdAt: Timestamp(2024-01-15),
  updatedAt: Timestamp(2024-01-20),
  
  // Para transportistas
  cedula: "1234567890",
  telefono: "+52 81 1234 5678",
  vehiculo: "Camión Doble Remolque",
  placa: "ABC-1234",
  toneladas: 15,
  calificacion: 4.8,
  viajesTotales: 42,
  
  // Para empresas
  razonSocial: "Mi Empresa SRL",
  rfc: "MIE123456ABC",
  direccion: "Calle Principal 123",
  contacto: "María García"
}
```

### Capacidad Document (Ejemplo)
```javascript
{
  capacidadId: "cap_abc123",
  uid: "xyz123", // transportista
  origen: "Monterrey, NL",
  destino: "Ciudad de México, CDMX",
  toneladas: 10,
  precio: 5000, // precio por tonelada
  estado: "activa",
  descripcion: "Transporte de productos manufacturados",
  createdAt: Timestamp(2024-01-15),
  updatedAt: Timestamp(2024-01-20),
  viajosCompletados: 5
}
```

### Solicitud Document (Ejemplo)
```javascript
{
  solicitudId: "sol_xyz789",
  uid: "abc456", // empresa
  origen: "Monterrey, NL",
  destino: "Guadalajara, JL",
  peso: 8,
  presupuesto: 4500,
  descripcion: "Electrónica frágil",
  estado: "pendiente",
  transportista: null, // se llena cuando acepta
  createdAt: Timestamp(2024-01-15),
  expiresAt: Timestamp(2024-01-22),
  ofertas: [] // transportistas que ofertaron
}
```

---

## 🔄 Flujo de Datos

```
1. REGISTRO
   Usuario → Register Form → Firebase Auth → Firestore Users Collection

2. LOGIN
   Usuario → Login Form → Firebase Auth → Obtiene UID → Redirige a Dashboard

3. TRANSPORTISTA PUBLICA CAPACIDAD
   Transportista → Dashboard → Form → Firestore Capacidades Collection

4. EMPRESA CREA SOLICITUD
   Empresa → Dashboard → Form → Firestore Solicitudes Collection

5. MATCH (Aceptar Oferta)
   Transportista ve Solicitud → Ofrece → Empresa Acepta → Firestore Matches
   
6. COMPLETAR VIAJE
   Transportista marca completado → Firestore actualiza estado

7. CALIFICACIÓN
   Empresa/Transportista califican → Firestore Reviews Collection
```

---

## 📚 Documentación Útil

- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
- [Firebase Auth](https://firebase.google.com/docs/auth)
- [Firestore](https://firebase.google.com/docs/firestore)
- [Security Rules](https://firebase.google.com/docs/rules)

---

## ✨ Checklist Setup

- [ ] Crear proyecto en Firebase Console
- [ ] Habilitar Authentication (Email/Password)
- [ ] Crear Firestore Database (production)
- [ ] Crear colecciones (ver paso 2)
- [ ] Copiar firebaseConfig
- [ ] Guardar en firebase-config.js
- [ ] Reemplazar Firestore Rules
- [ ] Publicar Rules
- [ ] Probar Registro
- [ ] Verificar en Firebase Console
- [ ] Probar Login
- [ ] ¡Listo! 🎉

---

**¡Tu Firebase está listo para TRUKKER!** 🚀
