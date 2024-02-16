const msg = (options) => showAlert(options);

function showAlert(options) {
  const {
    type,
    text,
    duration = null,
    closeOnClick = true,
    showCloseButton = true,
    icon = null,
    backgroundColor = null,
    textColor = null,
    position = 'center',
    animationIn = 'fadeIn',
    animationOut = 'fadeOut',
    size = 'medium',
    customCloseButton = null,
    customShadow = null,
    customBorder = null
  } = options;

  const alertContainer = document.createElement('div');
  alertContainer.className = `custom-alert ${type} ${size} ${position} ${animationIn}`;
  if (backgroundColor) alertContainer.style.backgroundColor = backgroundColor;
  if (textColor) alertContainer.style.color = textColor;
  if (customShadow) alertContainer.style.boxShadow = customShadow;
  if (customBorder) alertContainer.style.border = customBorder;

  alertContainer.innerHTML = `
    ${icon ? `<div class="icon"><img src="${icon}" alt="Icon"></div>` : ''}
    <div class="message">${text}</div>
    ${showCloseButton ? '<button class="close-btn">' + (customCloseButton || 'Cerrar') + '</button>' : ''}
  `;

  document.body.appendChild(alertContainer);

  if (duration !== null) {
    setTimeout(() => {
      closeAlert(alertContainer, animationOut);
    }, duration);
  } else {
    const closeButton = alertContainer.querySelector('.close-btn');
    if (closeButton && closeOnClick) {
      closeButton.addEventListener('click', () => {
        closeAlert(alertContainer, animationOut);
      });
    }
  }
}

function closeAlert(alertElement, animationOut) {
  alertElement.classList.remove('fadeIn');
  alertElement.classList.add(animationOut);
  setTimeout(() => {
    document.body.removeChild(alertElement);
  }, 500);
}

// Estilos CSS (puedes personalizar según tus preferencias)
const styles = `
  .custom-alert {
    position: fixed;
    font-family: Arial, sans-serif;
    opacity: 0.95;
    transition: opacity 0.3s ease-in-out;
    transform-style: preserve-3d;
  }

  .custom-alert img{
    max-width:90px;
    max-height: 90px;
  }

  .custom-alert.center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .custom-alert.top-left {
    top: 20px;
    left: 20px;
  }

  .custom-alert.top-right {
    top: 20px;
    right: 20px;
  }

  .custom-alert.bottom-left {
    bottom: 20px;
    left: 20px;
  }

  .custom-alert.bottom-right {
    bottom: 20px;
    right: 20px;
  }

  .fadeIn {
    opacity: 0.95;
    transform: translate(-50%, -50%) rotateX(0deg) rotateY(0deg) scale(1);
  }

  .fadeOut {
    opacity: 0;
    transform: translate(-50%, -50%) rotateX(10deg) rotateY(10deg) scale(0.9);
  }

  .small {
    width: 200px;
  }

  .medium {
    width: 300px;
  }

  .large {
    width: 400px;
  }

  .custom-alert .close-btn {
    margin-top: 10px;
    padding: 8px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .custom-alert .close-btn:hover {
    background-color: #ddd;
  }
`;

// Agrega estilos a la cabeza del documento
const styleElement = document.createElement('style');
styleElement.appendChild(document.createTextNode(styles));
document.head.appendChild(styleElement);

// Ejemplos de uso:
//  msg({
//    type: 'error', 
//    text: 'Operación completada con éxito.',
  //  duration: 5000,
  //  position: 'center',
  //  icon: 'error.png',
  //  backgroundColor: '#4CAF50',
  //  textColor: '#fff',
  //  size: 'medium',
  //  customCloseButton: 'OK',
  //  customShadow: '0 0 20px rgba(0, 0, 0, 0.6)',
  //  customBorder: '2px solid #ddd'
//  });
// msg({ type: 'error', text: 'Se produjo un error. Inténtalo de nuevo.' });
// msg({ type: 'info', text: 'Información importante.', closeOnClick: false });
// msg({ type: 'none', text: 'Mensaje sin estilo.', showCloseButton: false });
var error= document.createElement('img');
error.src="error.png"
error.innerHTML = `<img src="error.png" alt="icon">`