//sql connection  variables
var mysqlHost="host5";
var mysqlPwd="fun2learn";
var mysqlUser="rajan";
var metadatabase="svayam_metadata";
var lookupdatabase="sje_lookup";
var user_info_database="user_info";
var legal_entity_database="user_data";
var ruleEngineDbName="rule_engine";





//////////////////////
/////
/////////////////////////F_add start
var system_data_database="system_data";
var processing_db_name="processing_data";
var user_data_dbName="user_data"
var source_system_db_name="source_system_data"

var sign_up_page = 'http://192.168.0.120/#/signup';

var hiveUrl='jdbc:svayamHive2://host2:10500/svayam_data'


//////////////////////
/////
/////////////////////////F_add end

//hdfs variables 
var hdfsHost="192.168.0.120";
var hdfsPort="50070";

//Nifi variables
var nifiGroupId = '9bd03d04-016a-1000-180a-87d20126f91e';
var ipadd = "http://192.168.0.210:9090";
var yarnadd="http://192.168.0.230:8088";
var getkafkaid="3773d263-0169-1000-ffff-ffff9ebc2f5c";
var nifi_var_name = "reload_metadata"


//kafka variables;
kafkaHost="192.168.0.210:2181"

var metadatacon={
    host: mysqlHost, //mysql database host name
    user: mysqlUser, //mysql database user name
    password: mysqlPwd, //mysql database password
    database: metadatabase, //mysql database name
}

var sje_lookupcon={
    host: mysqlHost, //mysql database host name
    user: mysqlUser, //mysql database user name
    password: mysqlPwd, //mysql database password
    database: lookupdatabase, //mysql database name
    multipleStatements: true

}

var user_infocon={
    host: mysqlHost, //mysql database host name
    user: mysqlUser, //mysql database user name
    password: mysqlPwd, //mysql database password
    database: user_info_database, //mysql database name
}

var legel_entitycon={
    host: mysqlHost, //mysql database host name
    user: mysqlUser, //mysql database user name
    password: mysqlPwd, //mysql database password
    database: legal_entity_database, //mysql database name
}






//////////////////////
/////
/////////////////////////F_add start

var userData_con={
    host: mysqlHost, //mysql database host name
    user: mysqlUser, //mysql database user name
    password: mysqlPwd, //mysql database password
    database: user_data_dbName, //mysql database name
    multipleStatements: true
}

var ruleEngineDbConfig={
    host: mysqlHost, //mysql database host name
    user: mysqlUser, //mysql database user name
    password: mysqlPwd, //mysql database password
    database: ruleEngineDbName, //mysql database name
    multipleStatements:true
}

var processingDbCon={
    host: mysqlHost, //mysql database host name
    user: mysqlUser, //mysql database user name
    password: mysqlPwd, //mysql database password
    database: processing_db_name, //mysql database name
}

var system_datacon={
    host: mysqlHost, //mysql database host name
    user: mysqlUser, //mysql database user name
    password: mysqlPwd, //mysql database password
    database: system_data_database, //mysql database name
}

var ss_datacon={
    host: mysqlHost, //mysql database host name
    user: mysqlUser, //mysql database user name
    password: mysqlPwd, //mysql database password
    database: source_system_db_name, //mysql database name
}

//////////////////////
/////
/////////////////////////F_add end

var hdfscon={
    user: mysqlUser,
    host: hdfsHost,
    port: hdfsPort,
    path: '/webhdfs/v1'
}

var hivecon={
    url: hiveUrl,
    drivername: 'com.svayam.jdbc.SvayamDriver',
    minpoolsize: 1,
    maxpoolsize: 100,
    user: 'browser_admin',
    password: 'browser_admin@321',
    properties: {}
}




module.exports={
    //sql connection prop
    metedataObj:metadatacon,
    sje_lookupObj:sje_lookupcon,
    user_infoObj:user_infocon,
    legal_entity_dataObj:legel_entitycon,


    /////////////////////////F_add end
    system_dataObj:system_datacon,
    processingDbCon:processingDbCon,
    userData_con:userData_con,
    ss_datacon:ss_datacon,

    system_data_database:system_data_database,


    ////signupLink
    sign_up_page: sign_up_page,

    /////////////////////////F_add end

    //hdfs connection prop
    hdfsObj:hdfscon,

    ruleEngineDbProps:ruleEngineDbConfig,
    
    //hive connection prop
    hiveconfig:hivecon,
    
    //nifi varialbles
    nifiGroupId: nifiGroupId,
    ipadd: ipadd,
    yarnadd: yarnadd,
    getkafkaid : getkafkaid,
    nifi_var_name: nifi_var_name,

    
    



    //kafka connection host string
    kafkaHost:kafkaHost


}
