
const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'gpu-hunter.db');

let db;

async function connectDatabase() {
    const SQL = await initSqlJs();

    if (fs.existsSync(dbPath)) {
        const fileBuffer = fs.readFileSync(dbPath);
        db = new SQL.Database(fileBuffer);
    } else {
        db = new SQL.Database();
    }

    console.log('SQLite conectado!');

    return db;
}

function saveDatabase() {
    if (!db) return;

    const data = db.export();
    fs.writeFileSync(dbPath, Buffer.from(data));
}

module.exports = { connectDatabase, saveDatabase };
