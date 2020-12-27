document.querySelector("#register-btn").addEventListener("click", async function(event){
  event.preventDefault();

  const name = document.querySelector("#register-username").value;
  const password1 = document.querySelector("#register-password1").value;
  const password2 = document.querySelector("#register-password2").value;

  if(password1 != password2){
    alert("Passwords do not match!");
    // TODO: Check password equality while typing.
  } else {
    const player = { name: name, password: password1 };

    const response = await fetch("/api/player/new", {
      method: "POST",
      body: JSON.stringify(player),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    });

    if(response.status === 200){
      const player = await response.json();
      // Write player to local storage, 
      // so that next page can access it
      localStorage.setItem("player",JSON.stringify(player));
      document.location.href = "dashboard.html";
    } else {
      const msg = await response.json();
      alert(msg.msg);
      // TODO: Create nicer message.
    }
  }
});

document.querySelector("#login-btn").addEventListener("click", async function(event){
  event.preventDefault();

  const name = document.querySelector("#login-username").value;
  const password = document.querySelector("#login-password").value;

  const player = { name: name, password: password };

  const response = await fetch("/api/player/login", {
    method: "POST",
    body: JSON.stringify(player),
    headers: {"Content-type": "application/json; charset=UTF-8"}
  });

  if(response.status === 200){
    const player = await response.json();
    // Write player to local storage, 
    // so that next page can access it
    localStorage.setItem('player',JSON.stringify(player));
    document.location.href = 'dashboard.html';
  } else {
    const msg = await response.json();
    alert(msg.msg);
    // TODO: Create nicer message.
  }
});

document.querySelector("#offline-link").addEventListener("click", function(event){
  event.preventDefault();
  document.location.href = "local.html";
});