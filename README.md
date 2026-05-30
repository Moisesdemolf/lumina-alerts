# 🌟 Lumina Alerts v4.0

La librería de alertas JavaScript más moderna, segura y personalizable del mercado. Supera a SweetAlert2 y AlertifyJS en funcionalidades, rendimiento y facilidad de uso.

## ✨ Características Principales

- **🔒 Seguridad XSS**: Todo el texto se escapa automáticamente
- **♿ Accesibilidad WCAG 2.1**: Focus trap, navegación por teclado
- **📱 100% Responsive**: Funciona en todos los dispositivos
- **🎨 12 Temas Profesionales**: Botones adaptados automáticamente a cada tema
- **🧙 Wizards Reales**: Multi-paso con navegación y HTML personalizado
- **🍞 Toast Notifications**: Notificaciones elegantes en 4 posiciones
- **🔐 Modo Bloqueante**: Previene cierre hasta tomar acción
- **⚡ Sin Dependencias**: Cero dependencias externas (~20KB)
- **🎭 5 Animaciones**: zoom, slide-up, fade, bounce, shake

## 📦 Instalación

### CDN
```html
<script src="https://cdn.jsdelivr.net/npm/lumina-alerts@4.0.0/lumina-alerts.min.js"></script>
```

### NPM
```bash
npm install lumina-alerts
```

### Local
Descarga `lumina-alerts.js` e inclúyelo en tu HTML:
```html
<script src="lumina-alerts.js"></script>
```

## 🚀 Uso Básico

### Alertas Simples
```javascript
// Success
lumina.success('¡Operación exitosa!');

// Error
lumina.error('Error al conectar');

// Warning
lumina.warning('Advertencia importante');

// Info
lumina.info('Nueva actualización disponible');

// Question
lumina.question('¿Tienes dudas?');
```

### Con Opciones Avanzadas
```javascript
lumina.success({
  title: '¡Excelente!',
  text: 'Tu código se ejecutó correctamente',
  theme: 'success',
  animation: 'bounce',
  confirmButtonText: 'Genial'
});
```

## 🎨 Temas Disponibles

Los botones se adaptan automáticamente al color de cada tema:

| Tema | Descripción |
|------|-------------|
| `success` | Verde esmeralda |
| `error` | Rojo intenso |
| `warning` | Ámbar brillante |
| `info` | Azul cielo |
| `question` | Índigo suave |
| `dark` | Gris oscuro profesional |
| `glass` | Efecto vidrio translúcido |
| `neon` | Cyberpunk con brillo |
| `minimal` | Blanco y negro limpio |
| `modern` | Azul corporativo |
| `gradient` | Degradado púrpura |
| `sunset` | Degradado naranja |
| `ocean` | Degradado azul marino |

### Ejemplo de Tema
```javascript
lumina.alert({
  title: 'Tema Neon',
  text: 'Este tema tiene colores cyberpunk',
  theme: 'neon'
});
```

## 🔔 Tipos de Alertas

### Confirmación
```javascript
lumina.confirm({
  title: '¿Estás seguro?',
  text: 'Esta acción no se puede deshacer',
  confirmButtonText: 'Sí, eliminar',
  cancelButtonText: 'Cancelar'
}).then(() => {
  lumina.success('Eliminado correctamente');
}).catch(() => {
  lumina.info('Operación cancelada');
});
```

### Input/Prompt
```javascript
lumina.prompt({
  title: 'Ingresa tu email',
  inputPlaceholder: 'ejemplo@correo.com',
  inputValidator: (value) => {
    if (!value.includes('@')) return 'Email inválido';
  }
}).then((email) => {
  lumina.success(`Email registrado: ${email}`);
});
```

### Loading
```javascript
const load = lumina.loading({
  title: 'Procesando...',
  text: 'Por favor espera'
});

setTimeout(() => {
  load.close(true);
  lumina.success('¡Completado!');
}, 2000);
```

