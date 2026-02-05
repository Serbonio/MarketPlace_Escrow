async function loadRelatorios() {
    const vendas = await apiGet("/admin/relatorios/vendas");
    const ctx = document.getElementById("vendasMes").getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: vendas.map(v => v.mes),
            datasets: [{ label: 'Vendas', data: vendas.map(v => v.total), backgroundColor: '#4b6cb7' }]
        }
    });
}