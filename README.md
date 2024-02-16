instalación
Para comenzar a utilizar boom.js en tu proyecto, simplemente incluye el archivo JavaScript en tu página HTML:

<script src="boom.js"></script>
¡Y eso es todo! Ahora estás listo para mostrar alertas impresionantes en tu sitio web.
Opciones
Para mostrar un mensaje emergente utilizando Mi Librería, puedes utilizar la siguiente función:

boom(options);
Donde options es un objeto con las siguientes propiedades:

Propiedad	Descripción
theme:	El tema del mensaje emergente. Puede ser 'none', 'error', 'info', 'success', 'warning', 'ios' o 'android'.

text:	El texto del mensaje emergente.

duration:	La duración del mensaje emergente en milisegundos.

title:	El título del mensaje emergente.

icon:	La URL de un icono personalizado para el mensaje emergente.

confirmBTN:	Un valor booleano que indica si se muestra un botón de confirmación.

confirmTXT:	El texto del botón de confirmación.

confirmCLICK:	La función que se ejecuta al hacer clic en el botón de confirmación.

cancelBTN:	Un valor booleano que indica si se muestra un botón de cancelación.

cancelTXT:	Texto del botón de cancelación (opcional)

cancelCLICK:	Función que se ejecuta al hacer clic en el botón de cancelación.

position:	Posición de la notificación (center, top, bottom).

input:	Mostrar un campo de entrada en la notificación (opcional).

placeholder:	Texto de marcador de posición para el campo de entrada.

background:	Color de fondo personalizado para la notificación (opcional).

animationIn:	Animación de entrada para la notificación (fadeIn).

animationOut:	Animación de salida para la notificación (fadeOut).

Para mas opciones de usos o ejemplos mira la documentación ofial de boom.js
