async function loadUsuarios() {
    const usuarios = await apiGet("/admin/usuarios");
    const table = document.getElementById("usuarios-list");
    table.innerHTML = usuarios.map(u => `
        <tr>
            <td>${u.id}</td>
            <td>${u.nome}</td>
            <td>${u.email}</td>
            <td>${u.tipo}</td>
            <td>${u.estado}</td>
        </tr>
    `).join('');
}