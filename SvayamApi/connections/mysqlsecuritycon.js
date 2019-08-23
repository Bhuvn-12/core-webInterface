var mysql = require('mysql');
var propObj=require('../config_con.js');

//start mysql connection
 var connection2 = mysql.createConnection(propObj.user_infoObj);
connection2.connect(function (err) {
    if (err) {
        console.log('Error in Mysql connection With user_info database :-', err);
    } else {
        console.log('You are now connected with mysql user_info database...');
    }
}) 

/* var connection2 = mysql.createConnection({
    host: 'localhost', //mysql database host name
    user: 'root', //mysql database user name
    password: 'root', //mysql database password
    database: 'security', //mysql database name
});
connection2.connect(function (err) {
    if (err) {
        console.log('Error in Mysql connection With user_info database :-', err);
    } else {
        console.log('You are now connected with mysql user_info database...');
    }
})  */

module.exports=connection2;
