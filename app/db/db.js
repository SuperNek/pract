import sqlite3 from 'sqlite3';

let db = new sqlite3.Database("./234234.sqlite", (err) => {
    if (err) {
        console.log('Error to conneting DB', err.message)
    }
    console.log('Connecting to DB success');
})

export default db;