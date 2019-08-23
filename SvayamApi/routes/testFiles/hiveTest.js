var express = require('express');
var router = express.Router();
var conSystemData = require('../../connections/mysqlsystemdata.js');
var conUserData = require('../../connections/mysqlUserData.js');
var conlookup = require('../../connections/mysqlsjelookupcon.js');
var hiveconnection = require('../../connections/hiveconnection.js');
hiveDbCon = hiveconnection.hivecon;
jdbcconnerr = hiveconnection.connerr;
var asyncjs = require('async');




 


router.get('/hiveTest',(req,res)=>{

    var objectToSend={}

    hiveDbCon.reserve(function (err, connObj) {
        if (connObj) {
            
            var conn = connObj.conn;

            var hiveTasks=[]

            hiveTasks.push(function (callback) {
                //InsertProducts
                conn.createStatement(function (err, statement) {
                    if (err) {
                        callback(err);
                    } else {
                        statement.executeQuery("show databases",
                            function (err1, resultset) {
                                if (err1) {
                                    callback(err1);
                                } else {
                                    resultset.toObjArray(function(error,rs){
                                        console.log(rs)
                                        callback(null,rs,true)
                                    })
                                    
                                }
                        });
                    }
                })
            })

            hiveTasks.push(function (callback) {
                //InsertProducts
                conn.createStatement(function (err, statement) {
                    if (err) {
                        callback(err);
                    } else {
                        statement.executeQuery("show databases",
                            function (err1, resultset) {
                                if (err1) {
                                    callback(err1);
                                } else {
                                    resultset.toObjArray(function(error,rs){
                                        console.log(rs)
                                        callback(null,rs,false)
                                    })
                                    
                                }
                        });
                    }
                })
            })
            
            asyncjs.series(hiveTasks, function (err, results) {

                

                if(err==null){
                    console.log(results[0])
                    objectToSend["error"]=false;
                    objectToSend["data"]=results[0];
                    res.send(JSON.stringify(objectToSend))

                    

                    console.log("After return")

                    if(results[1]){
                        hiveDb.release(connObj, function (err) {
                            if (err) {
                                console.log(err.message);
                            } else {
                                console.log("conn released")
                            }
                        })
                    }
                }else{
                    console.log("Error routes-->sources-->admin-->addSrcSystem",err)
                    objectToSend["error"]=true;
                    objectToSend["data"]="Some error occured while fetching data from hive"
                    res.send(JSON.stringify(objectToSend))

                }

                console.log("reached here")
                // Release the connection back to the pool.
                
            });
        }
        
    });

    
})


router.get('/InsertmsqlTest',(req,res)=>{

    var sql="insert into sje_lookup.tests (sal,dna) values('wer','qsa');"
            +"insert into sje_lookup.tests (sal,dna) values('wer1','qsa1'),('wer2','qsa2')"

    conlookup.query(sql,function(error2,results,fields2){
        if(error2){
            console.log(error2)
            res.send("Error")
        }else{
            console.log(results)
            res.send(results)
        }
    });

});




router.get('/InserthiveTest',(req,res)=>{

    var objectToSend={}

    hiveDbCon.reserve(function (err, connObj) {
        if (connObj) {
            
            var conn = connObj.conn;
            
            asyncjs.series([
                function (callback) {
                    //InsertProducts
                    conn.createStatement(function (err, statement) {
                        if (err) {
                            callback(err);
                        } else {
                            statement.executeUpdate("show databases",
                                function (err1, count) {
                                    if (err1) {
                                        callback(err1);
                                    } else {
                                        callback(null,count)
                                        
                                    }
                            });
                        }
                    })
                },
                function (callback) {
                    //Insert Accounts
                    conn.createStatement(function (err, statement) {
                        if (err) {
                            callback(err);
                        } else {
                            statement.executeQuery("show database",
                                function (err1, count1) {
                                    if (err1) {
                                        callback(err1);
                                    } else {
                                        callback(null,count1)
                                        
                                    }
                            });
                        }
                    })
                },
            ], function (err, results) {

                

                if(err==null){
                    

                    
                    hiveDb.release(connObj, function (err) {
                        if (err) {
                            console.log(err.message);
                        } else {
                            console.log("conn released")
                        }
                    })
                    
                }else{
                    console.log("Error routes-->sources-->admin-->addSrcSystem",err)
                    objectToSend["error"]=true;
                    objectToSend["data"]="Can't setup source system right now"
                    res.send(JSON.stringify(objectToSend))

                    return;

                }
                // Release the connection back to the pool.
                
            });
        }
    });
})


