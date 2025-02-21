/*
CREATE TABLE IF NOT EXISTS type (
id INT PRIMARY KEY AUTO_INCREMENT,
name varchar(20)
)

CREATE TABLE IF NOT EXISTS booking (
id int PRIMARY KEY AUTO_INCREMENT,
idType int NOT NULL,
date DATE NOT NULL,
hour INT NOT NULL,
name VARCHAR(50),
FOREIGN KEY (idType) REFERENCES type(id) 
*/

const fs = require('fs');
const mysql = require('mysql2');
const conf = JSON.parse(fs.readFileSync('config.json'));
conf.ssl = {
   ca: fs.readFileSync(__dirname + '/ca.pem')
}


module.exports = function database(config,service){
   const connection = mysql.createConnection(conf);
      const executeQuery = (sql) => {
         return new Promise((resolve, reject) => {
            connection.query(sql, function (err, result) {
               if (err) {
                  console.error(err);
                  reject();
               }
               console.log('done');
               resolve(result);
            });
         })
      }

      const database = {
         createTables: async () => {
            await executeQuery(`
            CREATE TABLE IF NOT EXISTS type (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name varchar(20)
            )          
            `);
            
            return await executeQuery(`
            CREATE TABLE IF NOT EXISTS booking (
            id int PRIMARY KEY AUTO_INCREMENT,
            idType int NOT NULL,
            date DATE NOT NULL,
            hour INT NOT NULL,
            name VARCHAR(50),
            FOREIGN KEY (idType) REFERENCES type(id))     
            `);
         },
         insert: async (booking) => {
            let sql = `
               INSERT INTO booking(id, idType, date, hour, name)
               VALUES (
                  '${booking.id}', 
                  '${booking.idType}', 
                  '${booking.date}', 
                  ${booking.hour}, 
                  ${booking.name})
                  `;
            const result = await executeQuery(sql);
         },
         select: async () => {
            let sql = `
            SELECT b.id, t.name type, b.date, b.hour, b.name FROM booking AS b JOIN type as t ON b.idType = t.id 
            `;
            const result = await executeQuery(sql);
            console.log ("la result è: "+ result);
            return result;
         },
         selectAll: async () =>{
            let sql= `
            SELECT * FROM booking
            `;
            const result = await executeQuery(sql);
            console.log ("la result totale: "+ result);
            return result;
         }
      }
      database.createTables();
      return database;
}