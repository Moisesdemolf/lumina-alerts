# 🌟 Lumina Alerts v4.0 - Professional Edition

La librería de alertas JavaScript definitiva: **Segura, Rápida, Accesible y Moderna**. Diseñada para superar a SweetAlert2, AlertifyJS y otras bibliotecas tradicionales.

## ✨ Características Principales

### 🔒 Seguridad
- ✅ **Anti-XSS por defecto**: Todo el contenido se escapa automáticamente
- ✅ **HTML opcional**: Solo se permite HTML cuando se activa `allowHTML: true`
- ✅ **Validación de inputs**: Sistema de validación en tiempo real

### ♿ Accesibilidad (WCAG 2.1)
- ✅ **Focus Trap**: El foco permanece dentro del modal
- ✅ **Navegación por teclado**: Soporte completo para Tab y Escape
- ✅ **Screen readers**: Estructura semántica correcta
- ✅ **Gestión de foco**: El foco se restaura al cerrar

### 📱 Responsive & UX
- ✅ **100% Responsive**: Se adapta a todos los dispositivos
- ✅ **Touch-friendly**: Optimizado para móviles y tablets
- ✅ **Animaciones suaves**: Transiciones CSS optimizadas
- ✅ **Scroll lock**: Previene scroll del body cuando está abierto

### ⚡ Rendimiento
- ✅ **Sin dependencias**: Cero dependencias externas
- ✅ **Ligero**: ~18KB minificado
- ✅ **CSS-in-JS**: Estilos inyectados dinámicamente
- ✅ **Sistema de colas**: Gestión inteligente de múltiples alertas

## 🚀 Instalación

### Local
Descarga el archivo `lumina-alerts.js` e inclúyelo en tu proyecto:
```html
<script src="lumina-alerts.js"></script>
```

## 📖 Uso Básico

### Alertas Simples
```javascript
// Éxito
lumina.success('¡Operación completada!', 'Éxito');

// Error
lumina.error('Ha ocurrido un error', 'Error Crítico');

// Advertencia
lumina.warning('Cuidado con esta acción', 'Advertencia');

// Información
lumina.info('Nueva actualización disponible', 'Info');

// Pregunta
lumina.question('¿Estás seguro?', 'Confirmar');
```

### Confirmaciones con Promesas
```javascript
lumina.confirm('¿Deseas eliminar este elemento?', 'Eliminar')
    .then((result) => {
        if (result) {
            lumina.success('Elemento eliminado', 'Completado');
        }
    })
    .catch((err) => {
        lumina.info('Operación cancelada', 'Cancelado');
    });
```

### Inputs con Validación
```javascript
lumina.prompt('Ingresa tu email:', 'Registro', {
    inputType: 'email',
    placeholder: 'tu@email.com',
    inputValidator: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Email inválido';
        return true;
    }
})
.then((email) => {
    lumina.success(`Registrado: ${email}`, 'Completado');
})
.catch(() => {
    lumina.info('Registro cancelado', 'Cancelado');
});
```

## 🎨 Temas Disponibles

```javascript
// Temas estándar
lumina.success('Mensaje', 'Título', { theme: 'success' });
lumina.error('Mensaje', 'Título', { theme: 'error' });
lumina.warning('Mensaje', 'Título', { theme: 'warning' });
lumina.info('Mensaje', 'Título', { theme: 'info' });
lumina.question('Mensaje', 'Título', { theme: 'question' });

// Temas de estilo
lumina.alert('Mensaje', 'Dark', { theme: 'dark' });
lumina.alert('Mensaje', 'Glass', { theme: 'glass' });
lumina.alert('Mensaje', 'Neon', { theme: 'neon' });
lumina.alert('Mensaje', 'Minimal', { theme: 'minimal' });
lumina.alert('Mensaje', 'Sunset', { theme: 'sunset' });
lumina.alert('Mensaje', 'Ocean', { theme: 'ocean' });
lumina.alert('Mensaje', 'Modern', { theme: 'modern' });
```

