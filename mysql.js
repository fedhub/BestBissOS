var express    = require('express');
var my_sql     = require('mysql');
var mysql      = express.Router();

mysql.MySql_Connection = my_sql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    port	 : 3306,
    //password : 'shenkarYoker5',
    database : 'best_biss'
});

mysql.MySql_Connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... \n\n");
    } else {
        console.log("Error connecting database ... \n\n");
    }
});

module.exports = mysql;