var express = require('express');
var router = express.Router();
var conUserData = require('../../../connections/mysqlUserData.js');
var conSystemData = require('../../../connections/mysqlsystemdata.js');
const util = require('util');
const fs = require('fs');
const readLine = require('readline');
const request = require('request');
var propObj = require('../../../config_con.js');
var producer = require('../../../connections/kafkaconnection.js');
var asyncjs = require('async');
var hiveconnection = require('../../../connections/hiveconnection.js');
hiveDbCon = hiveconnection.hivecon;
jdbcconnerr = hiveconnection.connerr;


const asyncUserData = util.promisify(conUserData.query).bind(conUserData);




function insertInReportingUint(input, callback) {
    value = {};
    sqlQuery = "insert into reporting_unit (ent_cd,ent_desc,src_system_cd,base_currency,gaap,ind_id) "
        + " select '" + input.ent_cd + "' as ent_cd, '" + input.ent_desc + "' as ent_desc ,country_cd,currency,native_gaap,'" + input.ind_id + "' as ind_id  from " + propObj.system_data_database + ".country_info where id='" + input.country_id + "'";
    console.log(sqlQuery);

    var hQuery="insert into ref_reporting_units(leaf_col_id,hierarchy_id,hierarchy_name,leaf_cd"
                +" ,leaf_desc,lvl3_cd,lvl3_desc) values"
                +" ('rpt_unit_no','RPT-001','Business Unit Hierarchy','"+input.ent_cd+"',"
                +"'"+input.ent_desc+"','"+input.ent_cd+"','"+input.ent_desc+"')"

    console.log("Hive repoerting unit insert -->",hQuery)
    
                hiveDbCon.reserve(function (err12, connObj) {
                    if(connObj){
                        var conn = connObj.conn;
                    
                        var hiveTasks=[];
            
                        hiveTasks.push(function (callback) {
                            //InsertProducts
                            conn.createStatement(function (err, statement) {
                                if (err) {
                                    callback(err);
                                } else {
                                    statement.executeUpdate(hQuery,
                                        function (err1, count) {
                                            if (err1) {
                                                callback(err1);
                                            } else {
                                                callback(null,count);
                                                
                                            }
                                    });
                                }
                            })
                        });
                            asyncjs.series(hiveTasks, function (err, results) {
                                
                                if(err!=null){
                                    console.log("Error routes-->settings-->configuration-->organization-->addLegalEntity-->insertInReportingUint", err)
                                    value["error"] = true;
                                    value["data"] = "Some error occured at the server side"
                                    return callback(value);
                                }else{
                                    conUserData.query(sqlQuery, (error, results) => {
                                        if (error) {
                                            console.log("Error routes-->settings-->configuration-->organization-->addLegalEntity-->insertInReportingUint", error)
                                            value["error"] = true;
                                            value["data"] = "Some error occured at the server side"
                                            return callback(value);
                                        } else {
                                
                                            /*  if (input.role_id == 'R2') {
                                 
                                                 insertQuery = "insert into user_xref_legal_entity_xref_role (user_id,ent_cd,role_id) values ('" + input.id + "','" + input.ent_cd + "','" + input.role_id + "')"
                                                 conUserData.query(insertQuery, (error, results) => {
                                                     if (error) {
                                                         console.log("Error routes-->settings-->configuration-->organization-->addLegalEntity-->user_xref_legal_entity_xref_role", error)
                                                         value["error"] = true;
                                                         value["data"] = "Some error occured at the server side"
                                 
                                                     } else {
                                                         value['error'] = false;
                                                         value['data'] = 'Data inserted in rpt_unit and user_xref_legal_entity_xref_role';
                                 
                                                     }
                                                     return callback(value);
                                                 })
                                             }
                                             else { */
                                
                                            sqlQuery = "select distinct u.user_id,role_id from user u inner join user_xref_legal_entity_xref_role ulr on u.user_id=ulr.user_id where u.user_id=" + input.user_id + "";
                                            console.log("***************", sqlQuery)
                                            conUserData.query(sqlQuery, (error, results) => {
                                                if (error) {
                                                    console.log("Error routes-->settings-->configuration-->organization-->addLegalEntity-->get_user_data", error)
                                                    value["error"] = true;
                                                    value["data"] = "Some error occured at the server side"
                                                    return callback(value);
                                                } else {
                                                    sqlQuery = "insert into user_xref_legal_entity_xref_role (user_id,ent_cd,role_id) values "
                                                        + " ('" + results[0].user_id + "','" + input.ent_cd + "','" + results[0].role_id + "')";
                                                    console.log("*************************", sqlQuery)
                                                    conUserData.query(sqlQuery, (error, results2) => {
                                                        if (error) {
                                                            console.log("Error routes-->settings-->configuration-->organization-->addLegalEntity-->user_xref_legal_entity_xref_role", error)
                                                            value["error"] = true;
                                                            value["data"] = "Some error occured at the server side"
                                
                                                        } else {
                                                            if (results[0].role_id = 'R2') {
                                                                value["error"] = false;
                                                                value["data"] = "Legal_entity inserted successfully"
                                                                callback(value);
                                                            } else {
                                
                                                                sqlQuery = "select  distinct u2.user_id,role_id from user u1 inner join user u2 on u1.acct_id=u2.acct_id inner join user_xref_legal_entity_xref_role ulr on u2.user_id=ulr.user_id"
                                                                    + "  where u1.user_id=" + results2[0].user_id + "  and role_id='R2'";
                                                                console.log("****************************************", sqlQuery)
                                                                conUserData.query(sqlQuery, (error, results) => {
                                                                    if (error) {
                                                                        console.log("Error routes-->settings-->configuration-->organization-->addLegalEntity-->get_user_data", error)
                                                                        value["error"] = true;
                                                                        value["data"] = "Some error occured at the server side"
                                                                        return callback(value);
                                                                    } else {
                                                                        sqlQuery = "insert into user_xref_legal_entity_xref_role (user_id,ent_cd,role_id) values "
                                                                            + " ('" + results[0].user_id + "','" + input.ent_cd + "','" + results[0].role_id + "')";
                                
                                                                        conUserData.query(sqlQuery, (error, results2) => {
                                                                            if (error) {
                                                                                console.log("Error routes-->settings-->configuration-->organization-->addLegalEntity-->user_xref_legal_entity_xref_role", error)
                                                                                value["error"] = true;
                                                                                value["data"] = "Some error occured at the server side"
                                
                                                                            } else {
                                                                                value["error"] = false;
                                                                                value["data"] = "Legal_entity inserted successfully"
                                                                                callback(value);
                                                                            }
                                                                        })
                                
                                                                    }
                                
                                                                })
                                                            }
                                
                                                        }
                                
                                                    })
                                
                                
                                                }
                                
                                            })
                                
                                        }
                                
                                        // }
                                    })
            
                                    hiveDb.release(connObj, function (err) {
                                        if (err) {
                                            console.log("Error routes-->sources-->admin-->addSrcSystem--Error while releasing con",error8)
                                        } else {
                                            console.log("Hive conn released")
                                        }
                                    })
                                }
            
                            });
                        
                    }else{
                        console.log("Error routes-->settings-->configuration-->organization-->addLegalEntity-->user_xref_legal_entity_xref_role", err12)
                        value["error"] = true;
                        value["data"] = "Some error occured at the server side"
                    }
                })

    

}
function createJsonForSourceSytemAndDrivedTable(input, callback) {
    var allrecord = {};

    var data = [];
   var product_increment=0;
   var event_increment=0;
    (async () => {

        sqlQuery = "select * from system_data.source_system where ind_id =" + input.ind_id + "";
        // console.log(sqlQuery)
        var soure_system_list = await asyncUserData(sqlQuery);
        var source_system = [];
        for (var ss_count = 0; ss_count < soure_system_list.length; ss_count++) {
            var singleSS = soure_system_list[ss_count];
            singleSS['is_automatic'] = null
            singleSS['kafka_ip'] = null
            singleSS['kafka_port'] = null
            singleSS['source_id'] = 'S' + ss_count

            sqlQuery = "select prod_id,ss_id,prod_cd,prod_desc,dtl_prod_cd,dtl_prod_desc,off_balance_sheet_exposure_type,credit_conversion_factor from " + propObj.system_data_database + ".products  where ss_id='" + singleSS.ss_id + "'"

            var product_list = await asyncUserData(sqlQuery);
            var products = [];
            for (var product_count = 0; product_count < product_list.length; product_count++) {
                var singleProduct = product_list[product_count];
                singleProduct['source_id'] = 'S' + ss_count
                singleProduct['product_id'] = 'P' + product_increment;
                sqlQuery = "select  ev_id,ev_name,screen_to_project,prod_id from " + propObj.system_data_database + ".events where prod_id =" + singleProduct.prod_id + ""
                var event_list = await asyncUserData(sqlQuery);
                var events = [];
                for (var event_count = 0; event_count < event_list.length; event_count++) {

                    var singleEvents = event_list[event_count];
                    singleEvents['product_id'] = 'P' + product_increment;
                    singleEvents['event_id'] = 'E' + event_increment;
                    var accounts = [];


                    sqlQuery = "select * from " + propObj.system_data_database + ".accounts where ev_id='" + singleEvents.ev_id + "'";
                    var accounts_list = await asyncUserData(sqlQuery);
               
                    for (var account_count = 0; account_count < accounts_list.length; account_count++) {
                        var single_account = accounts_list[account_count]
                        single_account['event_id'] = 'E' + event_increment;
                        accounts[account_count] = single_account;
                       
                    }
                    if(accounts.length>0){
                    singleEvents['accounts'] = accounts;
                    }else{
                        singleEvents['accounts'] =[];
                    }
                    events[event_count] = singleEvents;
                    event_increment++;
                }
                singleProduct['events'] = events;
                products[product_count] = singleProduct;

                product_increment++;
            }
            singleSS['products'] = products;
            source_system[ss_count] = singleSS;

        }

        allrecord['data'] = source_system;


        sqlQuery = "select * from " + propObj.system_data_database + ".customer";
        // console.log(sqlQuery)
        var customer_list = await asyncUserData(sqlQuery);
        allrecord['ent_cd'] = input.ent_cd;
        allrecord['customer'] = customer_list;
        // console.log("**************************************", allrecord)
        return callback(allrecord)
    })()



}








