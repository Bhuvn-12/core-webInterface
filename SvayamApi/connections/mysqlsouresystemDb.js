var mysql = require('mysql');
var propObj=require('../config_con.js');

//start mysql connection
var connection = mysql.createConnection(propObj.ss_datacon);
connection.connect(function (err) {
    if (err) {
        console.log('Error in Mysql connection With source_system_data database :-', err);
    } else {
        console.log('You are now connected with mysql source_system_data database...');
    }
})


module.exports=connection;
