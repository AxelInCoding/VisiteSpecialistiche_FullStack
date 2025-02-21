const mysql = require('mysql2');

module.exports = function database(conf){
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
            const response = await executeQuery(`SELECT name,id FROM type where id='${booking.idType}'`);
            console.log(booking);
            const template = `INSERT INTO booking (idType, date, hour, name) VALUES (${response[0].id}, '$DATE', ${booking.hour}, '$NAME')`;
            let sql = template.replace("$DATE", booking.date);
            sql = sql.replace("$NAME", booking.name);
            return await executeQuery(sql);
         },
         select: async () => {
            const sql = `
            SELECT b.id, t.name type, b.date, b.hour, b.name FROM booking AS b JOIN type as t ON b.idType = t.id 
            `;
            return await executeQuery(sql);
         },
         selectTypes: async () =>{
            const sql= `
            SELECT name FROM type
            `;
            return await executeQuery(sql);
         },
         truncate: async function () {
            const sql = `TRUNCATE TABLE booking;`
            return await executeQuery(sql);
        }
      }
      database.createTables();
      return database;
}