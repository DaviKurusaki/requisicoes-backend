function login() {
  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: user.value,
      password: pass.value
    })
  })
  .then(r => r.json())
  .then(d => {
    if (d.success) {
      localStorage.setItem("user", user.value);
      window.location = "requisicao.html";
    } else alert("Login inválido");
  });
}

function enviar() {
  fetch("/requisicao", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      usuario: localStorage.getItem("user"),
      descricao: descricao.value
    })
  }).then(() => carregar());
}

function carregar() {
  fetch("/requisicoes")
    .then(r => r.json())
    .then(d => {
      lista.innerHTML = "";
      d.forEach(r => {
        lista.innerHTML += `<li>${r.usuario} - ${r.descricao} (${r.status})</li>`;
      });
    });
}

if (typeof lista !== "undefined") carregar();
