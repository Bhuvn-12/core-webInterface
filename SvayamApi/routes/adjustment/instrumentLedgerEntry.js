var express = require('express');
var router = express.Router();
var conSystemData = require('../../connections/mysqlsystemdata.js');
var conUserData = require('../../connections/mysqlUserData.js');
var conMetaData = require('../../connections/mysqlmetadatacon.js');


////////////////////////
//Request to get details for mjp
router.get('/getDetails:dtls', (req, res) => {

    var ent_cd=req.params.dtls;

    var objectToSend={}

    var temp={};
    var sql_tgtCurr="Select distinct currency from country_info";

    var sql_acct_num="Select account_number,acct_desc from accounts where ent_cd='"+ent_cd+"' group by account_number,acct_desc"

    
    var sql_cust="Select customer_type_cd,customer_type_desc,dtl_customer_type_cd,dtl_customer_type_desc from customer where"
                    +" ent_cd='"+ent_cd+"' group by "
                    +" customer_type_cd,customer_type_desc,dtl_customer_type_cd,dtl_customer_type_desc"

    var prod="Select prod_cd,prod_desc,dtl_prod_cd,dtl_prod_desc from products where ent_cd='"+ent_cd+"'group by "
                +"prod_cd,prod_desc,dtl_prod_cd,dtl_prod_desc"

    conSystemData.query(sql_tgtCurr, function (error1, results1, fields) {
        if(error1){
            console.log("Error routes-->adjustment-->instrumnetLe--getDetails->",error1);
            objectToSend["error"]=true;
            objectToSend["data"]="Can't fetch details at the moment. Please try again later"
            res.end(JSON.stringify(objectToSend))
        }else{
            var curArr=[]
            for(var k=0;k<results1.length;k++){
                curArr.push(results1[k].currency)
            }
            temp["currency"]=curArr;

            conUserData.query(sql_acct_num, function (error2, results2, fields2) {
                if(error2){
                    console.log("Error routes-->adjustment-->instrumnetLe--getDetails->",error2);
                    objectToSend["error"]=true;
                    objectToSend["data"]="Can't details at the moment. Please try again later"
                    res.end(JSON.stringify(objectToSend))
                }else{
                    temp["acct_info"]=results2;

                    
                            
        
                            conUserData.query(sql_cust, function (error4, results4, fields2) {
                                if(error4){
                                    console.log("Error routes-->adjustment-->instrumnetLe--getDetails->",error4);
                                    objectToSend["error"]=true;
                                    objectToSend["data"]="Can't details at the moment. Please try again later"
                                    res.end(JSON.stringify(objectToSend))
                                }else{
                                    temp["cust_info"]=results4;
                
                                    conUserData.query(prod, function (error5, results5, fields2) {
                                        if(error5){
                                            console.log("Error routes-->adjustment-->instrumnetLe--getDetails->",error5);
                                            objectToSend["error"]=true;
                                            objectToSend["data"]="Can't details at the moment. Please try again later"
                                            res.end(JSON.stringify(objectToSend))
                                        }else{
                                            temp["prod_info"]=results5;
                                            objectToSend["error"]=false;
                                            objectToSend["data"]=temp
                                            res.send(JSON.stringify(objectToSend))

                        
                        
                                        }
                                    });
                
                                }
                            });

                        

                }
            });

        }
    });

});



////////////////////////
//Request to post sjes
router.post('/postjournal', function (req, res) {
    
    var sentMsg = [];

    var jrnls=req.body;

    console.log(jrnls)


    var objectToSend={};

    var sql_getColNames="Select cd.col_short_name,lxc.col_seq_no from  (Select * from lf_col_xref where lf_id='LF_003') lxc join"
                            +" column_dtl cd" 
                           +" on lxc.col_id=cd.col_id order by lxc.col_seq_no"

    var sql_getPpd="Select DATE_FORMAT(ppd,'%Y-%m-%d') as ppd from ppd_realtime_ctl where current_timestamp between valid_start_ts and valid_end_ts"

    conUserData.query(sql_getPpd,function(er,results,fields){
        if(er){
            console.log("Error routes-->adjustment-->instrumnetLe--postjournal->",errAc);
            objectToSend["error"]=true;
            objectToSend["data"]="Can't post journal at the moment"
            res.send(JSON.stringify(objectToSend))
        }else{
            var ppd=results[0].ppd;

            conMetaData.query(sql_getColNames, function (errAc, results, fieldsAc) {
                if (errAc) {
                    console.log("Error routes-->adjustment-->instrumnetLe--postjournal->",errAc);
                    objectToSend["error"]=true;
                    objectToSend["data"]="Can't post journal at the moment"
                    res.send(JSON.stringify(objectToSend))
                }
                else {
        
                    for(var i=0;i<jrnls.length;i++){
                        var rec="";
        
                        var input=jrnls[i]
        
                        for(var j=0;j<results.length;j++){

                            
                            if(j==results.length-1){

                                if(results[j].col_short_name=="ppd"||results[j].col_short_name=="wod"){
                                    rec+=ppd;
                                }else{
                                    rec+=input[results[j].col_short_name];
                                }
                                
                            }else{
                                if(results[j].col_short_name=="ppd"||results[j].col_short_name=="wod"){
                                    rec+=ppd+",";
                                }else{
                                    rec+=input[results[j].col_short_name]+",";
                                }
                                
                            }
                            
                        }
                        sentMsg[i]=rec;
                    }
        
                    console.log("-----------------Journals Start-----------------")
                    console.log(sentMsg)
                    console.log("-----------------Journals End-------------------")
        
                    objectToSend["error"]=false;
                    objectToSend["data"]="Journals Posted Successfully"
                    res.send(JSON.stringify(objectToSend))
        
                    /* payloads = [
                        { topic: 'sje', messages: sentMsg, partition: 0 }
                    ];
                    producer.send(payloads, function (err1, data1) {
                        if(err1){
                            console.log("Error routes-->adjustment-->instrumnetLe--getDetails->",err1);
                            objectToSend["error"]=true;
                            objectToSend["data"]="Can't post journal at the moment"
                            res.send(JSON.stringify(objectToSend))
                        }else{
                            objectToSend["error"]=false;
                            objectToSend["data"]="Journals Posted Successfully"
                            res.send(JSON.stringify(objectToSend))
                        }
                        
                
                    }); */
        
                    
                    
                }
            });
        }
    });

    
    
});











module.exports=router;