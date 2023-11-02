const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;
const name = 'Wesley';


function createConnection() {
    const config = {
        host: 'db',
        user: 'root',
        password: 'root',
        database: 'nodedb',
    
    };
    const connection = mysql.createConnection(config);

    return connection;
}

const connection = createConnection();
const sqlInsert = `INSERT INTO people(name) values('${name}')`;
connection.query(sqlInsert);
connection.end();


async function getFields() {
    const connection = createConnection();

    const sqlSelect = `SELECT * FROM people WHERE name = '${name}' `;

    return new Promise(function (resolve, reject    ) {
        connection.query(sqlSelect, (error, results, fields) => {
            return resolve(results);
        });
    });
}


app.get('/', async (req, res) => {
    let title = '<h1>Full Cycle Rocks!</h1> \n';
    let lista = '<ol> \n';

    await getFields().then(function(results) {
        results.forEach(element => {
            lista = lista.concat(`<li>${element.name}</li>\n`);
        });

        lista = lista.concat('</ol>');
    });

    const response = title.concat(lista);


    res.send(response);
})

app.listen(port, () => {
    console.log(`escutando na porta ${port}`);
});