module.exports=router;









//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

//////////////
//Request to modify source system
router.post('/modifySrcUpdate', (req, res) => {

    var obj=req.body;

    var objectToSend={};

    if (jdbcconnerr == 1) {
        objectToSend["error"]=true;
        objectToSend["data"]="Some error occured while connecting to hive"
        res.send(JSON.stringify(objectToSend))
    }else{
        var ent_cd=obj.ent_cd;

        

        
        var custPresent=false;
        var accPresent=false;
        var prodPresent=false;
        var eventPresent=false;

        //////////////////Creating sql & hive customer query
        
        
        var hql_lvl3_cd_cust="case "
        var hql_lvl3_desc_cust="case "
        var hql_leaf_cd_cust="case "
        var hql_leaf_desc_cust="case "

        
        var customer=obj.data.customer;

        var sql_ctc="case "
        var sql_ctd="case "
        var sql_dctc="case "
        var sql_dctd="case "
        var sql_cs="case "
        var sql_lret="case "
        var sql_rw="case "

        for(var i=0;i<customer.length;i++){
            custPresent=true;

            var cust=customer[i]

            
            var lvl3_cd=(cust.dtl_customer_type_cd==null)?null:"'"+cust.dtl_customer_type_cd+"'"
            var lvl3_desc=(cust.dtl_customer_type_desc==null)?null:"'"+cust.dtl_customer_type_desc+"'"

            var old_dtl_customer_type_cd=cust.old_dtl_customer_type_cd;

            var cust_id=cust.cust_id;

            var ctc=(cust.customer_type_cd==null)?null:"'"+cust.customer_type_cd+"'"
            var ctd=(cust.customer_type_desc==null)?null:"'"+cust.customer_type_desc+"'"
            var dctc=(cust.dtl_customer_type_cd==null)?null:"'"+cust.dtl_customer_type_cd+"'"
            var dctd=(cust.dtl_customer_type_desc==null)?null:"'"+cust.dtl_customer_type_desc+"'"
            var cs=(cust.cust_segment==null)?null:"'"+cust.cust_segment+"'"
            var lret=(cust.lr_exposure_type==null)?null:"'"+cust.lr_exposure_type+"'"
            var rw=(cust.risk_weight==null)?null:"'"+cust.risk_weight+"'"

            

            if(i==customer.length-1){
                sql_ctc+=" when cust_id='"+cust_id+"' then "+ctc+" else customer_type_cd end"
                sql_ctd+=" when cust_id='"+cust_id+"' then "+ctd+" else customer_type_desc end"
                sql_dctc+=" when cust_id='"+cust_id+"' then "+dctc+" else dtl_customer_type_cd end"
                sql_dctd+=" when cust_id='"+cust_id+"' then "+dctd+" else dtl_customer_type_desc end"
                sql_cs+=" when cust_id='"+cust_id+"' then "+cs+" else cust_segment end"
                sql_lret+=" when cust_id='"+cust_id+"' then "+lret+" else lr_exposure_type end"
                sql_rw+=" when cust_id='"+cust_id+"' then "+rw+" else risk_weight end"
                

                hql_lvl3_cd_cust+=" when leaf_cd='"+old_dtl_customer_type_cd+"' then "+lvl3_cd+" else lvl3_cd end"
                hql_lvl3_desc_cust+=" when leaf_cd='"+old_dtl_customer_type_cd+"' then "+lvl3_desc+" else lvl3_desc end"
                hql_leaf_cd_cust+=" when leaf_cd='"+old_dtl_customer_type_cd+"' then "+lvl3_cd+" else leaf_cd end"
                hql_leaf_desc_cust+=" when leaf_cd='"+old_dtl_customer_type_cd+"' then "+lvl3_desc+" else leaf_desc end"
            }else{
                
                sql_ctc+=" when cust_id='"+cust_id+"' then "+ctc
                sql_ctd+=" when cust_id='"+cust_id+"' then "+ctd
                sql_dctc+=" when cust_id='"+cust_id+"' then "+dctc
                sql_dctd+=" when cust_id='"+cust_id+"' then "+dctd
                sql_cs+=" when cust_id='"+cust_id+"' then "+cs
                sql_lret+=" when cust_id='"+cust_id+"' then "+lret
                sql_rw+=" when cust_id='"+cust_id+"' then "+rw

                hql_lvl3_cd_cust+=" when leaf_cd='"+old_dtl_customer_type_cd+"' then "+lvl3_cd
                hql_lvl3_desc_cust+=" when leaf_cd='"+old_dtl_customer_type_cd+"' then "+lvl3_desc
                hql_leaf_cd_cust+=" when leaf_cd='"+old_dtl_customer_type_cd+"' then "+lvl3_cd
                hql_leaf_desc_cust+=" when leaf_cd='"+old_dtl_customer_type_cd+"' then "+lvl3_desc
            }

            
            
            
        }



        //////////////////Creating sql & hive product query



   
        var hql_lvl3_cd_prod="case "
        var hql_lvl3_desc_prod="case "
        var hql_leaf_cd_prod="case "
        var hql_leaf_desc_prod="case "

        var products=obj.data.products;

        var sql_pc="case "
        var sql_pd="case "
        var sql_dpc="case "
        var sql_dpd="case "
        var sql_obet="case "
        var sql_ccf="case "
        
        

        for(var i=0;i<products.length;i++){
            prodPresent=true;

            var prod=products[i]

            
            var lvl3_cd=(prod.dtl_prod_cd==null)?null:"'"+prod.dtl_prod_cd+"'"
            var lvl3_desc=(prod.dtl_prod_desc==null)?null:"'"+prod.dtl_prod_desc+"'"

            var old_dtl_prod_cd=prod.old_dtl_prod_cd;

            var prod_id=prod.prod_id;

            var pc=(prod.prod_cd==null)?null:"'"+prod.prod_cd+"'"
            var pd=(prod.prod_desc==null)?null:"'"+prod.prod_desc+"'"
            var dpc=(prod.dtl_prod_cd==null)?null:"'"+prod.dtl_prod_cd+"'"
            var dpd=(prod.dtl_prod_desc==null)?null:"'"+prod.dtl_prod_desc+"'"
            var obet=(prod.off_balance_sheet_exposure_type==null)?null:"'"+prod.off_balance_sheet_exposure_type+"'"
            var ccf=(prod.credit_conversion_factor==null)?null:"'"+prod.credit_conversion_factor+"'"
            

            if(i==products.length-1){

                sql_pc+=" when prod_id='"+prod_id+"' then "+pc+" else prod_cd end"
                sql_pd+=" when prod_id='"+prod_id+"' then "+pd+" else prod_desc end"
                sql_dpc+=" when prod_id='"+prod_id+"' then "+dpc+" else dtl_prod_cd end"
                sql_dpd+=" when prod_id='"+prod_id+"' then "+dpd+" else dtl_prod_desc end"
                sql_obet+=" when prod_id='"+prod_id+"' then "+obet+" else off_balance_sheet_exposure_type end"
                sql_ccf+=" when prod_id='"+prod_id+"' then "+ccf+" else credit_conversion_factor end"
                
                hql_lvl3_cd_prod+=" when leaf_cd='"+old_dtl_prod_cd+"' then "+lvl3_cd+" else lvl3_cd end"
                hql_lvl3_desc_prod+=" when leaf_cd='"+old_dtl_prod_cd+"' then "+lvl3_desc+" else lvl3_desc end"
                hql_leaf_cd_prod+=" when leaf_cd='"+old_dtl_prod_cd+"' then "+lvl3_cd+" else leaf_cd end"
                hql_leaf_desc_prod+=" when leaf_cd='"+old_dtl_prod_cd+"' then "+lvl3_desc+" else leaf_desc end"
            }else{
                
                sql_pc+=" when prod_id='"+prod_id+"' then "+pc
                sql_pd+=" when prod_id='"+prod_id+"' then "+pd
                sql_dpc+=" when prod_id='"+prod_id+"' then "+dpc
                sql_dpd+=" when prod_id='"+prod_id+"' then "+dpd
                sql_obet+=" when prod_id='"+prod_id+"' then "+obet
                sql_ccf+=" when prod_id='"+prod_id+"' then "+ccf

                hql_lvl3_cd_prod+=" when leaf_cd='"+old_dtl_prod_cd+"' then "+lvl3_cd
                hql_lvl3_desc_prod+=" when leaf_cd='"+old_dtl_prod_cd+"' then "+lvl3_desc
                hql_leaf_cd_prod+=" when leaf_cd='"+old_dtl_prod_cd+"' then "+lvl3_cd
                hql_leaf_desc_prod+=" when leaf_cd='"+old_dtl_prod_cd+"' then "+lvl3_desc
            }

            
            
            
        }



        //////////////////Creating sql & hive account query

        
        var hql_lvl4_cd_acc="case "
        var hql_lvl4_desc_acc="case "
        var hql_leaf_cd_acc="case "
        var hql_leaf_desc_acc="case "

        var accounts=obj.data.products;

        var sql_an="case "
        var sql_ad="case "
        var sql_at="case "
        var sql_atc="case "
        var sql_roi="case "
        var sql_onba="case "
        var sql_offba="case "
        var sql_agc="case "
        var sql_pai="case "
        var sql_tbi="case "
        var sql_bi="case "
        var sql_isi="case "
        var sql_mi="case "
        var sql_cfi="case "
        var sql_lsc="case "
        var sql_acc_lret="case "

        var sql_rcls_an="case "
        

        for(var i=0;i<accounts.length;i++){
            accPresent=true;

            var acct=accounts[i]

            
            var lvl4_cd=(acct.account_number==null)?null:"'"+acct.account_number+"'"
            var lvl4_desc=(acct.acct_desc==null)?null:"'"+acct.acct_desc+"'"

            var old_acct_num=acct.old_account_number;
            
            var acc_id=acct.acc_id;

            var an=(acct.account_number==null)?null:"'"+acct.account_number+"'"
            var ad=(acct.acct_desc==null)?null:"'"+acct.acct_desc+"'"
            var at=(acct.acct_type==null)?null:"'"+acct.acct_type+"'"
            var atc=(acct.account_type_cd==null)?null:"'"+acct.account_type_cd+"'"
            var roi=(acct.rwa_off_ind==null)?null:"'"+acct.rwa_off_ind+"'"
            var onba=(acct.on_balancesheet_account==null)?null:"'"+acct.on_balancesheet_account+"'"
            var offba=(acct.off_balancesheet_account==null)?null:"'"+acct.off_balancesheet_account+"'"
            var agc=(acct.account_grp_cd==null)?null:"'"+acct.account_grp_cd+"'"
            var pai=(acct.perfm_account_ind==null)?null:"'"+acct.perfm_account_ind+"'"
            var tbi=(acct.trl_bal_ind==null)?null:"'"+acct.trl_bal_ind+"'"
            var bi=(acct.bsht_ind==null)?null:"'"+acct.bsht_ind+"'"
            var isi=(acct.incm_stmt_ind==null)?null:"'"+acct.incm_stmt_ind+"'"
            var mi=(acct.memo_ind==null)?null:"'"+acct.memo_ind+"'"
            var cfi=(acct.carry_fwd_ind==null)?null:"'"+acct.carry_fwd_ind+"'"
            var lsc=(acct.lr_sub_cat==null)?null:"'"+acct.lr_sub_cat+"'"
            var lret_acc=(acct.lr_exposure_type==null)?null:"'"+acct.lr_exposure_type+"'"

            

            if(i==products.length-1){

                sql_rcls_an+=" when account_number='"+old_acct_num+"' then "+an+" else account_number end"

                sql_an+=" when acc_id='"+acc_id+"' then "+an+" else account_number end"
                sql_ad+=" when acc_id='"+acc_id+"' then "+ad+" else acct_desc end"
                sql_at+=" when acc_id='"+acc_id+"' then "+at+" else acct_type end"
                sql_atc+=" when acc_id='"+acc_id+"' then "+atc+" else acct_type_cd end"
                sql_roi+=" when acc_id='"+acc_id+"' then "+roi+" else rwa_off_ind end"
                sql_onba+=" when acc_id='"+acc_id+"' then "+onba+" else on_balancesheet_account end"
                sql_offba+=" when acc_id='"+acc_id+"' then "+offba+" else off_balancesheet_account end"
                sql_agc+=" when acc_id='"+acc_id+"' then "+agc+" else account_grp_cd end"
                sql_pai+=" when acc_id='"+acc_id+"' then "+pai+" else perfm_account_ind end"
                sql_tbi+=" when acc_id='"+acc_id+"' then "+tbi+" else trl_bal_ind end"
                sql_bi+=" when acc_id='"+acc_id+"' then "+bi+" else bsht_ind end"
                sql_isi+=" when acc_id='"+acc_id+"' then "+isi+" else incm_stmt_ind end"
                sql_mi+=" when acc_id='"+acc_id+"' then "+mi+" else memo_ind end"
                sql_cfi+=" when acc_id='"+acc_id+"' then "+cfi+" else carry_fwd_ind end"
                sql_lsc+=" when acc_id='"+acc_id+"' then "+lsc+" else lr_sub_cat end"
                sql_acc_lret+=" when acc_id='"+acc_id+"' then "+lret_acc+" else lr_exposure_type end"


                
                hql_lvl4_cd_acc+=" when leaf_cd='"+old_acct_num+"' then "+lvl4_cd+" else lvl4_cd end"
                hql_lvl4_desc_acc+=" when leaf_cd='"+old_acct_num+"' then "+lvl4_desc+" else lvl4_desc end"
                hql_leaf_cd_acc+=" when leaf_cd='"+old_acct_num+"' then "+lvl4_cd+" else leaf_cd end"
                hql_leaf_desc_acc+=" when leaf_cd='"+old_acct_num+"' then "+lvl4_desc+" else leaf_desc end"
            }else{

                sql_rcls_an+=" when account_number='"+old_acct_num+"' then "+an
                
                sql_an+=" when acc_id='"+acc_id+"' then "+an
                sql_ad+=" when acc_id='"+acc_id+"' then "+ad
                sql_at+=" when acc_id='"+acc_id+"' then "+at
                sql_atc+=" when acc_id='"+acc_id+"' then "+atc
                sql_roi+=" when acc_id='"+acc_id+"' then "+roi
                sql_onba+=" when acc_id='"+acc_id+"' then "+onba
                sql_offba+=" when acc_id='"+acc_id+"' then "+offba
                sql_agc+=" when acc_id='"+acc_id+"' then "+agc
                sql_pai+=" when acc_id='"+acc_id+"' then "+pai
                sql_tbi+=" when acc_id='"+acc_id+"' then "+tbi
                sql_bi+=" when acc_id='"+acc_id+"' then "+bi
                sql_isi+=" when acc_id='"+acc_id+"' then "+isi
                sql_mi+=" when acc_id='"+acc_id+"' then "+mi
                sql_cfi+=" when acc_id='"+acc_id+"' then "+cfi
                sql_lsc+=" when acc_id='"+acc_id+"' then "+lsc
                sql_acc_lret+=" when acc_id='"+acc_id+"' then "+lret_acc


                hql_lvl4_cd_acc+=" when leaf_cd='"+old_acct_num+"' then "+lvl4_cd
                hql_lvl4_desc_acc+=" when leaf_cd='"+old_acct_num+"' then "+lvl4_desc
                hql_leaf_cd_acc+=" when leaf_cd='"+old_acct_num+"' then "+lvl4_cd
                hql_leaf_desc_acc+=" when leaf_cd='"+old_acct_num+"' then "+lvl4_desc
            }

            
            
            
        }


        ////////////////Create sql event update query

        var events=obj.data.events;

        var sql_en="case "
        var sql_stp="case "
        var sql_pi="case "
        

        for(var i=0;i<events.length;i++){
            eventPresent=true;

            var evnt=events[i]


            var ev_id=evnt.ev_id;

            var en=(evnt.ev_name==null)?null:"'"+evnt.ev_name+"'"
            var stp=(evnt.screen_to_project==null)?null:"'"+evnt.screen_to_project+"'"
            var evpi=(evnt.prod_id==null)?null:"'"+evnt.prod_id+"'"
            

            

            if(i==events.length-1){
                sql_en+=" when ev_id='"+ev_id+"' then "+en+" else ev_name end"
                sql_stp+=" when ev_id='"+ev_id+"' then "+stp+" else screen_to_project end"
                sql_pi+=" when ev_id='"+ev_id+"' then "+evpi+" else prod_id end"
                
                
            }else{
                
                sql_en+=" when ev_id='"+ev_id+"' then "+en+" else ev_name end"
                sql_stp+=" when ev_id='"+ev_id+"' then "+stp+" else screen_to_project end"
                sql_pi+=" when ev_id='"+ev_id+"' then "+evpi+" else prod_id end"

                
            }

            
            
            
        }

        var hiveProdUpdate="update ref_product set";
        var hiveAccUpdate="update ref_chart_of_acc set";
        var hiveCustUpdate="update ref_customer_type set ";

        var sqlProdUpdate="update products set"
        var sqlAccUpdate="update accounts set"
        var sqlCustUpdate="update customer set"
        var sqlRclsAccUpdate="update account_reclass set"
        var sqlEventUpdate="update events set";

        var sqlUpdateQuery="";

        if(prodPresent){
            hiveProdUpdate+=" lvl3_cd="+hql_lvl3_cd_prod+", lvl3_desc="+hql_lvl3_desc_prod+", leaf_cd="+hql_leaf_cd_prod+", "
                        +" leaf_desc="+hql_leaf_desc_prod +" where ent_cd='"+ent_cd+"'"

            sqlProdUpdate+="prod_cd="+sql_pc+", prod_desc="+sql_pd+", dtl_prod_desc="+sql_dpd+", dtl_prod_cd="+sql_dpc+", "
                            +" off_balance_sheet_exposure_type="+sql_obet+", credit_conversion_factor="+sql_ccf+" where ent_cd='"+ent_cd+"'"

            sqlUpdateQuery+=sqlProdUpdate+";"
        }

        if(custPresent){
            hiveCustUpdate+=" lvl3_cd="+hql_lvl3_cd_cust+", lvl3_desc="+hql_lvl3_desc_cust+", leaf_cd="+hql_leaf_cd_cust+", "
                        +" leaf_desc="+hql_leaf_desc_cust +" where ent_cd='"+ent_cd+"'"

            sqlCustUpdate+=" customer_type_cd="+sql_ctc+", customer_type_desc="+sql_ctd+", dtl_customer_type_cd="+sql_dctc+", "
                        +" dtl_customer_type_desc="+sql_dctd+", cust_segment="+sql_cs+", lr_exposure_type="+sql_lret+", "
                        +" risk_weight="+sql_rw+" where ent_cd='"+ent_cd+"'"

            sqlUpdateQuery+=sqlCustUpdate+";"
        }

        if(accPresent){
            hiveAccUpdate+=" lvl4_cd="+hql_lvl4_cd_acc+", lvl4_desc="+hql_lvl4_desc_acc+", leaf_cd="+hql_leaf_cd_acc+", "
                        +" leaf_desc="+hql_leaf_desc_acc +" where ent_cd='"+ent_cd+"'"

            sqlAccUpdate+=" account_number="+sql_an+", acct_type="+sql_at+", account_type_cd="+sql_atc+", acct_desc="+sql_ad+", "
                        +" rwa_off_ind="+sql_roi+", on_balancesheet_account="+sql_onba+", off_balancesheet_account="+sql_offba+", "
                        +" account_grp_cd="+sql_agc+", perfm_account_ind="+sql_pai+", trl_bal_ind="+sql_tbi+", bsht_ind="+sql_bi+", "
                        +" incm_stmt_ind="+sql_isi+", memo_ind="+sql_mi+", carry_fwd_ind="+sql_cfi+", lr_sub_cat="+sql_lsc+", "
                        +" lr_exposure_type="+sql_acc_lret+" where ent_cd='"+ent_cd+"'";

            sqlRclsAccUpdate+="account_number="+sql_rcls_an+" where ent_cd='"+ent_cd+"'"

            sqlUpdateQuery+=sqlAccUpdate+";"
        }

        if(eventPresent){
            sqlEventUpdate+=" ev_name="+sql_en+", screen_to_project="+sql_stp+", prod_id="+sql_pi+" where ent_cd='"+ent_cd+"'"

            sqlUpdateQuery+=sqlEventUpdate+";"
        }


        



    }
    
});




