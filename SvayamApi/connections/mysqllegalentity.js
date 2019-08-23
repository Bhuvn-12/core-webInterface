var mysql = require('mysql');
var propObj=require('../config_con.js');
//start mysql connection
var connection4 = mysql.createConnection(propObj.legal_entity_dataObj);
 

module.exports=connection4;