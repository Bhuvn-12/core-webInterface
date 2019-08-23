var mysql = require('mysql');
var propObj=require('../config_con.js');


var connProcessingDb = mysql.createConnection(propObj.processingDbCon);

connProcessingDb.connect(function (err) {
    if (err) {
        console.log('Error in Mysql connection With processing_data database :-', err);
    } else {
        console.log('You are now connected with mysql processing_data database...');
    }
})

module.exports=connProcessingDb;
 