module.exports = router;


//****************************************************************************************************************************************************************
//            Alok
//****************************************************************************************************************************************************************


router.get('/getlegalEntity:user_id', function (req, res) {
    console.log("calling")
    var value = {};
    var user_id = req.params.user_id
    conUserData.query("select x.ent_cd,ent_desc,base_currency,presentation_currency from reporting_unit x inner join user_xref_legal_entity_xref_role y on x.ent_cd=y.ent_cd where user_id='" + user_id + "'", function (error, results) {
        if (error) {
            console.log("Error routes-->settings-->Configuration-->Organization-->getlegalEntity", error);
            value['error'] = true
            value['data'] = "Can't fetch LegalEntity right now. Please try again later";
            res.send(value)
        }
        else {
            value['error'] = false
            value['data'] = results;
            res.send(value);
        }
    });
});

router.get('/getindustry', function (req, res) {
    var value = {};
    conSystemData.query("select ind_id, ind_name from industries", function (error, results) {
        if (error) {
            console.log("Error routes-->settings-->Configuration-->Organization-->getindustry", error);
            value['error'] = true
            value['data'] = "Can't fetch idustry right now. Please try again later";
            res.send(value)
        }
        else {
            value['error'] = false
            value['data'] = results;
            res.send(value);
        }
    });
});

