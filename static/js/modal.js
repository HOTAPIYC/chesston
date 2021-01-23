// Attach two-line modal dialog to the modal
// root div and wait for OK button
function showMsgDialog (...props) {
  const msgDialog = `
    <div class="modal">
      <div>
        ${[...props].map(text => `
        <p>${text}</p>`).join('')}
        <button>OK</button>
      </div>
    </div>
  `;

  document.querySelector('.modal-root').innerHTML += msgDialog;

  return new Promise((res, rej) => {
    document.querySelector('.modal').querySelector('button').addEventListener('click', event => {
      event.target.parentElement.parentElement.remove();
      res();
    });
  });
}

// Attach input modal dialog to the modal
// root div and wait for Send button. Return
// content of input field
function showInputDialog (...props) {
  const inputDialog =  `
    <div class="modal">
      <div>
        ${[...props].map(text => `
        <p>${text}</p>`).join('')}
        <input type="text"></input>
        <button>Send</button>
      </div>
    </div>
  `;

  document.querySelector('.modal-root').innerHTML += inputDialog;

  return new Promise((res, rej) => { 
    document.querySelector('.modal').querySelector('button').addEventListener('click', event => {
      const value = document.querySelector('.modal').querySelector('input').value;
      event.target.parentElement.parentElement.remove();
      res(value);
    });
  });
}