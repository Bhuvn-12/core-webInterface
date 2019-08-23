var JDBC = require('jdbc');
var jinst = require('jdbc/lib/jinst');
var propObj=require('../config_con.js');


//initilization of jvm  and set classpath for jdbc connection 
if (!jinst.isJvmCreated()) {
    jinst.addOption("-Xrs");
    jinst.setupClasspath([ './SvayamHiveJdbc.jar']);
}

//initilization of sqlbd using sforce
var mysqldb = new JDBC(propObj.hiveconfig);
var jdbcconnerr=0;
mysqldb.initialize(function (err) {
    if (err) {
        console.log(err);
        jdbcconnerr = 1;
    }else{
        console.log("Hive connection is establish");
    }
});

module.exports={
    hivecon:mysqldb,
    connerr:jdbcconnerr
}
