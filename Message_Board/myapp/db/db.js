 var mysql = require('mysql');
 var  connection= mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'message2',
    multipleStatements: true
  });

 connection.connect(function(err){});
 
 module.exports = connection;

