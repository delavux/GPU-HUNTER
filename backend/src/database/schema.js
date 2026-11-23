
const { connectDatabase, saveDatabase } = require('./connection');

let db;

async function initializeDatabase() {
    db = await connectDatabase();

    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            senha TEXT NOT NULL,
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS placas_video (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            fabricante TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS historico_precos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            placa_id INTEGER NOT NULL,
            loja TEXT NOT NULL,
            preco REAL NOT NULL,
            data_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (placa_id) REFERENCES placas_video(id)
        );

        CREATE TABLE IF NOT EXISTS historico_precos_diarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            placa_id INTEGER NOT NULL,
            data_observacao TEXT NOT NULL,
            preco_minimo REAL NOT NULL,
            preco_medio REAL,
            quantidade_ofertas INTEGER,
            loja_menor_preco TEXT,
            fonte TEXT NOT NULL DEFAULT 'RadarGPU',

            UNIQUE (placa_id, data_observacao, fonte),

            FOREIGN KEY (placa_id)
                REFERENCES placas_video(id)
        );
    `);

    saveDatabase();

    console.log('Banco de dados inicializado!');

    return db;
}

module.exports = { initializeDatabase };
