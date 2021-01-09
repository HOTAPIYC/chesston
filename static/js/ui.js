const showMsgDialog = (props) => {
  const msgDialog = `
    <div class="modal">
      <div>
        <p>${props.msgln1}</p>
        <p>${props.msgln2}</p>
        <button>Close</button>
      </div>
    </div>
  `
  document.querySelector('.modal-root').innerHTML += msgDialog

  return new Promise((res, rej) => {
    document.querySelector('.modal').querySelector('button').addEventListener('click', event => {
      event.target.parentElement.parentElement.remove()
      res()
    })
  })
}

const showInputDialog = (props) => {
  const inputDialog =  `
    <div class="modal">
      <div>
        <p>${props.text}</p>
        <input type="text"></input>
        <button>Close</button>
      </div>
    </div>
  `
  document.querySelector('.modal-root').innerHTML += inputDialog

  return new Promise((res, rej) => { 
    document.querySelector('.modal').querySelector('button').addEventListener('click', event => {
      const value = document.querySelector('.modal').querySelector('input').value
      event.target.parentElement.parentElement.remove()
      res(value)
    })
  })
}

const updateStatus = () => {
  document.querySelector('#status').textContent = `Your color: ${color} | Current turn: ${turn}`
  if(check) {
    document.querySelector('#status').textContent += ' | Check!'
  }
  if(checkmate) {
    document.querySelector('#status').textContent += ' | Checkmate!'
  }
}