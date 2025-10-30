const {Pool} = require('pg');

const pool = new Pool({

user: 'postgres',
host: 'localhost',
database: 'compras',
password: 'wcc@2023',
port: 5432,

});


pool.connect()
.then(()=>console.log('Conectado ao PostgresSQL'))
.catch(err=>console.error('Erro na conexão com o banco de dados', err));

module.exports = pool;