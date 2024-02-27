## instalación
Para comenzar a utilizar lumina alerts en tu proyecto, simplemente incluye el archivo JavaScript en tu página HTML:

```html
<script src="https://cdn.jsdelivr.net/gh/Moisesdemolf/lumina-alerts/lumina-alerts.js"></script>
```

¡Y eso es todo! Ahora estás listo para mostrar alertas impresionantes en tu sitio web.
## Opciones
Para mostrar un mensaje emergente utilizando Mi Librería, puedes utilizar la siguiente función:

*msg(options);*
Donde options es un objeto con las siguientes propiedades:

| Propiedad        | Descripción                                                   |
|------------------|---------------------------------------------------------------|
| theme            | El tema del mensaje emergente. Puede ser 'none', 'error', 'info', 'success', 'warning', 'ios' o 'android'. |
| text             | El texto del mensaje emergente.                                |
| duration         | La duración del mensaje emergente en milisegundos.             |
| title            | El título del mensaje emergente.                               |
| icon             | La URL de un icono personalizado para el mensaje emergente.    |
| confirmBTN       | Un valor booleano que indica si se muestra un botón de confirmación. |
| confirmTXT       | El texto del botón de confirmación.                            |
| confirmCLICK     | La función que se ejecuta al hacer clic en el botón de confirmación. |
| cancelBTN        | Un valor booleano que indica si se muestra un botón de cancelación. |
| cancelTXT        | Texto del botón de cancelación (opcional).                     |
| cancelCLICK      | Función que se ejecuta al hacer clic en el botón de cancelación. |
| position         | Posición de la notificación (center, top, bottom).              |
| input            | Mostrar un campo de entrada en la notificación (opcional).     |
| placeholder      | Texto de marcador de posición para el campo de entrada.         |
| background       | Color de fondo personalizado para la notificación (opcional).  |
| animationIn      | Animación de entrada para la notificación (fadeIn).             |
| animationOut     | Animación de salida para la notificación (fadeOut).             |

## Uso
Para mostrar un mensaje de alerta es simmplemente poniendo:

```javascript
msg({text:"Una alert simple"});
```
Ahora personalizemos nustros mensajes aun más:
```javascript
msg({
        theme: 'success',
        title: 'Felicidades',
        text: 'Has creado un mensaje de alerta algo simple, pero hermoso.'
});
```
En lo anterior creamos un mensaje de alerta con un titulo, un tema y un texto ¡no cuesta nada verdad!
Ahora agamos un mensaje de alerta mas completo:
```javascript
msg({
        theme: 'none', 
        text: 'Soy lumina alerts, libreria de alerts de javascript <br>Bienvenido',
        title: "Hola" ,
        icon: 'images/idea.png',
        cancelBTN: true,
        confirmBTN: true,
        confirmTXT: 'Aceptar',
        confirmCLICK: 'mensaje2()',
        input: "text",
        placeholder: "Escribe un texto"
});

function mensaje1(){
  msg({
    theme: 'error',
    text: 'Cerrastes el alerta'
  });
};

function mensaje2(){
  msg({
    theme: 'success',
    text: 'su texto es: ' + intext()
  });
};
```

Para mas opciones de usos o ejemplos mira la documentación ofial de lumina alerts en su sitio web: https://moisesdemolf.github.io/lumina-alerts.github.io/
