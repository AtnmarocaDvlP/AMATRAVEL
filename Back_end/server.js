const express = require("express"); // vai a pasta node_modules, encontra express e traz
const cors = require("cors");        // permite requisições do front-end
const path = require("path");        // manipulador de caminhos de arquivos

// --- Importação dos roteadores (cada um cuida de um domínio) ---
const pessoasRouter   = require("./routes/pessoas");
const viagensRouter   = require("./routes/viagens");
const historicoRouter = require("./routes/historico");

// --- Configuração do servidor ---
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../Front-End")));

// --- Montagem das rotas (server.js só organiza, não define lógica) ---
app.use("/pessoas",   pessoasRouter);
app.use("/viagens",   viagensRouter);
app.use("/historico", historicoRouter);

// --- Inicialização do servidor ---
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
