const express = require("express"); // vai a pasta node_modules, encontra express e traz
const mysql = require("mysql2"); // faz a mesma coisa que o express mas com mysql
const cors = require("cors"); // faz a mesma coisa que o express mas com cors

const app = express(); // criação do servidor a variavel app é o servidor
app.use(cors()); // permite requisições do front-end
app.use(express.json()); // permite que o servidor receba dados em formato json

const db = mysql.createConnection({ // criação da conexão com o banco de dados
    host: "localhost",
    user: "root",
    password: "Fittuning250!",
    database: "amatravel"
});

db.connect(err => {  // retorno do banco quando testar conexão
    if (err) console.log("Erro ao conectar:", err);
    else console.log("Conectado ao MySQL!");
});

//------------------//Reconhecer pessoas no banco//---------------//


app.get("/pessoas", (req, res) => { // quando acessado, rodar essa function
    db.query("SELECT * FROM pessoa WHERE ativo = 1", (err, resultado) => {
        if (err) return res.status(500).json({ erro: err });
        res.json(resultado);
    });
});

app.listen(3000, () => { // inicia o servidor na porta 3000
    console.log("Servidor rodando em http://localhost:3000");
});


//------------------//Cadastro de pessoas no banco//--------------//

app.post("/pessoas", (req, res) => { // quando acessado, rodar essa function de informar o banco os novos cadastros
    const { nome, ida, volta } = req.body;
    db.query(
        "INSERT INTO pessoa (nome, valor_ida, valor_volta, ativo) VALUES (?, ?, ?, 1)",
        [nome, ida, volta],
        (err, resultado) => {
            if (err) return res.status(500).json({ erro: err });
            res.json({ id: resultado.insertId });
        }
    );
});


//------------------//Edição de pessoas no banco//--------------//
let editandopessoa = null; // para conseguir atribuir a variavel de ediçao

<button class="btn_editar" onclick="editarpessoa(${id}),
 '${nome}, ${ida}, ${volta}">Editar</button>

function editarpessoa(id, nome, ida, volta) {

    editandopessoa = id;
    document.getElementById("input_nome").value = nome;
    document.getElementById("input_ida").value = ida;
    document.getElementById("input_volta").value = volta;
    abrirModal();
}

