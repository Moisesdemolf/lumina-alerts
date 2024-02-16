// Bienvenido a mi humilde libreria.
// con licencia mint
// este es el codigo fuente:
const boom = (options) => showAlert(options);

// todas las opciones disponibles en mi libreria
function showAlert(options) {
  const {
    theme = 'none',
    text,
    duration = null,
    title = '',
    icon = null,
    confirmBTN = false,
    confirmTXT = null,
    confirmCLICK = '',
    cancelBTN = true,
    cancelTXT = null,
    cancelCLICK = '',
    position = 'center',
    input = null,
    placeholder = `${input}`,
    background= null,
    animationIn = 'fadeIn',
    animationOut = 'fadeOut',

  } = options;

  // aki se crea los mensajes de alerta se usa html
  const alertContainer = document.createElement('div');
  alertContainer.className = `custom-alert ${theme} ${position} ${animationIn}`;
  if(background) alertContainer.style.background = background;
  alertContainer.innerHTML = `
  ${icon ? `<img src="${icon}" id="icon" alt="Icon">` : ''}
    <h2 class="title">${title}</h2>
    <p class="message">${text}</p>
    ${input ? `<input type="${input}" id="myinput-${theme}" placeholder="${placeholder}" oninput="intext()">`: ''}
    <div id="botones-${theme}">
    ${cancelBTN ? `<button class="close-btn-${theme}">${cancelTXT || 'Cerrar'}</button>`  : ''}
    ${confirmBTN ? `<button class="confir-btn-${theme}">${confirmTXT || 'OK'}</button>` : ''}
    </div>
  `;
  document.body.appendChild(alertContainer);
  
  aplicarEstilos()
//  aki se declara si hay duracion o no
  if (duration !== null) {
    setTimeout(() => {
      closeAlert(alertContainer,animationOut);
    }, duration);
  } else {
    // aki va cuando se ase click en los botones
    const closeButton = alertContainer.querySelector(`.close-btn-${theme}`);
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        eval(`${cancelCLICK}`)
        closeAlert(alertContainer,animationOut);
      });
    }
    const confirmButton = alertContainer.querySelector(`.confir-btn-${theme}`);
    if (confirmButton) {
      confirmButton.addEventListener('click', () => {
        eval(`${confirmCLICK}`)
        closeAlert(alertContainer,animationOut);
      });
    }
  }
}

function intext(){
  const contenido = document.querySelector('input').value;
  //  console.log('su texto es '+ intext);
  return contenido;
}

function closeAlert(alertElement, animationOut) {
  alertElement.classList.remove('fadeIn');
  alertElement.classList.add(animationOut);
  setTimeout(() => {
    document.body.removeChild(alertElement);
  }, 500);
}

function aplicarEstilos (){
  var estilos= document.createElement('link');
  estilos.setAttribute('rel', 'stylesheet');
  estilos.setAttribute('href', 'C:/Users/moises/Documents/Proyecto.web/librerias/alert/estilos-alert.css');
  document.head.appendChild(estilos);
}
// Ejemplos de uso:
// boom({ type: 'success', text: 'Operación completada con éxito.', duration: 5000 });

// boom({ type: 'error', text: 'Se produjo un error. Inténtalo de nuevo.' });

// boom({ type: 'info', text: 'Información importante.', closeOnClick: false });

// boom({ 
// type: 'none', 
// text: 'hola, le damos la bienbenida a mi sitio web', 
// btn: true,
// title: "hola",
// icon: 'success.png', 
// btnTXT: "si",
// position: "bottom-center"
// });