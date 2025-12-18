async function login() {
const res = await fetch('http://localhost:3000/login', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
user: user.value,
pass: pass.value
})
})


if (res.ok) {
login.style.display = 'none'
clientes.classList.remove('hidden')
loadClientes()
} else alert('Error')
}


async function loadClientes() {
const res = await fetch('http://localhost:3000/clientes')
const data = await res.json()
lista.innerHTML = data.map(c => `<li>${c.nombre} - ${c.plan}</li>`).join('')
}