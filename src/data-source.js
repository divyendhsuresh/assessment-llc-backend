const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'db_user',
    password: '6equj5_db_user',
    database: 'home_db',
    synchronize: false,
    logging: false,
    entities: [__dirname + '/entity/*.js'],
    migrations: [__dirname + '/migration/*.js'],
    subscribers: [__dirname + '/subscriber/*.js'],
});


AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });

module.exports = AppDataSource;