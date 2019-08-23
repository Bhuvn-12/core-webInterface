var mysql = require('mysql');
var propObj=require('../config_con.js');
//start mysql connection
var connection4 = mysql.createConnection(propObj.userData_con);

connection4.connect(function (err) {
    if (err) {
        console.log('Error in Mysql connection With user_data database :-', err);
    } else {
        console.log('You are now connected with mysql user_data database...');
    }
})
 

module.exports=connection4;