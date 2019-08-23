var mysql = require('mysql');
var propObj=require('../config_con.js')
//start mysql connection
 var connection3 = mysql.createConnection(propObj.system_dataObj);
connection3.connect(function (err) {
    if (err) {
        console.log('Error in Mysql connection With system_data database :-', err);
    } else {
        console.log('You are now connected with mysql system_data database...');
    }
})  

 
module.exports=connection3;
