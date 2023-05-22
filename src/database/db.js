//node src/database/db.js
//AUTOINCREMENT é para o javaScript criar o ID sozinho
//INTEGER = número 
//INTEGER = EXEMPLO proffys_id INTEGER significa que ele vai pegar pelo id e n pelo texto para réplica
//* significa tudo, todos (all) = import * from './nome'

import {Database} from 'sqlite-async'

const open = Database.open('src/database/database.sqlite').then(execute)
 function execute(db) {
    //criar as tabelas dos banco de dados
    //não fechar com , o último abaixo
    return db.exec(`
        CREATE TABLE IF NOT EXISTS proffys (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            avatar TEXT,
            whatsapp TEXT,
            bio TEXT
        );

        CREATE TABLE IF NOT EXISTS classes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject INTEGER,
            cost TEXT,
            proffy_id INTEGER
        );

        CREATE TABLE IF NOT EXISTS class_schedule(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            class_id INTEGER,
            weekday INTEGER,
            time_from INTEGER,
            time_to INTEGER
        );
    `)
 }

export default open