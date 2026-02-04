// ================= LOGIN =================
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
      window.location = "app.html";
    } else {
      alert("Login inválido");
    }
  });
}

// ================= APP =================
if (document.getElementById("usuario")) {
  const u = localStorage.getItem("user");
  if (!u) window.location = "login.html";
  usuario.innerText = u;
  carregar();
}

// CREATE
function criar() {
  fetch("/requisicoes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      usuario: localStorage.getItem("user"),
      descricao: descricao.value
    })
  }).then(() => {
    descricao.value = "";
    carregar();
  });
}

// READ
function carregar() {
  fetch("/requisicoes")
    .then(r => r.json())
    .then(d => {
      lista.innerHTML = "";
      d.forEach(r => {
        lista.innerHTML += `
          <tr>
            <td>${r.id}</td>
            <td>${r.usuario}</td>
            <td>
              <input value="${r.descricao}"
                onchange="editar(${r.id}, this.value)">
            </td>
            <td class="status-${r.status}">
              <select onchange="status(${r.id}, this.value)">
                <option ${r.status=="Pendente"?"selected":""}>Pendente</option>
                <option ${r.status=="Aprovado"?"selected":""}>Aprovado</option>
                <option ${r.status=="Fechado"?"selected":""}>Fechado</option>
              </select>
            </td>
            <td class="actions">
              <button class="btn-danger" onclick="excluir(${r.id})">Excluir</button>
            </td>
          </tr>
        `;
      });
    });
}

// UPDATE descrição
function editar(id, desc) {
  fetch("/requisicoes/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ descricao: desc })
  });
}

// UPDATE status
function status(id, st) {
  fetch("/requisicoes/" + id + "/status", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: st })
  });
}

// DELETE
function excluir(id) {
  if (!confirm("Excluir requisição?")) return;
  fetch("/requisicoes/" + id, { method: "DELETE" })
    .then(() => carregar());
}