router.get('/getcountry', function (req, res) {
    console.log("calling")
    var value = {};
    conSystemData.query("select id, country_name from country_info", function (error, results) {
        if (error) {
            console.log("Error routes-->settings-->Configuration-->Organization-->getcountry", error);
            value['error'] = true
            value['data'] = "Can't fetch country right now. Please try again later";
            res.send(value)
        }
        else {
            value['error'] = false
            value['data'] = results;
            res.send(value);
        }
    });
});

router.get('/getcurrency', function (req, res) {
    console.log("calling")
    var value = {};
    conSystemData.query("select currency from country_info", function (error, results) {
        if (error) {
            console.log("Error routes-->settings-->Configuration-->Organization-->getcurrency", error);
            value['error'] = true
            value['data'] = "Can't fetch Currency right now. Please try again later";
            res.send(value)
        }
        else {
            value['error'] = false
            value['data'] = results;
            res.send(value);
        }
    });
});

router.get('/getcostCenter', function (req, res) {
    console.log("calling")
    var value = {};
    //var cst_cd=req.params.cst
    conSystemData.query("select cost_center_cd,cost_center_desc from cost_center ", function (error, results) {
        if (error) {
            console.log("Error routes-->settings-->Configuration-->Organization-->getcostCenter", error);
            value['error'] = true
            value['data'] = "Can't fetch Cost Center right now. Please try again later";
            res.send(value)
        }
        else {
            value['error'] = false
            value['data'] = results;
            res.send(value);
        }
    });
});


