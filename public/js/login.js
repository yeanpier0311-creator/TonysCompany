async function login() {
  const usuario = document.getElementById('usuario').value;
  const clave = document.getElementById('clave').value;
  const errorDiv = document.getElementById('error');

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, clave })
    });

    if (!res.ok) {
      errorDiv.textContent = 'Credenciales incorrectas';
      return;
    }

    const data = await res.json();
    localStorage.setItem('token', data.token);

    window.location.href = '/admin.html';

  } catch (err) {
    errorDiv.textContent = 'Error de conexión';
  }
}