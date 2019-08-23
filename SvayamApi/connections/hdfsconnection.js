
var WebHDFS = require('webhdfs');
var propObj=require('../config_con.js');

//Hadoop file connection 
var hdfs = WebHDFS.createClient(propObj.hdfsObj);

module.exports=hdfs;
