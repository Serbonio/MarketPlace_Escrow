async function login(email, senha) {
  const res = await apiRequest('/auth/login', 'POST', { email, senha });
  if (res.token) {
    localStorage.setItem('token', res.token);
    window.location.href = 'cliente/dashboard.html';
  } else {
    alert(res.message);
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '../login.html';
}