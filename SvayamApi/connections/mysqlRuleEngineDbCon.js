var mysql = require('mysql');
var propObj=require('../config_con.js').ruleEngineDbProps;

//start mysql connection
var connection = mysql.createConnection(propObj);
connection.connect(function (err) {
    if (err) {
        console.log('Error in Mysql connection With rule_engine database :-', err);
    } else {
        console.log('You are now connected with mysql rule_engine database...');
    }
})


module.exports=connection;