router.put('/updateReporting', function (req, res) {
    var value = {};
    var input = req.body;
    /// console.log(input)

    var allGaap={}
    var allAcc={}


    var list_currency = input.currency;
    list_currency = list_currency.split(",");
    console.log(list_currency);
    var currency_all = '';
    for (var count = 0; count < list_currency.length; count++) {
        currency_all += "'" + list_currency[count] + "'";
        if (count < list_currency.length - 1)
            currency_all += ',';
    }

    var query1 = "select native_gaap from country_info where currency in (" + currency_all + ")"

    console.log(query1)
    conSystemData.query(query1, function (error, results) {
        if (error) {
            console.log("Error routes-->settings-->Configuration-->Organization-->updateReporting", error);
            value['error'] = true
            value['data'] = "Server Side error. Can't update your Reporting Unit";
            res.send(value)
        }
        else {
            var gaap_all = '';
            if (results.length > 0) {
                
                for (var count = 0; count < results.length; count++) {
                    allGaap[results[count].native_gaap]="";
                    if (count == results.length - 1) {
                        gaap_all = gaap_all + results[count].native_gaap;
                    } else {
                        gaap_all = gaap_all + results[count].native_gaap + ",";
                    }
                    //gaap_all+=results[count].native_gaap;
                    //if(count<results-1)
                    //gaap_all+=',';
                }
                
                var query2 = "select gaap,presentation_currency from reporting_unit where ent_cd='" + input.ent_cd + "' ";

                var sql="Select distinct account_number from account_reclass where ent_cd='"+input.ent_cd+"'"
                conUserData.query(query2+";"+sql, function (error, results1) {

                    if (error) {
                        console.log("Error routes-->settings-->Configuration-->Organization-->updateReporting", error);
                        value['error'] = true
                        value['data'] = "Server Side error. Can't update your Reporting Unit";
                        res.send(value)
                    }
                    else {
                        var gaap = results1[0][0].gaap;
                        if (gaap_all != '') {
                            gaap = gaap + "," + gaap_all;
                        }
                        var presentation_curr = results1[0][0].presentation_currency;
                        
                        if (presentation_curr != null && presentation_curr != 'null' && presentation_curr != '') {
                            presentation_curr += "," + input.currency;
                        }
                        else {
                            presentation_curr = input.currency;
                        }

                        for(var j=0;j<results1[1].length;j++){
                            allAcc[results1[1][j].account_number]="";
                        }

                        var rclsAccPresent=false

                        var acc=Object.keys(allAcc);
                        var gap=Object.keys(allGaap);

                        var rclsQuery="insert into account_reclass (ent_cd,account_number,gaap,reclass_account) values "

                        for(var k=0;k<acc.length;k++){
                            var an=acc[k];

                            for(var l=0;l<gap.length;l++){
                                rclsAccPresent=true;
                                var g=gap[l]
                                rclsQuery+="('"+input.ent_cd+"','"+an+"','"+g+"','"+an+"'),"

                            }
                        }

                        var query = "update reporting_unit set ent_desc='" + input.ent_desc + "' "
                            + ", presentation_currency='" + presentation_curr + "',gaap='" + gaap + "' where ent_cd='" + input.ent_cd + "' ";
                        console.log(query)

                        if(rclsAccPresent){
                            rclsQuery=rclsQuery.substring(0,rclsQuery.length-1);

                            query+=";"+rclsQuery;
                        }
                        conUserData.query(query, function (error, results) {
                            if (error) {
                                console.log("Error routes-->settings-->Configuration-->Organization-->updateReporting", error);
                                value['error'] = true
                                value['data'] = "Server Side error. Can't update your Reporting Unit";
                                res.send(value)
                            }
                            else {
                                value['error'] = false
                                value['data'] = "Reporting unit update Successfully Updated";
                                res.send(value)
                            }
                        });
                    }
                })
            }
            else {
                var query = "update reporting_unit set ent_desc='" + input.ent_desc + "' where ent_cd='" + input.ent_cd + "' ";
                console.log(query)
                conUserData.query(query, function (error, results) {
                    if (error) {
                        console.log("Error routes-->settings-->Configuration-->Organization-->updateReporting", error);
                        value['error'] = true
                        value['data'] = "Server Side error. Can't update your Reporting Unit";
                        res.send(value)
                    }
                    else {
                        value['error'] = false
                        value['data'] = "Reporting unit update Successfully Updated";
                        res.send(value)
                    }
                });

            }
        }

    })

});




