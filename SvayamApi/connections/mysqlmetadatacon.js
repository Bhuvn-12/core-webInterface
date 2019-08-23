var mysql = require('mysql');
var propObj=require('../config_con.js');
var connection1 = mysql.createConnection(propObj.metedataObj);  

connection1.connect(function (err) {
    if (err) {
        console.log('Error in Mysql connection With Metadata database :-', err);
    } else {
        console.log('You are now connected with mysql Metadata database...');
    }
})


module.exports=connection1;