## 🧙 Wizards Reales (Multi-paso)

Los wizards son mini-webs dentro de un modal con navegación entre pasos:

### Wizard Básico
```javascript
lumina.wizard([
  { title: 'Paso 1', content: 'Bienvenido al wizard' },
  { title: 'Paso 2', content: 'Segundo paso' },
  { title: 'Paso 3', content: 'Último paso' }
], {
  onFinish: () => lumina.success('¡Wizard completado!')
});
```

### Wizard con HTML Personalizado
```javascript
lumina.wizard([
  { 
    title: 'Datos Personales', 
    content: `
      <form style="text-align:left">
        <label>Nombre:
          <input type="text" style="width:100%;padding:8px;margin-top:5px">
        </label>
        <label>Email:
          <input type="email" style="width:100%;padding:8px;margin-top:5px">
        </label>
      </form>
    `,
    allowHTML: true
  },
  { 
    title: 'Preferencias', 
    content: `
      <div style="text-align:left">
        <p>Selecciona tus intereses:</p>
        <label><input type="checkbox"> Tecnología</label><br>
        <label><input type="checkbox"> Deportes</label><br>
        <label><input type="checkbox"> Música</label>
      </div>
    `,
    allowHTML: true
  }
], {
  theme: 'modern',
  onFinish: () => lumina.success('Formulario enviado')
});
```

### Wizard con Validación
```javascript
lumina.wizard([
  { 
    title: 'Paso 1', 
    content: 'Este paso no tiene validación',
    onBeforeNext: () => true
  },
  { 
    title: 'Paso 2 - Validado', 
    content: 'Debes aceptar para continuar',
    onBeforeNext: () => {
      const aceptado = document.querySelector('#aceptar').checked;
      if (!aceptado) {
        lumina.warning('Debes aceptar los términos');
        return false;
      }
      return true;
    }
  }
]);
```

## 🍞 Toast Notifications

```javascript
// Posiciones disponibles: top-right, top-left, bottom-right, bottom-left
lumina.toast('Notificación importante', {
  position: 'top-right',
  theme: 'modern',
  duration: 3000, // ms
  icon: 'info'
});
```

## 📦 Modals HTML Personalizados

```javascript
lumina.modal(`
  <div style="text-align: left; padding: 10px;">
    <h3>📋 Detalles del Producto</h3>
    <p><strong>Nombre:</strong> Producto Premium</p>
    <p><strong>Precio:</strong> $99.99</p>
    <ul>
      <li>Característica 1</li>
      <li>Característica 2</li>
    </ul>
  </div>
`, {
  title: 'Información Detallada',
  theme: 'modern',
  width: '500px'
});
```

## 🔐 Modo Bloqueante

Las alertas bloqueantes no se pueden cerrar con click fuera, Escape o botón X:

```javascript
lumina.alert({
  title: '⚠ Términos y Condiciones',
  text: 'Debes aceptar para continuar',
  blocking: true,
  closable: false,
  showCloseButton: false,
  showCancelButton: true,
  confirmButtonText: 'Aceptar',
  cancelButtonText: 'Rechazar'
}).then(() => {
  lumina.success('Términos aceptados');
}).catch(() => {
  lumina.error('Debes aceptar para continuar');
});
```

## ⏳ Timer Auto-Close

```javascript
lumina.info({
  title: 'Redirigiendo...',
  text: 'Serás redirigido automáticamente',
  timer: 3000, // 3 segundos
  timerProgressBar: true,
  showConfirmButton: false
});
```

## 🎭 Animaciones Disponibles

```javascript
lumina.success({
  text: 'Animación Zoom',
  animation: 'zoom' // zoom, slide-up, fade, bounce, shake
});
```

## 📝 Todas las Opciones