/* router.post('/addLegalEntity', function (req, res) {
    var value = {};
    var input = req.body;
    console.log("input--", input)

    //insert into reporting unit table
    var query = "insert into reporting_unit (ent_cd,ent_desc,ind_id,src_system_cd,base_currency,gaap) "
        + " select '" + input.ent_cd + "' as ent_cd, '" + input.ent_desc + "' as ent_desc ,'" + input.ind_id + "' as "
        + " ind_id ,country_cd,currency,native_gaap from " + propObj.system_data_database + ".country_info"
        + " where id='" + input.country_id + "'";
    console.log(query)
    conUserData.query(query, function (error, results) {
        if (error) {
            console.log("Error routes-->settings-->Configuration-->Organization-->addlegalEntity", error)
            value['error'] = true
            value['data'] = "Can't add Legal Entity . Please try again later";
            res.send(value)
        }
        else {
            var srcQuery = "insert into source_system (ent_cd,ss_name,ind_id) "
                + "select '" + input.ent_cd + "' ,ss_name ,'" + input.ind_id + "' from " + propObj.system_data_database + ".source_system where ind_id='" + input.ind_id + "' "

            console.log("qry--", srcQuery)
            value['error'] = false
            value['data'] = "LegalEntity Added Successfully";
            res.send(value)
        }
    });
}); */

function costCenterInsertion(input, callback) {
    var value = {};
    var query = "insert into cost_center(cost_center_cd,cost_center_desc,ent_cd,iue_cost_center_ind)"
        + "values('cc1','default_cost_center','" + input.ent_cd + "' ,'Y')"
    conUserData.query(query, function (error, results) {
        if (error) {
            console.log("Error routes-->settings-->Configuration-->Organization-->addLegalEntity-->costCenterInsertion function", error);
            value['error'] = true
            value['data'] = "Server Side error. Can't update your Reporting Unit";
            callback(value)
        }
        else {
            value['error'] = false
            value['data'] = "Successfully Updated";
            callback(value)
        }
    });
}


