var express = require('express');
var router = express.Router();
var conSystemData = require('../connections/mysqlsystemdata.js');
var conUserData = require('../connections/mysqllegalentity.js');
var conProcessingData = require('../connections/mysqlPrcessingDbCon.js')
var hiveconnection = require('../connections/hiveconnection.js');
var format = require('date-format');
var asyncjs = require('async');

hiveDb=hiveconnection.hivecon;
jdbcconnerr=hiveconnection.connerr







router.get("/getAnnouncements",function(req,res){

    var sql_annInfo="Select * from announcements order by ann_id DESC limit 3";

    console.log("Geting announcements")
    var objectToSend={};

    conSystemData.query(sql_annInfo,function(error4,results4){
        if(error4){
            console.log("Error routes-->home-->getAnnouncements--",error4)
            objectToSend["error"]=true
            objectToSend["data"]="Server Side Error Occured"
            res.end(JSON.stringify(objectToSend))
        }else{
            objectToSend["error"]=false
            objectToSend["data"]=results4
            res.send(JSON.stringify(objectToSend))
        }
    });

});


//info page request 
router.get("/getSystemStats:dtls",function(req,res){

    var user_id=req.params.dtls.trim()

    var objectToSend={};

    var sql_get_roles="Select group_concat(role_id) as roles from user_xref_role where user_id='"+user_id+"'";

    var sql_name_email="Select concat(f_name,' ',l_name) as Name, Email,Acct_id,acct_name from user where user_id='"+user_id+"'";
    var sql_current_ppd="Select ppd from ppd_realtime_ctl where current_timestamp  between valid_start_ts and valid_end_ts";
    var sql_assigned_le="Select ent_cd from user_xref_legal_entity_xref_role where user_id='"+user_id+"'";
    var sql_num_users="Select count(*) as num_users from user where acct_id=(Select acct_id from user where user_id ='"+user_id+"') ";

    var finalResult={};

    conUserData.query(sql_get_roles,function(err,result){
        if(err){
            console.log("Error routes-->home-->getInfoPageDetails--",err)
            objectToSend["error"]=true
            objectToSend["data"]="Server Side Error Occured"
            res.end(JSON.stringify(objectToSend))
        }else if(result.length<1){
            objectToSend["error"]=true
            objectToSend["data"]="No roles assigned to this user"
            res.end(JSON.stringify(objectToSend))
            
        }else{

            try{
                console.log(result[0])
                var all_roles=result[0].roles.split(",");

                /////////////////////
                ///////if the user's top role is platform admin

                if(all_roles.includes("R1")){
                    objectToSend["error"]=false
                    objectToSend["data"]=""
                    res.send(JSON.stringify(objectToSend))
                }
                /////////////////////////
                ///////if the user's top role is Account admin
                else if(all_roles.includes("R2")){
                    conUserData.query(sql_name_email,function (error, results) {

                        if(error){
                            console.log("Error routes-->home-->getInfoPageDetails--",error)
                            objectToSend["error"]=true
                            objectToSend["data"]="Server Side Error Occured"
                            res.end(JSON.stringify(objectToSend))
                        }else if(results.length<1){
                            console.log("Error routes-->home-->getInfoPageDetails--No such user")
                            objectToSend["error"]=true
                            objectToSend["data"]="No such user in system"
                            res.end(JSON.stringify(objectToSend))
                
                        }else{
                            try{
                
                                
                
                                finalResult=JSON.parse(JSON.stringify(results))[0];
                
                                conUserData.query(sql_num_users,function (error0,results0){
                
                                    if(error0){
                                        console.log("Error routes-->home-->getInfoPageDetails--",error0)
                                        objectToSend["error"]=true
                                        objectToSend["data"]="Server Side Error Occured"
                                        res.end(JSON.stringify(objectToSend))
                                    }else{
                                        finalResult["Users"]=results0[0].num_users;
                
                                        conUserData.query(sql_current_ppd,function(error1,results1){
                                           
                                            if(error1){
                                                console.log("Error routes-->home-->getInfoPageDetails--",error1)
                                                objectToSend["error"]=true
                                                objectToSend["data"]="Server Side Error Occured"
                                                res.end(JSON.stringify(objectToSend))
                                            }else if(results1.length<1){
                                                objectToSend["error"]=true
                                                objectToSend["data"]="No Ppd Present"
                                                res.end(JSON.stringify(objectToSend))
                                    
                                            }else{
                                                finalResult["PPD"]=format('yyyy-MM-dd', results1[0].ppd);
                                                conUserData.query(sql_assigned_le,function(error2,results2){
                                                    if(error2){
                                                        console.log("Error routes-->home-->getInfoPageDetails--",error2)
                                                        objectToSend["error"]=true
                                                        objectToSend["data"]="Server Side Error Occured"
                                                        res.end(JSON.stringify(objectToSend))
                                                    }else if(results2.length<1){
                                                        finalResult["Legal Entites"]=0;
                                                        finalResult["Arrangement"]=0;
                                                        finalResult["Sje"]=0;
                                                        finalResult["Ip"]=0;
                                                        finalResult["Sources"]=0;

                                                        console.log("Final Result is ",finalResult)
                        
                                                        objectToSend["error"]=false
                                                        objectToSend["data"]=finalResult
                                                        res.send(JSON.stringify(objectToSend))
                                            
                                                    }else{
                                                        finalResult["Legal Entites"]=results2.length;
                
                                                        console.log(results2)
                                                        var legal_entites="(";
                
                
                                                        for(var i=0;i<results2.length;i++){
                
                                                            if(i==results2.length-1){
                                                                legal_entites+="'"+results2[i].ent_cd+"')"
                                                            }else{
                                                                legal_entites+="'"+results2[i].ent_cd+"',"
                                                            }
                                                            
                                                        }
                                                        var sql_all_counts="Select name,sum(num_of_records) as num_rec from stream_status where org_unit_cd in "+legal_entites+" and name in ('Ip','Arrangement') group by name union all Select \"Sje\",sum(num_of_records) as num_rec from stream_status where org_unit_cd in "+legal_entites+" and name not in ('Ip','Arrangement','JsfGeneration')"
                                                        console.log("Allcount query-->",sql_all_counts)
                
                                                        var sql_src_system="Select count(ss_id) as num_src from source_system where ent_cd in "+legal_entites;
                
                
                                                        conProcessingData.query(sql_all_counts,function(error3,results3){
                                                            if(error3){
                                                                console.log("Error routes-->home-->getInfoPageDetails--",error3)
                                                                objectToSend["error"]=true
                                                                objectToSend["data"]="Server Side Error Occured"
                                                                res.end(JSON.stringify(objectToSend))
                                                            }else if(results3.length<1){
                                                                console.log("Error routes-->home-->getInfoPageDetails--",error3)
                                                                objectToSend["error"]=true
                                                                objectToSend["data"]="Server Side Error Occured"
                                                                res.end(JSON.stringify(objectToSend))
                                                    
                                                            }else{
                        
                                                                var r=JSON.parse(JSON.stringify(results3));
                
                                                                for(var k=0;k<results3.length;k++){
                                                                    finalResult[results3[k].name]=results3[k].num_rec
                                                                }
                        
                                                                
                
                                                                conUserData.query(sql_src_system,function(error4,results4){
                                                                    if(error4){
                                                                        console.log("Error routes-->home-->getInfoPageDetails--",error3)
                                                                        objectToSend["error"]=true
                                                                        objectToSend["data"]="Server Side Error Occured"
                                                                        res.end(JSON.stringify(objectToSend))
                                                                    }else if(results4.length<1){
                                                                        console.log("Error routes-->home-->getInfoPageDetails--",error3)
                                                                        objectToSend["error"]=true
                                                                        objectToSend["data"]="Server Side Error Occured"
                                                                        res.end(JSON.stringify(objectToSend))
                                                                    }else{
                                                                        finalResult["Sources"]=results4[0].num_src;
                                                                        console.log("Final Result is ",finalResult)
                        
                                                                        objectToSend["error"]=false
                                                                        objectToSend["data"]=finalResult
                                                                        res.send(JSON.stringify(finalResult));
                                                                    }
                        
                                                                    
                                                                });
                        
                                                                
                                                            }
                                                        });
                                                    }
                
                                                });
                                            }
                                        });
                                    }
                                });
                
                            }catch(ex){
                                console.log("Error occurred in getAccounAdminInfo--",ex)
                            }
                        }
                
                    });

                }
                //////////////////////
                //////////if user's top role is legal entity admin
                
                /////////////////////////
                ///////////if user's top role is legal entity user or legal entity adjuster
                else if(all_roles.includes("R4")||all_roles.includes("R5")){

                    user_info_conn.query(sql_name_email,function (error, results) {

                        if(error){
                            res.end(JSON.stringify(error))
                        }else if(results.length<1){
                            res.end(JSON.stringify("No such user present in system"))
                
                        }else{
                            try{
                    
                                finalResult=JSON.parse(JSON.stringify(results))[0];
                
                                lookup_conn.query(sql_current_ppd,function(error1,results1){
                                    if(error1){
                                        res.end(JSON.stringify(error1))
                                    }else if(results1.length<1){
                                        res.end(JSON.stringify("No ppd present"))
                            
                                    }else{
                                        finalResult["PPD"]=format('yyyy-MM-dd', results1[0].ppd);
                                        connectionLe.query(sql_assigned_le,function(error2,results2){
                                            if(error2){
                                                res.end(JSON.stringify(error2))
                                            }else if(results2.length<1){
                                                finalResult["Legal Entites"]=0;
                                                finalResult["Arrangement"]=0;
                                                finalResult["Sje"]=0;
                                                finalResult["Ip"]=0;
                                                finalResult["Sources"]=0;

                                                console.log("Final Result is ",finalResult)
                
                                                res.send(JSON.stringify(finalResult));
                                    
                                            }else{
                                                finalResult["Legal Entites"]=results2.length;
                
                                                var legal_entites="(";
                
                
                                                for(var i=0;i<results2.length;i++){
                
                                                    if(i==results2.length-1){
                                                        legal_entites+="'"+results2[i].ent_cd+"')"
                                                    }else{
                                                        legal_entites+="'"+results2[i].ent_cd+"',"
                                                    }
                                                    
                                                }
                                                var sql_all_counts="Select name,sum(num_of_records) as num_rec from stream_status where org_unit_cd in "+legal_entites+" and name in ('Arrangement','Ip') group by name union all Select \"Sje\",sum(num_of_records) as num_rec from stream_status where org_unit_cd in "+legal_entites+" and name not in ('Ip','Arrangement','JsfGeneration')"
                                                console.log("Allcount query-->",sql_all_counts)
                
                                                var sql_src_system="Select count(distinct src_system) as num_src from prod_dtl where ent_cd in "+legal_entites;
                
                                                lookup_conn.query(sql_all_counts,function(error3,results3){
                                                    if(error3){
                                                        res.end(JSON.stringify(error3))
                                                    }else if(results3.length<1){
                                                        res.end(JSON.stringify("No counts can be obtained"))
                                            
                                                    }else{
                
                                                        //var r=JSON.parse(JSON.stringify(results3));
                
                                                        for(var k=0;k<results3.length;k++){
                                                            finalResult[results3[k].name]=results3[k].num_rec
                                                        }
                
                                                        //finalResult["counts"]=r;
                
                                                        connectionLe.query(sql_src_system,function(error4,results4){
                                                            if(error4){
                                                                res.end(JSON.stringify(error4))
                                                            }else if(results4.length<1){
                                                                res.end(JSON.stringify("No counts can be obtained for src systems"))
                                                    
                                                            }else{
                                                                finalResult["Sources"]=results4[0].num_src;
                                                            }
                
                                                            console.log("Final Result is ",finalResult)
                
                                                            res.send(JSON.stringify(finalResult));
                                                        });
                
                
                                                        
                
                                                        
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                
                            }catch(ex){
                                console.log("Error occured"+ex)
                            }
                        }
                
                    });

                }

                /////////////////
                ////if users top role don't need info page
                else{
                    console.log("No Info page available")
                    res.send(JSON.stringify("Info Details are not specified for this role"))
                }                
            }catch(ex){

                console.log("Error in getting info page details ", ex)
            }


        }
    });

});


router.get('/home_report:obj', function (req, res) {

    var ob= JSON.parse(req.params.obj);
var ent_cd=ob.ent_cd;
var dt=ob.acct_dt;
    var input={};
    getFilterForReport(ent_cd, function (responce) {
    input=responce;
    
    var sqlquery = "";
   var value={};
    var objectToSend={};
    if (jdbcconnerr == 1) {
        console.log("Error routes-->reports-->control-->trial_balance-->level1--Error in jdbc connection");
        objectToSend["error"]=true;
        objectToSend["data"]="Can't connect with datastore at the moment"
        res.end(JSON.stringify(objectToSend))
    } else {
        var params = input;
        var keys = [];
        sqlquery = "SELECT lvl4_cd,lvl1_desc, lvl2_desc,lvl3_desc,lvl4_desc,balance from svayam_data.bal_instrument_ledger s left join (select* from svayam_data.ref_chart_of_acc "
           + " where org_unit_cd='" +ent_cd+ "'  ) ref_chart_of_acc on(s.acct_num=leaf_cd )  where (s.book_cd in (" + input.book_cd + ") and  "
          + " s.tgt_curr_cd='" + input.tgt_curr_cd + "' and s.tgt_curr_type_cd='FN'  and s.org_unit_cd='" + ent_cd + "'  and acct_dt='"+dt+"'"
          +" and processing_date='"+input.ppd+"'"

       
        
        sqlquery = sqlquery + ") order by lvl4_cd "
        console.log("final Query----->" + sqlquery);
        hiveDb.reserve(function (err, connObj) {
            if (connObj) {
                console.log("Using connection: " + connObj.uuid);
                var conn = connObj.conn;
                // Query the database.
                asyncjs.series([
                    function (callback) {
                        // Select statement example.
                        conn.createStatement(function (err, statement) {
                            if (err) {
                                callback(err);
                            } else {
                                statement.executeQuery(sqlquery, function (err, resultset) {
                                    if (err) {
                                        callback(err)
                                    } else {
                                        // Convert the result set to an object array.
                                        var count = 0;
                                        resultset.toObjectIter(function (err, rs) {
                                            if (err) return callback(err);
                                            var firstrow = rs.rows.next();
                                            if (firstrow.done) {
                                                value['error']=true;
                                                value['data']="No Data found";
                                                res.send( value);
                                            } else {
                                                var rowIter = rs.rows;
                                                var rows = [];
                                                var row = firstrow;
                                                console.log(rows[0])
                                                while (!row.done) {
                                                    rows.push(row.value);
                                                   
                                                    count++;
                                                    row = rowIter.next();
                                                }
                                                rs.rows = rows;
                                                value['error']=false;
                                                value['data']=rs.rows;
                                                res.send( value);
                                               
                                            }
                                            return callback(null, rs);
                                        });
                                    }
                                });
                            }
                        })
                    },
                ], function (err, results) {
                    // Release the connection back to the pool.
                    hiveDb.release(connObj, function (err) {
                        if (err) {
                            console.log(err.message);
                        } else {
                            console.log("conn released")
                        }
                    })
                });
            }
        });
    }

})
})

function getFilterForReport(ent_cd,  callback) {
    var value={};
    var sqlQuery="select cast((select ppd from ppd_realtime_ctl where current_timestamp between valid_start_ts and valid_end_ts) as char) as ppd , base_currency,gaap from  reporting_unit where ent_cd='"+ent_cd+"'"

    conUserData.query(sqlQuery, function (error, results) {
        if (error) {
            console.log("Error routes-->home-->home_report->getFilterForReport", error);
            value['error'] = true
            value['data'] = "Server Side error. Can't update your Reporting Unit";
            callback(value)
        }
        else {
            console.log("data ********88888 ",results[0])
            if(results.length>0){
           var base_currency= results[0].base_currency;
           value['tgt_curr_cd']=base_currency;
           value['ppd']=results[0].ppd;
            var gaap =results[0].gaap;
           if(gaap!=undefined){
          gaap=gaap.split(",")[0];
             value['book_cd']="'"+gaap+"','IFRS'";
           }
           console.log(value);
            callback(value);
        }
        else{
            callback(value)
        }
        }

       
    });

}


router.get('/getSystemDataCounts:ent_cd', function (req, res) {
   var ent_cd =req.params.ent_cd;
    var value = {};
    var query="select name as processes,sum(num_of_records) as counts from stream_status where org_unit_cd ='"+ent_cd+"' and name in ('Arrangement','Ip','Prepare') group by processes "
   +"union select 'jsf' as processes,sum(num_of_records) as counts from stream_status where org_unit_cd ='"+ent_cd+"' and ppd=(select ppd from ppd_realtime_ctl where current_timestamp between valid_start_ts and valid_end_ts) and name in ('JsfGeneration','jsf')   group by processes ";
  console.log("&&&&&&&&&&&&&&&",query)
    conProcessingData.query(query, function (error, results) {
        if (error) {
            console.log("Error routes-->home-->getSystemDataCounts", error);
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
router.get('/getTutorials', function (req, res) {
    var ent_cd =req.params.ent_cd;
     var value = {};
     var query="select * from tutorials order by tut_id desc limit 3";
   console.log("&&&&&&&&&&&&&&&",query)
     conSystemData.query(query, function (error, results) {
         if (error) {
             console.log("Error routes-->home-->tutorials", error);
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

module.exports = router;