```javascript
lumina.alert({
  // Contenido
  title: 'Título de la alerta',
  text: 'Texto descriptivo',
  html: '<p>HTML personalizado</p>', // Alternativa a text
  icon: 'success', // success, error, warning, info, question, loading
  
  // Tema y Estilo
  theme: 'modern', // Ver tabla de temas
  allowHTML: false, // Permitir HTML en title/text
  width: '400px',
  borderRadius: '12px',
  customClass: 'mi-clase-extra',
  
  // Comportamiento
  blocking: false, // Prevenir cierre externo
  closable: true, // Permitir cierre
  showCloseButton: true, // Mostrar botón X
  backdrop: true, // Mostrar overlay
  animation: 'zoom', // zoom, slide-up, fade, bounce, shake
  
  // Botones
  confirmButtonText: 'OK',
  cancelButtonText: 'Cancel',
  showCancelButton: false,
  
  // Inputs
  input: null, // text, password, email, textarea
  inputValue: '',
  inputPlaceholder: '',
  inputValidator: (value) => { /* retornar mensaje de error o undefined */ },
  
  // Timer
  timer: null, // ms para auto-cerrar
  timerProgressBar: false,
  
  // Callbacks
  onConfirm: (result) => {},
  onCancel: () => {},
  onClose: () => {},
  onOpen: (instance) => {}
});
```

## 💼 Casos de Uso Reales

### Eliminar Archivo
```javascript
lumina.confirm({
  title: '🗑️ Eliminar Archivo',
  text: '¿Estás seguro de eliminar "documento.pdf"?',
  theme: 'error'
}).then(() => {
  lumina.toast('Archivo eliminado', { theme: 'success' });
});
```

### Login Form
```javascript
lumina.alert({
  title: 'Iniciar Sesión',
  input: 'email',
  inputPlaceholder: 'tu@email.com',
  showCancelButton: true
}).then((email) => {
  const load = lumina.loading('Autenticando...');
  setTimeout(() => {
    load.close(true);
    lumina.success(`Bienvenido, ${email}`);
  }, 1500);
});
```

### Onboarding
```javascript
lumina.wizard([
  { title: '👋 Bienvenido', content: '¡Gracias por unirte!', icon: 'success' },
  { title: '📧 Verifica tu email', content: 'Revisa tu bandeja', icon: 'info' },
  { title: '🎨 Personaliza', content: 'Sube una foto de perfil', icon: 'question' },
  { title: '✅ ¡Listo!', content: 'Comienza a explorar', icon: 'success' }
], {
  theme: 'gradient',
  finishButtonText: 'Comenzar'
});
```

## 🔒 Seguridad

Lumina Alerts protege contra ataques XSS escapando todo el texto por defecto:

```javascript
// SEGURO - El texto se escapa automáticamente
lumina.alert({ text: '<script>alert("XSS")</script>' }); 
// Muestra literalmente "<script>alert("XSS")</script>"

// HTML explícito (solo cuando es necesario)
lumina.alert({ 
  html: '<strong>Negrita</strong>', 
  allowHTML: true 
});
```

## ♿ Accesibilidad

- **Focus Trap**: El foco no sale del modal
- **Navegación por teclado**: Tab, Shift+Tab, Escape
- **ARIA labels**: Roles y atributos accessibility
- **Gestión de foco**: Se restaura al cerrar

## 📱 Responsive

Media queries optimizados para:
- Móviles (< 480px): Botones full-width
- Tablets (481-768px): Layout ajustado
- Desktop (> 768px): Tamaño completo

## 🌐 Compatibilidad

- ✅ Chrome/Edge (últimas versiones)
- ✅ Firefox (últimas versiones)
- ✅ Safari (últimas versiones)
- ✅ IE11+ (con polyfills)
- ✅ iOS Safari
- ✅ Android Chrome

## 📄 Licencia

MIT License - Libre para uso comercial y personal

---

**Hecho con ❤️ para la web moderna**

[Demo Interactiva](demo-lumina.html) | [GitHub](https://github.com/tu-repo/lumina-alerts)
