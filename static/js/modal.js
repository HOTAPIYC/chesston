// Attach multi-line modal dialog to the modal
// root div and wait for OK button
function showMsgDialog (...props) {
  const el = document.querySelector('.modal');

  const msg = [...props].map(text =>`
    <p>${text}</p>`
  ).join('');

  const msgDialog = `
    <div>
      ${msg}
      <button>OK</button>
    </div>
  `;

  el.innerHTML = msgDialog;
  el.className = el.className.replace('hidden','visible');

  return new Promise((res, rej) => {
    el.querySelector('button').addEventListener('click', event => {
      el.className = el.className.replace('visible','hidden');
      res();
    });
  });
}

// Attach input modal dialog to the modal
// root div and wait for Send button. Return
// content of input field
function showInputDialog (...props) {
  const el = document.querySelector('.modal');

  const msg = [...props].map(text =>`
    <p>${text}</p>`
  ).join('');

  const inputDialog = `
    <div>
      ${msg}
      <input type="text"></input>
      <button>Send</button>
    </div>
  `;

  el.innerHTML = inputDialog;
  el.className = el.className.replace('hidden','visible');

  return new Promise((res, rej) => { 
    el.querySelector('button').addEventListener('click', event => {
      const value = document.querySelector('.modal').querySelector('input').value;
      el.className = el.className.replace('visible','hidden');
      res(value);
    });
  });
}

function showNotification (prop) {
  const el = document.querySelector('.notification');

  const msg = `
    <p>${prop}<7p>
  `;

  el.innerHTML = msg;
  el.className = el.className.replace('hidden','visible');
}

function hideNotification () {
  const el = document.querySelector('.notification');
  el.className = el.className.replace('visible','hidden');
}