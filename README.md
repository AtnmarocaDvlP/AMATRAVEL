# 🚗 AMATRAVEL

Aplicação web para controle de caronas universitárias. Desenvolvida como projeto de aprendizado de desenvolvimento web full stack, integrando front-end, back-end e banco de dados relacional.

> Parte do ecossistema **AMA Group** — uma iniciativa pessoal de desenvolvimento de software e automações.

---

## 📋 Sobre o projeto

O AMATRAVEL permite registrar e acompanhar as caronas dadas para a faculdade, controlando quais passageiros foram na ida, na volta, quanto cada um deve e o histórico de pagamentos.

---

## ✨ Funcionalidades

- **Cadastro de passageiros** — adicionar, editar e excluir pessoas, com valores individuais de ida e/ou volta
- **Registro de viagens** — marcar quem foi e/ou voltou em cada dia, com data automática ou manual
- **Histórico de viagens** — visualizar todos os registros com filtros por pessoa e data, e controle de pagamento em massa
- **Relatório por pessoa** — visualizar o total devido, total pago e detalhamento por viagem de cada passageiro

---

## 🖥️ Telas

| Tela | Descrição |
|------|-----------|
| Cadastro de Pessoas | CRUD de passageiros com valores de ida e volta |
| Registro de Viagem | Check-in diário de quem foi e voltou |
| Histórico de Viagens | Tabela completa com filtros e controle de pagamento |
| Relatório | Visão financeira por pessoa, somente leitura |

---

## 🛠️ Tecnologias

- **Front-end:** HTML, CSS, JavaScript
- **Back-end:** Node.js + Express
- **Banco de dados:** MySQL

---

## 🗄️ Modelo de dados

```
Pessoa
├── id (PK)
├── nome
├── valor_ida (decimal)
├── valor_volta (decimal)
└── ativo (boolean — exclusão lógica)

Viagem
├── id (PK)
├── pessoa_id (FK → Pessoa)
├── data
├── foi (boolean)
├── voltou (boolean)
└── pago (boolean)
```

---

## 🚀 Como rodar o projeto

> Em breve — backend em desenvolvimento.

---

## 📚 Objetivo de aprendizado

Este projeto foi desenvolvido para praticar:

- Estruturação de HTML semântico
- Estilização com CSS puro e organização em múltiplos arquivos
- Modelagem de banco de dados relacional com MySQL
- Criação de APIs REST com Node.js e Express
- Integração entre front-end e back-end via `fetch`

---

## 👨‍💻 Autor

Desenvolvido por **Antonio** — estudante de tecnologia e fundador do AMA Group.
