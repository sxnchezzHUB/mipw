// app.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker registrado con éxito', reg))
      .catch(err => console.warn('Error al registrar el Service Worker', err));
  });
}

// 1. Pedir permiso para las notificaciones
if ('Notification' in window) {
  Notification.requestPermission().then(permission => {
    console.log('Estado de notificaciones:', permission);
  });
}

// 2. Configurar el botón para registrar el Background Sync
const btn = document.querySelector('button');
const estado = document.getElementById('estado');

btn.addEventListener('click', () => {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then(swRegistration => {
      // Registramos el evento sync con una etiqueta ('mi-primer-sync')
      return swRegistration.sync.register('mi-primer-sync');
    }).then(() => {
      estado.textContent = 'Sincronización registrada en segundo plano...';
    }).catch(err => console.error('Error al registrar Sync:', err));
  } else {
    estado.textContent = 'Tu navegador no soporta Background Sync';
  }
});

// --- LÓGICA PARA DETECTAR INTERNET ---
const mensajeConexion = document.getElementById('mensaje-conexion');

function actualizarEstadoRed() {
  if (navigator.onLine) {
    mensajeConexion.textContent = '🟢 Estás conectado a internet';
    mensajeConexion.className = 'online';
  } else {
    mensajeConexion.textContent = '🔴 Sin conexión. Navegando offline.';
    mensajeConexion.className = 'offline';
  }
}

// Escuchamos cuando el internet se va o regresa
window.addEventListener('online', actualizarEstadoRed);
window.addEventListener('offline', actualizarEstadoRed);

// Ejecutamos la función apenas carga la página para mostrar el estado inicial
actualizarEstadoRed();
// ---------------------------------------
// --- LÓGICA PARA NOTIFICACIÓN DIRECTA ---
const btnNotificar = document.getElementById('btn-notificar');

btnNotificar.addEventListener('click', () => {
  // Verificamos si el navegador soporta notificaciones
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        // Usamos el Service Worker para lanzar la notificación (ideal para PWAs)
        navigator.serviceWorker.ready.then(swRegistration => {
          swRegistration.showNotification('¡Notificación Instantánea!', {
            body: 'Has pulsado el botón y esta es tu notificación directa en Chrome.',
            icon: 'https://dummyimage.com/192x192/121212/00d2ff.png&text=Gamer',
            vibrate: [100, 50, 100],
            badge: 'https://dummyimage.com/96x96/121212/00d2ff.png&text=G'
          });
        });
      } else {
        alert('Necesitas dar permiso para recibir notificaciones.');
      }
    });
  } else {
    alert('Tu navegador no soporta notificaciones.');
  }
});