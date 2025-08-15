const form = document.getElementById("formFuncionario");
const tabela = document.querySelector("#tabelaFuncionarios tbody");
const busca = document.getElementById("busca");
let editId = null;

async function atualizarTabela(filtro = "") {
    const res = await fetch("/funcionarios");
    let funcionarios = await res.json();
    if (filtro) funcionarios = funcionarios.filter(f => f.nome.toLowerCase().includes(filtro.toLowerCase()));
    tabela.innerHTML = "";
    funcionarios.forEach(f => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${f.nome}</td>
            <td>${f.cargo}</td>
            <td>R$ ${f.salario.toFixed(2)}</td>
            <td>
                <button class="editar" onclick='editarFuncionario(${JSON.stringify(f)})'>Editar</button>
                <button class="excluir" onclick='excluirFuncionario(${f.id})'>Excluir</button>
            </td>
        `;
        tabela.appendChild(tr);
    });
}

form.addEventListener("submit", async e => {
    e.preventDefault();
    const nome = document.getElementById("nome").value;
    const cargo = document.getElementById("cargo").value;
    const salario = parseFloat(document.getElementById("salario").value);

    if (editId) {
        await fetch(`/funcionarios/${editId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nome, cargo, salario }) });
        editId = null;
    } else {
        await fetch("/funcionarios", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nome, cargo, salario }) });
    }

    form.reset();
    atualizarTabela(busca.value);
});

async function excluirFuncionario(id) {
    await fetch(`/funcionarios/${id}`, { method: "DELETE" });
    atualizarTabela(busca.value);
}

function editarFuncionario(f) {
    document.getElementById("nome").value = f.nome;
    document.getElementById("cargo").value = f.cargo;
    document.getElementById("salario").value = f.salario;
    editId = f.id;
}

busca.addEventListener("input", () => atualizarTabela(busca.value));
atualizarTabela();
