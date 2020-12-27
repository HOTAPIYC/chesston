document.querySelector('#register').addEventListener('click', async function(event){
    event.preventDefault();

    const name = document.querySelector('#name').value;
    
    const player = { name: name };

    const response = await fetch('/api/player/', {
      method: 'POST',
      body: JSON.stringify(player),
      headers: {'Content-type': 'application/json; charset=UTF-8'}
    });

    if(response.status === 200){
      const player = await response.json();

      localStorage.setItem('player',JSON.stringify(player));
      
      document.location.href = 'dashboard.html';
    }
});

document.querySelector('#offline').addEventListener('click', function(event){
  event.preventDefault();
  document.location.href = 'local.html';
});