const express = require("express"); // vai a pasta node_modules, encontra express e traz
const mysql = require("mysql2"); // faz a mesma coisa que o express mas com mysql
const cors = require("cors"); // faz a mesma coisa que o express mas com cors
const path = require("path");// manipulador de caminhos de arquivos
const app = express(); // criação do servidor a variavel app é o servidor
app.use(cors()); // permite requisições do front-end
app.use(express.json()); // permite que o servidor receba dados em formato json
app.use(express.static(path.join(__dirname, "../Front-End"))); // entrega o front end tambem em login em mesma rede 


//---------------// criação da conexão com o banco de dados //-------------//


const db = mysql.createConnection({
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
//---- Registro HTML ----//
app.get("/viagens", (req, res) => {
    // pega as informações que estão no cadastro de viagens com essa query
    db.query(`
            SELECT
            v.id AS id_viagem,
            v.ida,
            v.volta,
            v.data_viagem,
            p.nome AS nome_passageiro,
            p.id AS id_passageiro
        FROM viagens v
        JOIN viagem_passageiro vp ON  v.id = vp.viagem_id
        JOIN pessoa p ON vp.pessoa_id = p.id
        WHERE v.ativo = 1 
        `, (err, resultado) => {
        if (err) return res.status(500).json({ erro: err });
        res.json(resultado);
    });
});


// injeta no banco as informações que foram escritas no modal de registro de viagens

app.post("/viagens", (req, res) => {
    const { data_viagem, ida, volta, ids_passageiros } = req.body;
    db.query(
        "INSERT INTO viagens (data_viagem, ida, volta, ativo) VALUES (?, ?, ?, 1)",
        [data_viagem, ida, volta],
        (err, resultado) => {
            if (err) return res.status(500).json({ erro: err });

            const nova_viagem_id = resultado.insertId;

            ids_passageiros.forEach(id_da_pessoa => {
                db.query(
                    "INSERT INTO viagem_passageiro (viagem_id, pessoa_id, pago) VALUES (?, ?, 0)",
                    [nova_viagem_id, id_da_pessoa]
                );
            });
            res.json({ id: nova_viagem_id, sucesso: true });

        }
    );
})

// opção de deletar viagens
app.delete("/viagens/:id", (req, res) => {
    db.query(
        "UPDATE viagens SET ativo = 0 WHERE id = ?",
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json({ erro: err });
            res.json({ sucesso: true });
        }
    );
})


//----------------------//-------------------//----------------------//
// Histórico HTML //



app.get("/historico", (req, res) => {
    // criação das variaveis que vão ser usadas para os Filtros
    const {
        data_inicio,
        data_fim,
        pessoa_id,
        ida,
        volta
    } = req.query;

    let query = `    
        SELECT
        vp.id AS id_viagem_passageiro,
        p.nome AS nome_passageiro,
        v.data_viagem,
        v.ida,
        v.volta,
        p.valor_ida,
        p.valor_volta,
        vp.pago
        FROM viagem_passageiro vp

        JOIN pessoa p ON vp.pessoa_id = p.id

        JOIN viagens v ON vp.viagem_id = v.id

        WHERE V.ATIVO = 1`;

    let valores = [];

    // caso selecione os filtros os Ifs vão adicionar na query essas condições

    if (pessoa_id) {
        query += " AND vp.pessoa_id = ?";
        valores.push(pessoa_id);

    } if (data_inicio) {
        query += " AND v.data_viagem >= ?"
        valores.push(data_inicio);

    } if (data_fim) {
        query += " AND v.data_viagem <= ?"
        valores.push(data_fim);

    } if (ida) {
        query += " AND v.ida = ?"
        valores.push(ida);

    } if (volta) {
        query += " AND v.volta= ?"
        valores.push(volta);

    }

    // Executando no banco de dados
    db.query(query, valores, (err, resultado) => {
        if (err) return res.status(500).json({ erro: err });
        res.json(resultado);
    });


})