//////////////
//Request to delete few components of source system
router.post('/modifySrcDelete', (req, res) => {

    var obj=req.body;

    var objectToSend={};

    if (jdbcconnerr == 1) {
        objectToSend["error"]=true;
        objectToSend["data"]="Some error occured while connecting to hive"
        res.send(JSON.stringify(objectToSend))
    }else{

        try{

        
            var customers=obj.data.customers;
            var products=obj.data.products;
            var accounts=obj.data.accounts;
            var events=obj.data.events;

            var ent_cd=obj.ent_cd;

            var hiveProdDelete="delete from ref_product where leaf_cd in"
            var hiveAccDelete="delete from ref_chart_of_acc where leaf_cd in"
            var hiveCustDelete="delete from ref_customer_type where leaf_cd in"
            
            var sqlProdDelete="delete from products where prod_id in"
            var sqlAccDelete="delete from accounts where acc_id in"
            var sqlCustDelete="delete from customer where cust_id in"
            var sqlEventDelete="delete from events where ev_id in"
            var sqlRclsActDelete="delete from account_reclass where account_number in"

            var prod_id="'undefined'";
            var acc_id="'undefined'";
            var ev_id="'undefined'";
            var cust_id="'undefined'";

            var acc_num="'undefined'";
            var dpc="'undefined'";
            var dctc="'undefined'";

            var prodPresent=false;
            var accPresent=false;
            var eventPresent=false;
            var custPresent=false;

            for(var i=0;i<customers.length;i++){
                custPresent=true;
                cust_id+=",'"+customers[i].cust_id+"'"
                dctc+=",'"+customers[i].dtl_customer_type_cd+"'"
            }for(var i=0;i<accounts.length;i++){
                accPresent=true;
                acc_id+=",'"+accounts[i].acc_id+"'"
                acc_num+=",'"+accounts[i].account_number+"'"
            }for(var i=0;i<products.length;i++){
                prodPresent=true;
                prod_id+=",'"+products[i].prod_id+"'"
                dpc+=",'"+products[i].dtl_prod_cd+"'"
            }for(var i=0;i<events.length;i++){
                eventPresent=true;
                ev_id+=",'"+events[i].ev_id+"'"
            }

            var mainSql="";

            if(prodPresent){
                sqlProdDelete+=" ("+prod_id+") and ent_cd='"+ent_cd+"'"
                mainSql+=sqlProdDelete+";"

                hiveProdDelete+=" ("+dpc+") and org_unit_cd='"+ent_cd+"'"
            }
            if(custPresent){
                sqlCustDelete+=" ("+cust_id+") and ent_cd='"+ent_cd+"'"
                mainSql+=sqlCustDelete+";"

                hiveCustDelete+=" ("+dctc+") and org_unit_cd ='"+ent_cd+"'"
            }
            if(accPresent){
                sqlAccDelete+=" ("+acc_id+") and ent_cd='"+ent_cd+"'"
                mainSql+=sqlAccDelete+";"

                hiveAccDelete+=" ("+acc_num+") and org_unit_cd='"+ent_cd+"'"
            }
            if(eventPresent){
                sqlEventDelete+=" ("+ev_id+") and ent_cd='"+ent_cd+"'"
                mainSql+=sqlProdDelete+";"
            }
        }catch(ex){
            
        }

    }
});