function insertInRule(input1, callback) {

    try {

        //  var ent_cd = postData[0].ent_cd;
        var ent_cd = input1.ent_cd;
        var state_of_rule_file;
        // var isFastSetup = postData[0].fast_setup;
        var file_fast_setup = "default_fast.drl";
        //  var file_adv_setup = "default_advanced.drl"
        var parentPath = './ruleFiles/';
        var values = {};

        var dir = parentPath + ent_cd;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        //  if (isFastSetup == 1) {
        console.log("\n\n\n\n inside fast")
        state_of_rule_file = "ACTIVE";
        var sourceLoc = parentPath + file_fast_setup;
        var destLoc = parentPath + ent_cd + '/default.drl';

        var readerStream = fs.createReadStream(sourceLoc);

        readerStream.setEncoding("UTF-8");

        let rl = readLine.createInterface({ input: readerStream })


        var writerStream = fs.createWriteStream(destLoc);

        var line_no = 0;

        rl.on('line', function (line) {
            var str = line.toString();

            if (str.includes("$##$svayam$##$")) {
                line_no += 1;
                str = str.replace(/\$##\$svayam\$##\$/g, ent_cd);
            }
            writerStream.write(str + '\n', "UTF-8");

        });

        readerStream.on('end', function () {
            console.log("Writing of default file complete closing write stream")
            writerStream.end();
        });

        readerStream.on('error', function (err) {
            console.log("Error in reading file-->" + err);
            callback(JSON.stringify(err))
        });

        rl.on('close', function (line) {
            console.log("total lines-", line_no)
        })
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        writerStream.on('finish', function () {
            console.log("Write completed.");
            console.log("************************************************************************************");
            var sql_rule_info = "insert into rule_file_info (ent_cd,file_name,status) values('" + ent_cd + "','default.drl','" + state_of_rule_file + "')";
            console.log("************************************************************************************", sql_rule_info);
            conUserData.query(sql_rule_info, function (error, results) {
                if (error) {
                    callback(JSON.stringify(error))
                } else {
                    // nifiVal.reloadData(function (response) {

                    // if (response == 1) {
                    //    callback(JSON.stringify("ERROR!!!Cant reload nifi"))
                    //   } else {
		
                    /*payloads = [
                        { topic: 'src_event', messages: 'reload_data', partition: 0 }
                    ];
                    producer.send(payloads, function (err, data) {
                        if (err) {
                            console.log(err);

                        } else { 
                            console.log("\n\n\n success messages send to kafka ");
			}
		   });*/

                    var helperSourceLoc = parentPath + '/helper_properties.json';
                    var helperDestLoc = parentPath + ent_cd + '/helper_properties.json';

                    fs.copyFile(helperSourceLoc, helperDestLoc, { recursive: true }, (err) => {
                        if (err) {
                            console.log("Error" + err)
                            values['error'] = true;
                            values['data'] = err;
                            callback(values)
                        } else {
                            values['error'] = false;
                            values['data'] = "Rule file is uploaded";
                            callback(values)
                        }
                    });

                    //  }
                    // });

                }
            });
            //   }
            // });


        });

        writerStream.on('error', function (err) {
            console.log("Error in writing file-->" + err);
            callback(JSON.stringify(err))
        });


        /* } else {
            console.log("\n\n\n\n inside else")
            state_of_rule_file = "INACTIVE";
            var sourceLoc = parentPath + file_adv_setup;
            var destLoc = parentPath + ent_cd + '/default.drl';

            fs.copyFile(sourceLoc, destLoc, { recursive: true }, (err) => {
                if (err) {
                    console.log("Error" + err)
                    res.end(JSON.stringify(err))
                }
                else {
                    console.log('source was copied to destination');

                    var sql_rule_info = "insert into rule_file_info (ent_cd,file_name,status) values('" + ent_cd + "','default.drl','" + state_of_rule_file + "')";

                    connectionLe.query(sql_rule_info, function (error, results) {
                        if (error) {
                            res.send(JSON.stringify(error))
                        } else {
                            nifiVal.reloadData(function (response) {

                                if (response == 1) {
                                    res.end(JSON.stringify("ERROR!!!Cant reload nifi"))
                                } else {
                                    payloads = [
                                        { topic: 'src_event', messages: 'reload_data', partition: 0 }
                                    ];
                                    producer.send(payloads, function (err, data) {
                                        if (err) {
                                            console.log(err);

                                        } else {
                                            var helperSourceLoc = parentPath + '/helper_properties.json';
                                            var helperDestLoc = parentPath + ent_cd + '/helper_properties.json';

                                            fs.copyFile(helperSourceLoc, helperDestLoc, { recursive: true }, (err) => {
                                                if (err) {
                                                    console.log("Error" + err)
                                                    res.end(JSON.stringify(err))
                                                } else {
                                                    res.send(JSON.stringify("Ok"));
                                                }
                                            });
                                            //res.send(JSON.stringify("Ok"));
                                        }
                                    });

                                }
                            });

                        }
                    });
                }
            });
        } */
    } catch (ex) {
        console.log("Error in setting up rf--" + ex)
        callback(JSON.stringify("Some error while setting up rule file"))
    }

}

router.get('/gettest', function (req, res) {


    var value = {};

    var input = {};
 /*    input['ent_cd'] = 'R6666';
    input['ent_desc'] = 'sanjai_test1'; */
    input['ind_id'] = 1;
    input['user_id'] = 2;
    input['country_id'] = 1;
    createJsonForSourceSytemAndDrivedTable(input, function (source_sytem_all) {
        console.log("HI");
        res.send(source_sytem_all);
    });

    /*  createJsonForSourceSytemAndDrivedTable(input, function (source_sytem_all) {
 
                                 //console.log("****************************************")
                            insertInDrivedTable(input,source_sytem_all, function (data) {
                           console.log("HELLOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
                                  
                       })  
                    //   res.send(source_sytem_all);
     })
  */



})

function insertInDrivedTable(input, json_data, callback) {

    request.post('http://localhost:3000/sources/admin/addSrcSystem', { json: json_data }, (error, res, body) => {
        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&", res.body);
        return callback(res.body);

    })

}


router.post('/addLegalEntity', (req, res) => {
    
     var input =req.body;
     console.log(input);
    
   /*  input['ent_cd'] = 'R401';
    input['ent_desc'] = 'sanjai_New';
    input['ind_id'] = 1;
    input['user_id'] = 2;
    input['country_id'] = 1;  */ 

    insertInReportingUint(input, function (reporting_data) {
        console.log(reporting_data)
        if (!reporting_data.error) {
            console.log("reporting_data inserted sucessfully")
            insertInRule(input, function (rule_data) {
                if (!rule_data.error) {
                    console.log("source system rule file inserted sucessfully")
                    createJsonForSourceSytemAndDrivedTable(input, function (source_sytem_all) {
                        if (!source_sytem_all.error) {
                            console.log("source sytem json created sucessfully")
                            insertInDrivedTable(input, source_sytem_all, function (source_sytem_json_inserted) {
                                if (!source_sytem_json_inserted.error) {
                                    console.log("source sytem json inserted sucessfully")
                                    costCenterInsertion(input, function (cost_center) {
                                        if (!cost_center.error) {
                                            console.log("cost_center inserted sucessfully")
                                            var sql_insertAccControl="insert into accounting_control (ent_cd,fp_start_month,fp_start_year,fp_end_month,fp_end_year)"
                                                        +"Select '"+input.ent_cd+"' as ent_cd,starting_month_num,CASE when starting_month_num=1 then year(current_timestamp)"
                                                                               +" else CASE"
                                                                               +"  when month(current_timestamp) > ending_month_num then"
                                                                               +"  year(current_timestamp) else year(current_timestamp)-1 end "
                                                                               +"  end as fp_start_year,ending_month_num,"
                                                                               +"  CASE when month(current_timestamp) > ending_month_num then"
                                                                               +"  year(current_timestamp)+1 else year(current_timestamp) end as fp_end_year "
                                                                               +"  from "+propObj.system_data_database+".accounting_control where country_id='"+input.country_id+"'";
                                            conUserData.query(sql_insertAccControl,function(error9,resuls9,fields){
                                                if(error9){
                                                    console.log("Error routes-->settings-->configuration-->organisation-->addLegalEntity", error9);
                                                    value['error'] = true;
                                                    value['data'] = "Error occured while setting up legal entity. Please Contact support";
                                                    res.send(value);
                                                }else{
                                                    value['error'] = false;
                                                    value['data'] = "reporting unit setup completed";
                                                    res.send(value);
                                                }
                                            })

                                        } else {
                                            res.send(cost_center);
                                        }
                                    })
                                }
                                else {
                                    res.send(source_sytem_json_inserted);
                                }

                            })
                        }
                        else
                            res.send(source_sytem_all);
                    })
                }
                else
                    res.send(rule_data);
            })
        }
        else
            res.send(reporting_data);
    })
})


router.delete('/deleteLegalEntity:ent_cd', (req, res) => {
    console.log("calling")
    var value = {};
   var ent_cd= req.params.ent_cd;
      console.log(ent_cd)
    //var cst_cd=req.params.cst
    conUserData.query("delete from user_xref_legal_entity_xref_role  where ent_cd='"+ent_cd+"'", function (error, results) {
        if (error) {
            console.log("Error routes-->settings-->Configuration-->Organization-->getcostCenter", error);
            value['error'] = true
            value['data'] = "Can't fetch Cost Center right now. Please try again later";
            res.send(value)
        }
        else {
            value['error'] = false
            value['data'] = results;
            res.send(value);
        }
    });
    
});


router.get('/getAfterOrgSetupInfo:dtls', (req, res) => {

   
    var objectToSend={}

    var data={};


    var email=req.params.dtls;

    var sql_userInfo="Select * from user where email='"+email+"'";
    console.log(sql_userInfo);

    conUserData.query(sql_userInfo, function (error1, results1, fields) {
        if (error1) {
            console.log("Error routes-->login-->login",error1);
            objectToSend["error"]=true;
            objectToSend["data"]="Error while logging in. Please try again later"
            res.end(JSON.stringify(objectToSend))
        }else if(results1.length<1){
            objectToSend["error"]=true;
            objectToSend["data"]="Wrong Email or password"
            res.end(JSON.stringify(objectToSend))
        }else{
            var tempObj={};
            var user_id=results1[0].user_id;
            tempObj["user_id"]=results1[0].user_id
            tempObj["acct_id"]=results1[0].acct_id
            tempObj["acct_name"]=results1[0].acct_name
            tempObj["email"]=results1[0].email

            data["user_info"]=tempObj;
            
            var sql_checkLe="Select count(*) as numLe from user_xref_legal_entity_xref_role where user_id='"+user_id+"' and ent_cd is not null";
            conUserData.query(sql_checkLe, function (error, results, fields1) {
                if (error) {
                    console.log("Error routes-->login-->login",error);
                    objectToSend["error"]=true;
                    objectToSend["data"]="Error while logging in. Please try again later"
                    res.end(JSON.stringify(objectToSend))
                }else{
                    var numOfLe=results[0].numLe;

                    if(numOfLe==0){
                        
                        var sqlQuery="Select u.ent_cd,r.role_id,r.role_name,res.resource_id,res.resource_name,"
                                            +" group_concat(rxrxp.permission_id) as perms from "
                                            +" (Select * from user_xref_legal_entity_xref_role where user_id='"+user_id+"') u "
                                            +" join "+ propObj.system_data_database+".role_xref_resource_xref_perms rxrxp on u.role_id=rxrxp.role_id join role r"
                                            +"  on u.role_id=r.role_id join "+ propObj.system_data_database+".resource res on rxrxp.resource_id=res.resource_id"
                                            +" "
                                            +" group by r.role_id,r.role_name,res.resource_name,u.ent_cd";
                        
                        conUserData.query(sqlQuery,function(error2,results2,fields2){
                            if (error2) {
                                console.log("Error routes-->login-->login",error2);
                                objectToSend["error"]=true;
                                objectToSend["data"]="Error while logging in. Please try again later"
                                res.end(JSON.stringify(objectToSend))
                            }else{
                                var temp={};
                                temp["ent_cd"]="";
                                temp["role_id"]=results2[0].role_id;
                                temp["role_name"]=results2[0].role_name;
                                temp["ent_desc"]="";
                                var tempRes=[]
                                for(var i=0;i<results2.length;i++){
                                    var obj1={};
                                    obj1["resource_id"]=results2[i].resource_id;
                                    obj1["resource_name"]=results2[i].resource_name;
                                    obj1["permission_id"]=results2[i].perms;

                                    tempRes[i]=obj1;
                                }
                                temp["resource_info"]=tempRes;
                                data["ent_info"]=[];
                                data["ent_info"][0]=temp;

                                data["isLegalEntityPresent"]=false;
                                objectToSend["error"]=false;
                                objectToSend["data"]=data;
                                res.end(JSON.stringify(objectToSend))


                            }
                        });

                    }else{
                        var sqlQuery="Select u.ent_cd,rpt.ent_desc,r.role_id,r.role_name,res.resource_id,res.resource_name,"
                                            +" group_concat(rxrxp.permission_id) as perms from "
                                            +" (Select * from user_xref_legal_entity_xref_role where user_id='"+user_id+"') u "
                                            +" join "+ propObj.system_data_database+".role_xref_resource_xref_perms rxrxp on u.role_id=rxrxp.role_id join role r"
                                            +"  on u.role_id=r.role_id join "+ propObj.system_data_database+".resource res on rxrxp.resource_id=res.resource_id"
                                            +" join reporting_unit rpt on u.ent_cd=rpt.ent_cd "
                                            +" where u.ent_cd is not null "
                                            +" group by rpt.ent_desc,r.role_id,r.role_name,res.resource_name,u.ent_cd order by u.ent_cd";


                        conUserData.query(sqlQuery,function(error2,results2,fields2){
                            if (error2) {
                                console.log("Error routes-->login-->login",error2);
                                objectToSend["error"]=true;
                                objectToSend["data"]="Error while logging in. Please try again later"
                                res.end(JSON.stringify(objectToSend))
                            }else{
                                var entArr=[]
                                var t="";
                                var index=0;
                                var j=0;
                                for(var k=0;k<results2.length;k++){
                                    
                                    if(t==""||t!=results2[k].ent_cd){
                                        var temp={};
                                        t=results2[k].ent_cd;
                                        temp["ent_cd"]=results2[k].ent_cd;
                                        temp["role_id"]=results2[k].role_id;
                                        temp["role_name"]=results2[k].role_name;
                                        temp["ent_desc"]=results2[k].ent_desc;
                                        
                                        var tempRes=[]
                                        for(var i=index;i<results2.length;i++){
                                            var obj1={};
                                            if(results2[i].ent_cd!=t){
                                                index=i;
                                                break;
                                            }
                                            obj1["resource_id"]=results2[i].resource_id;
                                            obj1["resource_name"]=results2[i].resource_name;
                                            obj1["permission_id"]=results2[i].perms;

                                            tempRes.push(obj1);
                                        }
                                        temp["resource_info"]=tempRes;
                                        entArr[j++]=temp;


                                    }
                                    /* var temp={};
                                    temp["ent_cd"]=results2[k].ent_cd;
                                    temp["role_id"]=results2[k].role_id;
                                    temp["role_name"]=results2[k].role_name;
                                    var tempRes=[]
                                    for(var i=0;i<results2.length;i++){
                                        var obj1={};
                                        obj1["resource_id"]=results2[i].resource_id;
                                        obj1["resource_name"]=results2[i].resource_name;
                                        obj1["permission_id"]=results2[i].perms;

                                        tempRes[i]=obj1;
                                    }
                                    temp["resource_info"]=tempRes;
                                    entArr[k]=temp; */
                                }
                                data["ent_info"]=entArr;

                                data["isLegalEntityPresent"]=true;

                                objectToSend["error"]=false;
                                objectToSend["data"]=data;
                                res.end(JSON.stringify(objectToSend))
                                
                            }
                        });
                    }
                }

            });


        }
    });
    
});