## 🔒 Modo Bloqueante

Las alertas bloqueantes no se pueden cerrar haciendo click fuera, presionando Escape o hasta que el usuario tome una acción:

```javascript
lumina.question('Debes aceptar los términos', 'Requerido', {
    blocking: true,          // No se puede cerrar sin acción
    closable: false,         // Sin botón X
    closeOnEsc: false,       // Escape no funciona
    closeOnOverlay: false,   // Click fuera no funciona
    confirmButtonText: 'Aceptar',
    showCancel: true,
    cancelButtonText: 'Salir'
})
.then(() => {
    // Usuario aceptó
})
.catch(() => {
    // Usuario canceló (si showCancel: true)
});
```

### Forzar Cierre
```javascript
const alert = lumina.loading('Procesando...', { blocking: true });

// Cerrar desde código externo
setTimeout(() => {
    alert.forceClose();
}, 3000);
```

## 🧙 Wizards (Asistentes Multi-paso)

```javascript
lumina.wizard([
    {
        title: 'Paso 1: Información',
        text: 'Completa tus datos básicos',
        icon: 'info'
    },
    {
        title: 'Paso 2: Preferencias',
        text: 'Configura tus opciones',
        icon: 'question'
    },
    {
        title: 'Paso 3: Confirmación',
        text: 'Revisa y confirma',
        icon: 'success'
    }
])
.then((result) => {
    lumina.success('¡Wizard completado!', 'Finalizado');
})
.catch((err) => {
    lumina.info('Wizard cancelado', 'Cancelado');
});
```

## 🍞 Toast Notifications

```javascript
// Toast básico
lumina.toast('Mensaje guardado', 'success', {
    position: 'top-right',  // top-right, top-left, bottom-right, bottom-left, top-center, bottom-center
    timer: 3000             // Auto-close en ms
});

// Múltiples toasts
lumina.toast('Procesando...', 'info');
setTimeout(() => {
    lumina.toast('¡Completado!', 'success');
}, 1000);
```

## ⏳ Loading States

```javascript
// Loading simple
const loading = lumina.loading('Cargando...');

// Simular operación asíncrona
setTimeout(() => {
    loading.close();
    lumina.success('Carga completada', 'Éxito');
}, 2000);

// Loading con tema personalizado
lumina.loading('Procesando datos...', {
    theme: 'modern',
    overlayBlur: 8
});
```

## 📝 Modals Personalizados

```javascript
lumina.modal(`
    <div style="text-align: left;">
        <h3>Contenido HTML Personalizado</h3>
        <p>Puedes incluir cualquier contenido HTML.</p>
        <ul>
            <li>Elemento 1</li>
            <li>Elemento 2</li>
        </ul>
    </div>
`, {
    title: 'Modal Personalizado',
    width: '500px',
    allowHTML: true,  // Importante para contenido HTML
    showCancel: true
});
```

## ⚙️ Opciones de Configuración

### Opciones Globales
```javascript
lumina.setDefaults({
    theme: 'modern',
    animation: 'zoom',
    blocking: false,
    closable: true,
    overlay: true,
    overlayBlur: 4,
    allowHTML: false,
    trapFocus: true,
    closeOnOverlay: true,
    closeOnEsc: true,
    timer: 0,
    width: '450px',
    maxWidth: '90%',
    borderRadius: '16px'
});
```

