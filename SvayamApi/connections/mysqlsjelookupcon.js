var mysql = require('mysql');
var propObj=require('../config_con.js');

//start mysql connection
var connection = mysql.createConnection(propObj.sje_lookupObj);
connection.connect(function (err) {
    if (err) {
        console.log('Error in Mysql connection With sje_lookup database :-', err);
    } else {
        console.log('You are now connected with mysql sje_lookup database...');
    }
})


module.exports=connection;
