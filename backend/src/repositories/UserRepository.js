
const { saveDatabase } = require('../database/connection');

let db;

function setDatabase(database) {
    db = database;
}

function create(nome, email, senha) {
    const stmt = db.prepare(`
        INSERT INTO usuarios (nome, email, senha)
        VALUES (?, ?, ?)
    `);

    stmt.run([nome, email, senha]);
    stmt.free();

    const id = db.exec('SELECT last_insert_rowid() AS id')[0].values[0][0];

    saveDatabase();

    return findById(id);
}

function findByEmail(email) {
    const stmt = db.prepare(
        'SELECT * FROM usuarios WHERE email = ?'
    );

    stmt.bind([email]);

    const user = stmt.step() ? stmt.getAsObject() : undefined;
    stmt.free();

    return user;
}

function findById(id) {
    const stmt = db.prepare(`
        SELECT id, nome, email, criado_em
        FROM usuarios WHERE id = ?
    `);

    stmt.bind([id]);

    const user = stmt.step() ? stmt.getAsObject() : undefined;
    stmt.free();

    return user;
}

module.exports = { setDatabase, create, findByEmail, findById };