### Opciones por Alerta
```javascript
lumina.alert('Texto', 'Título', {
    // Apariencia
    theme: 'modern',           // Tema visual
    animation: 'zoom',         // zoom, slide, bounce, fade, shake
    width: '450px',            // Ancho personalizado
    maxWidth: '90%',           // Ancho máximo
    borderRadius: '16px',      // Bordes redondeados
    
    // Comportamiento
    blocking: false,           // Modo bloqueante
    closable: true,            // Mostrar botón X
    overlay: true,             // Mostrar overlay
    overlayBlur: 4,            // Blur del fondo
    closeOnOverlay: true,      // Cerrar al hacer click fuera
    closeOnEsc: true,          // Cerrar con Escape
    trapFocus: true,           // Mantener foco dentro
    
    // Temporizador
    timer: 0,                  // Auto-close en ms (0 = desactivado)
    
    // Botones
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancelar',
    showCancel: false,
    
    // Input
    inputType: 'text',         // text, password, email
    inputValue: '',            // Valor inicial
    placeholder: '',           // Placeholder
    inputValidator: null,      // Función de validación
    
    // Callbacks
    onOpen: (instance) => {},
    onClose: (action, payload) => {},
    onConfirm: (value) => {},
    onCancel: () => {},
    
    // Seguridad
    allowHTML: false,          // Permitir HTML (peligroso si es user input)
    
    // Multimedia
    sound: null,               // URL de sonido
    icon: null                 // Icono personalizado
});
```

## 🎭 Animaciones Disponibles

```javascript
lumina.alert('Mensaje', 'Título', { animation: 'zoom' });   // Zoom in/out
lumina.alert('Mensaje', 'Título', { animation: 'slide' });  // Slide from top
lumina.alert('Mensaje', 'Título', { animation: 'bounce' }); // Bounce effect
```

## 🔧 Utilidades

### Cerrar Todas las Alertas
```javascript
lumina.closeAll();
```

### Forzar Cierre de una Alerta Específica
```javascript
const alert = lumina.loading('Cargando...');
alert.forceClose();
```

## 📊 Comparativa con Otras Librerías

| Característica | Lumina v4.0 | SweetAlert2 | AlertifyJS |
|---------------|-------------|-------------|------------|
| Tamaño | ~18KB | ~35KB | ~25KB |
| Dependencias | 0 | 0 | 0 |
| Anti-XSS | ✅ Default | ⚠️ Manual | ⚠️ Manual |
| Focus Trap | ✅ Completo | ✅ Parcial | ❌ |
| Modo Blocking | ✅ Nativo | ⚠️ Workaround | ❌ |
| Wizards | ✅ Nativo | ❌ | ❌ |
| Toast | ✅ Incluido | ✅ Incluido | ✅ Incluido |
| Temas | 12+ | 5 | 3 |
| Accesibilidad | WCAG 2.1 | Parcial | Básica |
| Input Validation | ✅ Real-time | ⚠️ On submit | ❌ |

## 🎯 Casos de Uso Comunes

### Formulario de Login
```javascript
lumina.prompt('Ingresa tu contraseña:', 'Login', {
    inputType: 'password',
    placeholder: '••••••••',
    inputValidator: (val) => val.length >= 6 || 'Mínimo 6 caracteres'
})
.then((password) => {
    // Procesar login
})
.catch(() => {});
```

### Confirmación de Eliminación
```javascript
lumina.confirm('¿Estás seguro de eliminar este archivo?', 'Eliminar Archivo', {
    theme: 'error',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
})
.then(() => {
    // Eliminar archivo
})
.catch(() => {});
```

### Términos y Condiciones (Blocking)
```javascript
lumina.modal('<p>Texto de los términos...</p>', {
    title: 'Términos y Condiciones',
    blocking: true,
    closable: false,
    closeOnEsc: false,
    closeOnOverlay: false,
    confirmButtonText: 'Aceptar',
    showCancel: true,
    cancelButtonText: 'Salir del sitio'
})
.then(() => {
    // Usuario aceptó
})
.catch(() => {
    // Usuario rechazó - redirigir o bloquear
    window.location.href = '/goodbye';
});
```

## 🌐 Compatibilidad

- ✅ Chrome/Edge (últimas versiones)
- ✅ Firefox (últimas versiones)
- ✅ Safari (últimas versiones)
- ✅ IE11+ (con polyfills limitados)
- ✅ Mobile (iOS Safari, Chrome Android)
- ✅ Tablets

## 📄 Licencia

MIT License - Libre uso comercial y personal.

---

**Desarrollado con ❤️ por Lumina Dev Team**

*Versión 4.0 - Lista para Producción*
