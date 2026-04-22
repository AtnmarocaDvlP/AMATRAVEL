const express = require("express"); // vai a pasta node_modules, encontra express e traz
const mysql = require("mysql2"); // faz a mesma coisa que o express mas com mysql
const cors = require("cors"); // faz a mesma coisa que o express mas com cors
const path = require("path");// manipulador de caminhos de arquivos
const app = express(); // criação do servidor a variavel app é o servidor
app.use(cors()); // permite requisições do front-end
app.use(express.json()); // permite que o servidor receba dados em formato json
app.use(express.static(path.join(__dirname, "../Front-End"))); // entrega o front end tambem em login em mesma rede 

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


app.get("/pessoas", (req, res) => { // quando acessado, rodar essa function que apenas ativo = 1 entra
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

app.put("/pessoas/:id", (req, res) => {
    const { nome, ida, volta } = req.body;
    db.query(
        "UPDATE pessoa SET nome = ?, valor_ida = ?, valor_volta = ? WHERE id = ?",
        [nome, ida, volta, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ erro: err });
            res.json({ sucesso: true });
        }
    );
})

//------------------//Deletar pessoas do banco//-----------------//

app.delete("/pessoas/:id", (req, res) => {
    db.query(
        "UPDATE pessoa SET ativo = 0 WHERE id = ?",
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json({ erro: err });
            res.json({ sucesso: true });
        }
    );
})

//-----------------------//--------------------------//---------------------//

app.post("/viagens", (req, res) => {
    const { data_viagem, ida, volta, ids_passageiros } = req.body;
    
    // 1º Pedaço: Insere a viagem "seca" na Tabela 1 (apenas a Placa do Carro e a Data)
    db.query(
        "INSERT INTO viagens (data_viagem, ida, volta, ativo) VALUES (?, ?, ?, 1)",
        [data_viagem, ida, volta],
        (err, resultado) => {
            if (err) return res.status(500).json({ erro: err });
            
            // Graças a Deus o banco acabou de criar a Viagem e gerou um ID novo pra ela (Ex: ID 5)
            const nova_viagem_id = resultado.insertId;
            
            // 2º Pedaço: Fazemos um Loop na Tabela 2! Pra CADA pessoa (Ex: 1, 5, 8), colocamos ela dentro daquela viagem 5
            ids_passageiros.forEach(id_da_pessoa => {
                db.query(
                    "INSERT INTO viagem_passageiro (viagem_id, pessoa_id, pago) VALUES (?, ?, 0)",
                    [nova_viagem_id, id_da_pessoa] 
                );
            });

            // Avisa o Frontend que os DOIS INSERTS terminaram com sucesso
            res.json({ id: nova_viagem_id, sucesso: true });
        }
    );
})