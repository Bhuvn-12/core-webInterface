var express = require('express');
var router = express.Router();
var conSystemData = require('../../connections/mysqlsystemdata.js');
var conUserData = require('../../connections/mysqlUserData.js');
var multer = require('multer');
const fs=require('fs');
var asyncjs = require('async');
var hiveconnection = require('../../connections/hiveconnection.js');
hiveDbCon = hiveconnection.hivecon;
jdbcconnerr = hiveconnection.connerr;
var producer = require('../../connections/kafkaconnection.js');




//////////////
//Request to show source system
router.get('/getSrcSystem:dtls', (req, res) => {

    var objectToSend={};

    var entCd=req.params.dtls;

   

    var sqlQuery = "Select * from source_system where ent_cd='"+entCd+"'";
    conUserData.query(sqlQuery, function (error, results, fields) {
        if (error) {
            console.log("Error routes-->sources-->admin-->getSrcSystem",error);
            objectToSend["error"]=true;
            objectToSend["data"]="Some error while fetching source system data"
            res.end(JSON.stringify(objectToSend))
        }
        else {
            objectToSend["error"]=false;
            objectToSend["data"]=results
            res.send(JSON.stringify(objectToSend))
        }
    });
})




//////////////////////////////////////                    //////////////////////////////////////////   
//////////////////////////////////////ADD SRC SYSTEM REQUESTS///////////////////////////////////////




//////////////
//Request to show source systems of particular industry
router.get('/getIndustrySrcSystem:dtls', (req, res) => {
var obj=JSON.parse(req.params.dtls);
var ind_id=obj.ind_id;
var ent_cd=obj.ent_cd;


var objectToSend={};


var sqlQuery = "Select * from source_system where ind_id='"+ind_id+"'and ss_name not in (select ss_name from user_data.source_system where ent_cd='"+ent_cd+"')";


   /* var ind_id=req.params.dtls;

    

    var objectToSend={};

    
    

    var sqlQuery = "Select * from source_system where ind_id='"+ind_id+"'";

    console.log("getting src for industry--",sqlQuery)*/

    conSystemData.query(sqlQuery, function (error, results, fields) {
        if (error) {
            console.log("Error routes-->sources-->admin-->getIndustrySrcSystem",error);
            objectToSend["error"]=true;
            objectToSend["data"]="Some error while fetching source systems"
            res.end(JSON.stringify(objectToSend))
        }
        else {
            objectToSend["error"]=false;
            objectToSend["data"]=results
            res.send(JSON.stringify(objectToSend))
        }
    });
})


//////////////
//Request to show products of selected source system
router.get('/getProducts:dtls', (req, res) => {

    
    
    var value=JSON.parse(req.params.dtls);

    var objectToSend={};

    var ss_id="";

    for(var i=0;i<value.length;i++){

        if(i==value.length-1){
            ss_id+="'"+value[i].ss_id+"'";
        }else{
            ss_id+="'"+value[i].ss_id+"',";
        }
    }

    console.log("getting products",ss_id)

    if(ss_id==""){
        objectToSend["error"]=false;
        objectToSend["data"]=results
        res.send(JSON.stringify(objectToSend))
    }else{
        var sqlQuery = "Select * from products where ss_id in ("+ss_id+")";
        conSystemData.query(sqlQuery, function (error, results, fields) {
            if (error) {
                console.log("Error routes-->sources-->admin-->getProducts",error);
                objectToSend["error"]=true;
                objectToSend["data"]="Some error while fetching products"
                res.end(JSON.stringify(objectToSend))
            }
            else {
                objectToSend["error"]=false;
                objectToSend["data"]=results
                res.send(JSON.stringify(objectToSend))
            }
        });
    }
    


    
})


//////////////
//Request to show events of selected products
router.get('/getEvents:dtls', (req, res) => {

    var objectToSend={};

    var value=JSON.parse(req.params.dtls);

    
    var prod_id="";

    for(var i=0;i<value.length;i++){

        if(i==value.length-1){
            prod_id+="'"+value[i].prod_id+"'";
        }else{
            prod_id+="'"+value[i].prod_id+"',";
        }
    }

    console.log("getting events",prod_id)

    if(prod_id==""){
        objectToSend["error"]=false;
        objectToSend["data"]=[]
        res.send(JSON.stringify(objectToSend))
    }else{
        var sqlQuery = "Select * from events where prod_id in ("+prod_id+")";
        conSystemData.query(sqlQuery, function (error, results, fields) {
            if (error) {
                console.log("Error routes-->sources-->admin-->getEvents",error);
                objectToSend["error"]=true;
                objectToSend["data"]="Some error while fetching events"
                res.end(JSON.stringify(objectToSend))
            }
            else {
                objectToSend["error"]=false;
                objectToSend["data"]=results
                res.send(JSON.stringify(objectToSend))
            }
        });
    }


    
})


//////////////
//Request to show all customers
router.get('/getAllCustomers', (req, res) => {

    var objectToSend={};

    var sqlQuery = "Select * from customer";
    conSystemData.query(sqlQuery, function (error1, results1, fields) {
        if(error1){
            console.log("Error routes-->sources-->admin-->getAllCustomers",error1);
            objectToSend["error"]=true;
            objectToSend["data"]="Some error while fetching customers"
            res.end(JSON.stringify(objectToSend))
        }else{
            objectToSend["error"]=false;
            
            objectToSend["data"]=results1;
            res.send(JSON.stringify(objectToSend))
        }
    });
});

//////////////
//Request to show specific customers
router.get('/getCustomers:dtls', (req, res) => {

    var ent_cd=req.params.dtls;
    var objectToSend={};

    var data={};

    var sql_getCustomers="Select * from customer where ent_cd='"+ent_cd+"'";

    conUserData.query(sql_getCustomers, function (error, results, fields) {
        if(error){
            console.log("Error routes-->sources-->admin-->getCustomers",error);
            objectToSend["error"]=true;
            objectToSend["data"]="Some error while fetching customers"
            res.end(JSON.stringify(objectToSend))
        }else if(results.length<1){
            data["allotted"]=[]
            var sqlQuery = "Select * from customer";
            conSystemData.query(sqlQuery, function (error1, results1, fields) {
                if(error1){
                    console.log("Error routes-->sources-->admin-->getCustomers",error1);
                    objectToSend["error"]=true;
                    objectToSend["data"]="Some error while fetching customers"
                    res.end(JSON.stringify(objectToSend))
                }else{
                    objectToSend["error"]=false;
                    data["unallotted"]=results1;
                    objectToSend["data"]=data;
                    res.send(JSON.stringify(objectToSend))
                }
            });
        }else{
            var dctc="";

            for(var i=0;i<results.length;i++){
                if(i==results.length-1){
                    dctc+="'"+results[i].dtl_customer_type_cd+"'";

                }else{
                    dctc+="'"+results[i].dtl_customer_type_cd+"',";
                }
            }

            data["allotted"]=results;

            var sql_cust="Select * from customer where dtl_customer_type_cd not in ("+dctc+")";

            conSystemData.query(sql_cust, function (error1, results1, fields) {
                if(error1){
                    console.log("Error routes-->sources-->admin-->getCustomers",error1);
                    objectToSend["error"]=true;
                    objectToSend["data"]="Some error while fetching customers"
                    res.end(JSON.stringify(objectToSend))
                }else{
                    data["unallotted"]=results1;
                    objectToSend["error"]=false;
                    objectToSend["data"]=data;
                    res.send(JSON.stringify(objectToSend))
                }
            });
        }
    });

    //////////

   
})



//////////////
//Request to show accounts of selected events
router.get('/getAccounts:dtls', (req, res) => {

    var objectToSend={};

    var value=JSON.parse(req.params.dtls);

    var ev_id="";

    for(var i=0;i<value.length;i++){

        if(i==value.length-1){
            ev_id+="'"+value[i].ev_id+"'";
        }else{
            ev_id+="'"+value[i].ev_id+"',";
        }
    }

    console.log("getting accounts",ev_id)

    if(ev_id==""){
        objectToSend["error"]=false;
        objectToSend["data"]=[]
        res.send(JSON.stringify(objectToSend))
    }else{
        var sqlQuery = "Select  * from accounts where ev_id in ("+ev_id+") ";
        conSystemData.query(sqlQuery, function (error, results, fields) {
            if (error) {
                console.log("Error routes-->sources-->admin-->getAccounts",error);
                objectToSend["error"]=true;
                objectToSend["data"]="Some error while fetching accounts"
                res.end(JSON.stringify(objectToSend))
            }
            else {
                objectToSend["error"]=false;
                objectToSend["data"]=results
                res.send(JSON.stringify(objectToSend))
            }
        });
    }

    
})

//////////////
//Request to show all accounts of selected events
router.get('/getAllAccounts:dtls', (req, res) => {

    var objectToSend={};

    var value=JSON.parse(req.params.dtls);

    

    

    
        var sqlQuery = "Select  * from accounts where ent_cd in ('"+value[0].ent_cd+"') group by account_number ";
        conUserData.query(sqlQuery, function (error, results, fields) {
            if (error) {
                console.log("Error routes-->sources-->admin-->getAllAccounts",error);
                objectToSend["error"]=true;
                objectToSend["data"]="Some error while fetching accounts"
                res.end(JSON.stringify(objectToSend))
            }
            else {
                objectToSend["error"]=false;
                objectToSend["data"]=results
                res.send(JSON.stringify(objectToSend))
            }
        });
    

    
})






//////////////
//Request to set up all information of new source system
router.post('/addSrcSystem', async (req, res) => {
    var obj=req.body.data;
    var objectToSend={};

    if (jdbcconnerr == 1) {
        objectToSend["error"]=true;
        objectToSend["data"]="Some error occured while connecting to hive"
        res.send(JSON.stringify(objectToSend))
    }else{
        var cust=req.body.customer;

        var ent_cd=req.body.ent_cd;
    
        
    
        
        var current_ev_itr=0;
    
        var itr_required=0;
    
        var sources=[]
        var products=[]
        var events=[]
        var accounts=[]
        
        /////////////////////////////////
        /////////////////////////////////
    
        var hiveProdQuery="insert into ref_product (id,leaf_col_id,hierarchy_id,hierarchy_name,leaf_cd,leaf_desc,"
                            +"lvl2_cd,lvl2_desc,lvl3_cd,lvl3_desc,org_unit_cd)  values"
        var hiveCustQuery="insert into ref_customer_type (id,leaf_col_id,hierarchy_id,hierarchy_name,leaf_cd,leaf_desc,"
                            +"lvl2_cd,lvl2_desc,lvl3_cd,lvl3_desc,org_unit_cd)  values"
        var hiveAccQuery="insert into ref_chart_of_acc (id,leaf_col_id,hierarchy_id,hierarchy_name,leaf_cd,leaf_desc,lvl1_cd,lvl1_desc,"
                            +"lvl2_cd,lvl2_desc,lvl3_cd,lvl3_desc,lvl4_cd,lvl4_desc,org_unit_cd) values"
    
        var sql_insertCustomer="insert into customer (ent_cd,customer_type_cd,customer_type_desc,dtl_customer_type_cd,dtl_customer_type_desc,cust_segment,lr_exposure_type,risk_weight) values"
                
    

        var prodPresent=false;
        
        var accPresent=false;

        var custPresent=false;
    
        var uniqueAccs={};
    
        
        for(var a=0;a<obj.length;a++){
            var p=obj[a].products;

            sources.push(obj[a])
            
            for(var t=0;t<p.length;t++){
                itr_required+=p[t].events.length;
    
                var postData=p[t];
                prodPresent=true

                products.push(p[t])
    
                
                hiveProdQuery += "('" + postData.id + "','Detail Product Code','PRDCT-001','Product_Hierarchy','" +
                                    postData.dtl_prod_cd + "','" + postData.dtl_prod_desc + "','" +
                                    postData.prod_cd + "','" + postData.prod_desc + "','" + postData.dtl_prod_cd + "','" +
                                    postData.dtl_prod_desc + "','" + ent_cd + "'),"
                
                
    
                var evt=postData.events;
    
                for(var t1=0;t1<evt.length;t1++){
                    var ac=evt[t1].accounts;

                    events.push(evt[t1])
    
                    for(var t2=0;t2<ac.length;t2++){
                        accPresent=true;

                        accounts.push(ac[t2])
                        if(uniqueAccs[ac[t2].account_number]==undefined){
                            uniqueAccs[ac[t2].account_number]=ac[t2]
    
                            
                        }
                        
                    }
                }
            }
    
        }

        

        

        var curUniqueAcc=Object.keys(uniqueAccs)

        var currAccs="'undefined'";

        for(var c1=0;c1<curUniqueAcc.length;c1++){
            /* if(c1==curUniqueAcc.length-1){
                currAccs+=curUniqueAcc[c1]
            }else{
                currAccs+=curUniqueAcc[c1]+","
            } */
            currAccs+=","+curUniqueAcc[c1]
        }

        var sql_getHiveEligibleAccs="Select account_number from (Select * from accounts where ent_cd='"+ent_cd+"' group by account_number)t "
                                       +" where account_number in"
                                       +" ("+currAccs+")";

        conUserData.query(sql_getHiveEligibleAccs, function (errAc, resultsAc, fieldsAc) {
            if (errAc) {
                console.log("Error routes-->sources-->manual-->getSrcSystem",errAc);
                objectToSend["error"]=true;
                objectToSend["data"]="Can't setup source system right now. Please try again later."
                res.send(JSON.stringify(objectToSend))
            }
            else {

                for(var c2=0;c2<resultsAc.length;c2++){
                    delete uniqueAccs[resultsAc[c2].account_number]
                }

                var accsForHive=Object.keys(uniqueAccs);

                if(accsForHive.length==0){
                    accPresent=false;
                }

                for(var c3=0;c3<accsForHive.length;c3++){
                    postData1=uniqueAccs[accsForHive[c3]];

                    
    
                    var lvl2_cd=null;
                    var lvl2_desc=null;
                    var lvl3_cd=null;
                    var lvl3_desc=postData1.acct_type;

                    if(postData1.acct_type=='ASSET'||postData1.acct_type=='EQUITY'||postData1.acct_type=='LIABILITY'){
                        lvl2_cd='L2-001'
                        lvl2_desc='Balance Sheet'
                    }else if(postData1.acct_type=='EXPENSE'||postData1.acct_type=='INCOME'){
                        lvl2_cd='L2-002'
                        lvl2_desc='Income Statement'
                    }

                    if(postData1.acct_type=='ASSET'){
                        lvl3_cd='L3A-001'
                    }else if(postData1.acct_type=='EQUITY'){
                        lvl3_cd='L3A-003'
                    }else if(postData1.acct_type=='LIABILITY'){
                        lvl3_cd='L3A-002'
                    }else if(postData1.acct_type=='INCOME'){
                        lvl3_cd='L3B-001'
                    }else if(postData1.acct_type=='EXPENSE'){
                        lvl3_cd='L3B-002'
                    }

                    lvl2_cd=(lvl2_cd==null)?null:"'"+lvl2_cd+"'"
                    lvl2_desc=(lvl2_desc==null)?null:"'"+lvl2_desc+"'"
                    lvl3_cd=(lvl3_cd==null)?null:"'"+lvl3_cd+"'"
                    
                    hiveAccQuery += "('" + postData1.id + "','" + (t2+t1) + "','ACC-001','Chart_of_Account-Hierarchy','"
                                        + postData1.account_number + "','" + postData1.acct_desc + "','L1A-001','Trial Balance'," + 
                                        lvl2_cd + "," + lvl2_desc + "," + lvl3_cd + ",'" + 
                                        lvl3_desc + "','" + postData1.account_number + "','" + postData1.acct_desc + "','" + 
                                        ent_cd + "'),"
                
                }

                ///////////////////
                /////////////////////


                for(var c0=0;c0<cust.length;c0++){
                    custPresent=true;
                    var ctc=cust[c0].customer_type_cd;
                    var ctd=cust[c0].customer_type_desc;
                    var dctc=cust[c0].dtl_customer_type_cd;
                    var dctd=cust[c0].dtl_customer_type_desc;
                    var cs=cust[c0].cust_segment;
                    var lret=cust[c0].lr_exposure_type;
                    var rw=cust[c0].risk_weight;
        
                    var postData2=cust[c0];
                    if(c0==cust.length-1){
                        sql_insertCustomer+=" ('"+ent_cd+"','"+ctc+"','"+ctd+"','"+dctc+"','"+dctd+"','"+cs+"','"+lret+"','"+rw+"')"
                                
                        hiveCustQuery += "('" + postData2.ip_cust_id + "','Detail Customer Type Code','" + postData2.hierarchy_id +
                                     "','Customer-Type-Hierarchy','" + dctc + "','" + dctd +
                                      "','" + ctc + "','" + ctd +
                                       "','" + dctc + "','" + dctd + "','" + ent_cd + "')"
                    
                    }else{
                        sql_insertCustomer+=" ('"+ent_cd+"','"+ctc+"','"+ctd+"','"+dctc+"','"+dctd+"','"+cs+"','"+lret+"','"+rw+"'),"
                                
                        hiveCustQuery += "('" + postData2.ip_cust_id + "','Detail Customer Type Code','" + postData2.hierarchy_id +
                                     "','Customer-Type-Hierarchy','" + dctc + "','" + dctd +
                                      "','" + ctc + "','" + ctd +
                                       "','" + dctc + "','" + dctd + "','" + ent_cd + "'),"
                    }
                }
            
                
        
                try{
                    hiveDbCon.reserve(function (err, connObj) {
                        if (connObj) {
        
                            var conn = connObj.conn;
        
                            var hiveTasks=[];
        
                            if(prodPresent){
                                hiveProdQuery=hiveProdQuery.substring(0,hiveProdQuery.length-1);
                                hiveTasks.push(function (callback) {
                                    //InsertProducts
                                    conn.createStatement(function (err, statement) {
                                        if (err) {
                                            callback(err);
                                        } else {
                                            statement.executeUpdate(hiveProdQuery,
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
                            }
                            if(custPresent){
                                hiveTasks.push(function (callback) {
                                    //InsertCustomer
                                    conn.createStatement(function (err, statement) {
                                        if (err) {
                                            callback(err);
                                        } else {
                                            statement.executeUpdate(hiveCustQuery,
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
                            }
                            if(accPresent){
                                hiveAccQuery=hiveAccQuery.substring(0,hiveAccQuery.length-1);
                                hiveTasks.push(function (callback) {
                                    //InsertAccounts
                                    conn.createStatement(function (err, statement) {
                                        if (err) {
                                            callback(err);
                                        } else {
                                            statement.executeUpdate(hiveAccQuery,
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
        
                            }
        
                            asyncjs.series(hiveTasks, function (err, results) {
                                console.log("hive callback-->",results);
        
                                if(err!=null){
                                    console.log("Error routes-->sources-->admin-->addSrcSystem",err)
                                    objectToSend["error"]=true;
                                    objectToSend["data"]="Can't setup source system right now. Please try again later."
                                    res.send(JSON.stringify(objectToSend))
        
                                }else{
                                    if(!custPresent){
            
                                        insertSrcDataInMysql(sources,products,events,accounts,ent_cd,uniqueAccs,function(response){
                                            if(response==1){
                                                objectToSend["error"]=true;
                                                objectToSend["data"]="Can't setup source system right now. Please try again later."
                                                res.end(JSON.stringify(objectToSend))
                                            }else{
                                                objectToSend["error"]=false;
                                                objectToSend["data"]="Source System Setup Complete"
                                                res.send(JSON.stringify(objectToSend))
                                            }
                                        });
                                    }else{
        
                                        conUserData.query(sql_insertCustomer, function (error7, results7, fields7) {
                                            if(error7){
                                                console.log("Error routes-->sources-->admin-->addSrcSystem",error7)
                                                objectToSend["error"]=true;
                                                objectToSend["data"]="Can't setup source system right now. Please try again later."
                                                res.end(JSON.stringify(objectToSend))
                                            }else{
                                                insertSrcDataInMysql(sources,products,events,accounts,ent_cd,uniqueAccs,function(response){
                                                    if(response==1){
        
                                                        objectToSend["error"]=true;
                                                        objectToSend["data"]="Can't setup source system right now. Please try again later."
                                                        res.end(JSON.stringify(objectToSend))
                                                    }else{
                                                        payloads = [
                                                            { topic: 'src_event', messages: 'reload_data', partition: 0 }
                                                        ];
                                                        producer.send(payloads, function (error8, data) {
                                                            if (error8) {
                                                                console.log("Error routes-->sources-->admin-->addSrcSystem",error8)
                                                                objectToSend["error"]=true;
                                                                objectToSend["data"]="Source System setup complete but couldn't update rules at the moment. Please change the rule file or reload it start posting events"
                                                                res.end(JSON.stringify(objectToSend))
        
                                                            }else{
                                                                objectToSend["error"]=false;
                                                                objectToSend["data"]="Source System Setup Complete"
                                                                res.send(JSON.stringify(objectToSend))
                                                            }
        
                                                        });
                                                        
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                                hiveDb.release(connObj, function (err) {
                                    if (err) {
                                        console.log("Error routes-->sources-->admin-->addSrcSystem--Error while releasing con",err)
                                    } else {
                                        console.log("Hive conn released")
                                    }
                                })
                            });
        
                        }
                    });
        
                    
        
                    
        
                }catch(ex){
                    console.log("Error routes-->sources-->admin-->addSrcSystem",ex)
                    objectToSend["error"]=true;
                    objectToSend["data"]="Can't setup source system right now. Please try again later."
                    res.end(JSON.stringify(objectToSend))
                }
                
            }
        });


        
        
     
    }


});






////////////////////////////
////
///Helper function for adding new source system
////////////////////////////

function insertSrcDataInMysql(sources,products,events,accounts,ent_cd,uniqueAccounts,callback){
    try{
        ///////////////////////////////////////
        //////////////////////

//ent_cd="FZ101"

        var source_ids=[];

        
        var sql_insertSrcSystem="";

        for(var i=0;i<sources.length;i++){

                                                             
            var source_system=sources[i];

            source_ids[i]=source_system.source_id

            var ss_name=source_system.ss_name;
            
            var ind_id=source_system.ind_id;
            var is_automatic=source_system.is_automatic;
            var kafka_ip=source_system.kafka_ip;
            var kafka_port=source_system.kafka_port;
            var topic=source_system.topic;
            


            if(is_automatic=='Y'){
                kafka_ip=source_system.kafka_ip;
                kafka_port=source_system.kafka_port;
                topic=source_system.topic;
                sql_insertSrcSystem+="insert into source_system(ent_cd,ss_name,ind_id,is_automatic,kafka_ip,kafka_port,topic) values"
                                +" ('"+ent_cd+"','"+ss_name+"','"+ind_id+"','"+is_automatic+"','"+kafka_ip+"','"+kafka_port+"','"+topic+"');";
                
                
            }else{
                sql_insertSrcSystem+="insert into source_system(ent_cd,ss_name,ind_id,is_automatic) values"
                                +" ('"+ent_cd+"','"+ss_name+"','"+ind_id+"','"+is_automatic+"');";
                
            }
        }

        sql_insertSrcSystem=sql_insertSrcSystem.substring(0,sql_insertSrcSystem.length-1);

        conUserData.query(sql_insertSrcSystem, function (error, results, fields) {

            if(error){
                console.log("Error routes-->sources-->admin-->addSrcSystem",error)
                return callback(1)
            }else{

                var map_of_sid={};

		if(results.length==undefined){
			map_of_sid[source_ids[0]]=results.insertId;
		}else{
			for(var itr1=0;itr1<results.length;itr1++){
		            map_of_sid[source_ids[itr1]]=results[itr1].insertId;
		        }
		}
                

                var product_ids=[]
                var sql_insertProduct=""

                for(var j=0;j<products.length;j++){
                    var product=products[j];

                    product_ids[j]=product.product_id;

                    var ss_id=map_of_sid[product.source_id]

                    var prod_cd=product.prod_cd;
                    var prod_desc=product.prod_desc;
                    var dtl_prod_cd=product.dtl_prod_cd;
                    var dtl_prod_desc=product.dtl_prod_desc;
                    var obset=product.off_balance_sheet_exposure_type;
                    var ccf=product.credit_conversion_factor;

                    sql_insertProduct+="insert into products (ss_id,ent_cd,prod_cd,prod_desc,dtl_prod_cd,dtl_prod_desc,off_balance_sheet_exposure_type,credit_conversion_factor) values"
                                        +"('"+ss_id+"','"+ent_cd+"','"+prod_cd+"','"+prod_desc+"','"+dtl_prod_cd+"','"+dtl_prod_desc+"','"+obset+"','"+ccf+"');";
                    
                }
                sql_insertProduct=sql_insertProduct.substring(0,sql_insertProduct.length-1);

                conUserData.query(sql_insertProduct, function (error2, results2, fields2) {
                    if(error2){
                        console.log("Error routes-->sources-->admin-->addSrcSystem",error2)
                        return callback(1)
                    }else{
                        var map_of_pid={}


			if(results2.length==undefined){
				map_of_pid[product_ids[0]]=results2.insertId
			}else{
				for(var itr2=0;itr2<results2.length;itr2++){
		                    map_of_pid[product_ids[itr2]]=results2[itr2].insertId

		                }
			}
                        

                        var event_ids=[]
                        var sql_insertEvent=""

                        for(var k=0;k<events.length;k++){
                            var event=events[k];

                            event_ids[k]=event.event_id;

                            var prod_id=map_of_pid[event.product_id];

                            var ev_name=event.ev_name;
                            var stp=event.screen_to_project;

                            sql_insertEvent+="insert into events (ev_name,screen_to_project,prod_id) values"
                                                +"('"+ev_name+"','"+stp+"','"+prod_id+"');"

                        }
                        sql_insertEvent=sql_insertEvent.substring(0,sql_insertEvent.length-1);

                        conUserData.query(sql_insertEvent, function (error4, results4, fields4) {
                            if(error4){
                                console.log("Error routes-->sources-->admin-->addSrcSystem",error4)
                                return callback(1)
                            }else{
                                var map_of_eid={}


				if(results4.length==undefined){
					map_of_eid[event_ids[0]]=results4.insertId;
				}else{
					for(var itr3=0;itr3<results4.length;itr3++){
		                            map_of_eid[event_ids[itr3]]=results4[itr3].insertId;
		                        }
				}
                                

                                if(accounts.length==0){
                                    return callback(0);
                                }else{

                                    ////////////////////////

                                    var sql_getGaap="Select gaap from reporting_unit where ent_cd='"+ent_cd+"'"


                                    conUserData.query(sql_getGaap, function (error5, results5, fields5) {
                                        if(error5){
                                            console.log("Error routes-->sources-->admin-->addSrcSystem",error5)
                                            return callback(1)
                                        }else{
                                            var gaap=results5[0].gaap.split(",")

                                            var sql_insertAccounts="insert into accounts (ev_id,ent_cd,account_number,acct_type,account_type_cd,acct_desc,rwa_off_ind,on_balancesheet_account,off_balancesheet_account,account_grp_cd,perfm_account_ind,trl_bal_ind,bsht_ind,incm_stmt_ind,memo_ind,carry_fwd_ind,lr_sub_cat,lr_exposure_type) values"
                                                            
                                            var sql_insertReclassAccount="insert into account_reclass (account_number,gaap,reclass_account,ent_cd) values"

                                            for(var l=0;l<accounts.length;l++){
                                                var acct=accounts[l];

                                                var ev_id=map_of_eid[acct.event_id]
                                                
                                                var account_number=acct.account_number;
                                                var acct_type=acct.acct_type;
                                                var account_tye_cd=acct.account_type_cd;
                                                var acct_desc=acct.acct_desc;
                                                var roi=acct.rwa_off_ind;
                                                var onbsa=acct.account_number;
                                                var offbsa=acct.account_number;
                                                var agc=acct.account_grp_cd;
                                                var pai=acct.perfm_account_ind;
                                                var tbi=acct.trl_bal_ind;
                                                var bi=acct.bsht_ind;
                                                var isi=acct.incm_stmt_ind;
                                                var mi=acct.memo_ind;
                                                var cfi=acct.carry_fwd_ind;
                                                var lsc=acct.lr_sub_cat;
                                                var letype=acct.lr_exposure_type;



                                                if(l==accounts.length-1){
                                                    sql_insertAccounts+="('"+ev_id+"','"+ent_cd+"','"+account_number+"','"+acct_type+"','"+account_tye_cd+"','"+acct_desc+"','"+roi+"','"+onbsa+"','"+offbsa+"','"+agc+"'"
                                                            +" ,'"+pai+"','"+tbi+"','"+bi+"','"+isi+"','"+mi+"','"+cfi+"','"+lsc+"','"+letype+"')"

                                                    

                                                    
                                                }else{
                                                    sql_insertAccounts+="('"+ev_id+"','"+ent_cd+"','"+account_number+"','"+acct_type+"','"+account_tye_cd+"','"+acct_desc+"','"+roi+"','"+onbsa+"','"+offbsa+"','"+agc+"'"
                                                            +" ,'"+pai+"','"+tbi+"','"+bi+"','"+isi+"','"+mi+"','"+cfi+"','"+lsc+"','"+letype+"'),"
                                                    
                                                    
                                                }
                                            }

                                            var distinctAccs=Object.keys(uniqueAccounts);

                                            for(var n=0;n<distinctAccs.length;n++){
                                                var acct=uniqueAccounts[distinctAccs[n]];
                                                var account_number=acct.account_number;

                                                if(n==distinctAccs.length-1){
                                                    for(var m=0;m<gaap.length;m++){

                                                        if(m==gaap.length-1){
                                                            sql_insertReclassAccount+="('"+account_number+"','"+gaap[m]+"','"+account_number+"','"+ent_cd+"')"
                                                        }else{
                                                            sql_insertReclassAccount+="('"+account_number+"','"+gaap[m]+"','"+account_number+"','"+ent_cd+"'),"
                                                        }
                                                        
                                                    }
                                                }else{
                                                    for(var m=0;m<gaap.length;m++){

                                                        sql_insertReclassAccount+="('"+account_number+"','"+gaap[m]+"','"+account_number+"','"+ent_cd+"'),"
                                                        
                                                        
                                                    }
                                                }
                                                
                                            }

                                            conUserData.query(sql_insertAccounts, function (error6, results6, fields6) {
                                                if(error6){
                                                    console.log("Error routes-->sources-->admin-->addSrcSystem",error6)
                                                    return callback(1)
                                                }else{
                                                    conUserData.query(sql_insertReclassAccount, function (error7, results7, fields7) {
                                                        if(error7){
                                                            console.log("Error routes-->sources-->admin-->addSrcSystem",error7)
                                                            return callback(1)
                                                        }else{
                                                            return callback(0);
                                                        }
                                                    });
                                                }
                                            });

                                            


                                        }
                                    });




                                    /////////////////////////

                                    

                                    
                                }
                            }

                        });
                    }
                });


                
            }
        });



    }catch(ex){
        console.log("Error routes-->sources-->admin-->addSrcSystem",ex)
                                                                                
        return callback(1)
    }
}



//////////////////////////////////////                  ///////////////////////////////////////////////   
//////////////////////////////////////MODIFY SRC SYSTEM REQUESTS///////////////////////////////////////


//////////////
//Request to show source system
router.get('/getSrcInfo:dtls', (req, res) => {

    var ss_id=req.params.dtls;

    var objectToSend={};

    var sql_srcInfo="Select * from source_system where ss_id ='"+ss_id+"'";

    conUserData.query(sql_srcInfo,function(error,results){
        if(error){
            console.log("Error routes-->sources-->admin-->getSrcInfo--",error);
            objectToSend["error"]=true;
            objectToSend["data"]="Server side error. Can't fetch information right now"
            res.end(JSON.stringify(objectToSend))
        }else{
            objectToSend["error"]=false;
            objectToSend["data"]=results
            res.send(JSON.stringify(objectToSend))
        }
    });

});

//////////////
//Request to show products
router.get('/getProdInfo:dtls', (req, res) => {

    var temp=JSON.parse(req.params.dtls);
    var ss_id=temp.ss_id;

    var ss_name=temp.ss_name;

    console.log("prod data--",temp)

    var objectToSend={};

    var data={};

    var sql_srcInfo="Select * from products where ss_id ='"+ss_id+"'";
    console.log("sql_srcInfo",sql_srcInfo)

    conUserData.query(sql_srcInfo,function(error,results){
        if(error){
            console.log("Error routes-->sources-->admin-->getProdInfo--",error);
            objectToSend["error"]=true;
            objectToSend["data"]="Server side error. Can't fetch information right now"
            res.end(JSON.stringify(objectToSend))
        }else{
            var dtl_p_cd="";
            for(var k=0;k<results.length;k++){
                if(k==results.length-1){
                    dtl_p_cd+="'"+results[k].dtl_prod_cd+"'";
                }else{
                    dtl_p_cd+="'"+results[k].dtl_prod_cd+"',";
                }
                
            }


            data["allotted"]=results;

            var sql_getSsId="Select ss_id from source_system where ss_name='"+ss_name+"'";

            console.log("sql_getSsId",sql_getSsId)

            conSystemData.query(sql_getSsId,function(error1,results1){
                if(error1){
                    console.log("Error routes-->sources-->admin-->getProdInfo--",error1);
                    objectToSend["error"]=true;
                    objectToSend["data"]="Server side error. Can't fetch information right now"
                    res.end(JSON.stringify(objectToSend))
                }else if(results1.length<1){
                    objectToSend["error"]=false;
                    data["unallotted"]=[]
                    objectToSend["data"]=data
                    res.send(JSON.stringify(objectToSend))
                }else{
                    var s_id="";


                    for(var i=0;i<results1.length;i++){
                        if(i==results1.length-1){
                            s_id+="'"+results1[i].ss_id+"'";
                        }else{
                            s_id+="'"+results1[i].ss_id+"',";
                        }
                    }
                    var sql_getProd="Select * from products where ss_id in ("+s_id+") and dtl_prod_cd not in ("+dtl_p_cd+") ";

                    console.log("sql_getProd",sql_getProd)

                    conSystemData.query(sql_getProd,function(error2,results2){
                        if(error2){
                            console.log("Error routes-->sources-->admin-->getProdInfo--",error2);
                            objectToSend["error"]=true;
                            objectToSend["data"]="Server side error. Can't fetch information right now"
                            res.end(JSON.stringify(objectToSend))
                        }else if(results.length<1){
                            objectToSend["error"]=false;
                            data["unallotted"]=[]
                            objectToSend["data"]=data
                            res.end(JSON.stringify(objectToSend))
                        }else{
                            data["unallotted"]=results2;
                            objectToSend["error"]=false;
                            objectToSend["data"]=data
                            res.send(JSON.stringify(objectToSend))
                        }
                    });
                }
            });
            
        }
    });

});


//////////////
//Request to show events
router.get('/getEventInfo:dtls', (req, res) => {

    var temp=JSON.parse(req.params.dtls);

    var prod_id="";

    

    

    var unalloted_prod_id="";

    console.log("getEvent for --",temp)

    

    ////////////////////////
    //
    for(var k=0;k<temp.length;k++){

        
            if(temp[k].is_allotted){
                prod_id+="'"+temp[k].prod_id+"',";
            }else{
                unalloted_prod_id+="'"+temp[k].prod_id+"',";
            }
            
        
    }

    
  

    var objectToSend={};

    var data={};

    if(prod_id==""){
        data["allotted"]=[]
        if(unalloted_prod_id==""){
            data["unallotted"]=[]
            objectToSend["error"]=false;
            objectToSend["data"]=data
            res.send(JSON.stringify(objectToSend))
        }else{
            
            unalloted_prod_id=unalloted_prod_id.substring(0,unalloted_prod_id.length-1);

            var sql_getEvents="Select * from events where prod_id in ("+unalloted_prod_id+")";

            console.log(sql_getEvents)

            conSystemData.query(sql_getEvents,function(error1,results1){
                if(error1){
                    console.log("Error routes-->sources-->admin-->getEventsInfo--",error1);
                    objectToSend["error"]=true;
                    objectToSend["data"]="Server side error. Can't fetch information right now"
                    res.end(JSON.stringify(objectToSend))
                }else if(results1.length<1){
                    data["unallotted"]=[]
                    objectToSend["error"]=false;
                    objectToSend["data"]=data
                    res.send(JSON.stringify(objectToSend))
                }else{
                    objectToSend["error"]=false;
                    data["unallotted"]=results1;
                    objectToSend["data"]=data
                    res.send(JSON.stringify(objectToSend))
                }
            });
        }
        
    }else{

        prod_id=prod_id.substring(0,prod_id.length-1);
   
        var sql_allotedEvents="Select * from events where prod_id in ("+prod_id+")";

        console.log(sql_allotedEvents)
    
        conUserData.query(sql_allotedEvents,function(error,results){
            if(error){
                console.log("Error routes-->sources-->admin-->getEventsInfo--",error);
                objectToSend["error"]=true;
                objectToSend["data"]="Server side error. Can't fetch information right now"
                res.end(JSON.stringify(objectToSend))
            }else if(results.length<1){
                
                data["allotted"]=[]
                
                if(unalloted_prod_id==""){
                    data["unallotted"]=[]
                    objectToSend["error"]=false;
                    objectToSend["data"]=data
                    res.send(JSON.stringify(objectToSend))
                }else{
                    
                    unalloted_prod_id=unalloted_prod_id.substring(0,unalloted_prod_id.length-1);
                    var sql_getEvents="Select * from events where prod_id in ("+unalloted_prod_id+")";
    
                    console.log(sql_getEvents)
        
                    conSystemData.query(sql_getEvents,function(error1,results1){
                        if(error1){
                            console.log("Error routes-->sources-->admin-->getEventsInfo--",error1);
                            objectToSend["error"]=true;
                            objectToSend["data"]="Server side error. Can't fetch information right now"
                            res.end(JSON.stringify(objectToSend))
                        }else if(results1.length<1){
                            data["unallotted"]=[]
                            objectToSend["error"]=false;
                            objectToSend["data"]=data
                            res.send(JSON.stringify(objectToSend))
                        }else{
                            objectToSend["error"]=false;
                            data["unallotted"]=results1;
                            objectToSend["data"]=data
                            res.send(JSON.stringify(objectToSend))
                        }
                    });
                }
            }
            else{
                var ev_name="";
                for(var j=0;j<results.length;j++){
                    if(j==results.length-1){
                        ev_name+="'"+results[j].ev_name+"'";
                    }else{
                        ev_name+="'"+results[j].ev_name+"',";
                    }
                    
                }
                data["allotted"]=results;
    
                if(unalloted_prod_id==""){
                    data["unallotted"]=[]
                    objectToSend["error"]=false;
                    objectToSend["data"]=data
                    res.send(JSON.stringify(objectToSend))
                }else{
                    
                    unalloted_prod_id=unalloted_prod_id.substring(0,unalloted_prod_id.length-1);
                    var sql_getEvents="Select * from events where prod_id in ("+unalloted_prod_id+") and ev_name not in ("+ev_name+") ";
    
                    console.log(sql_getEvents)
        
                    conSystemData.query(sql_getEvents,function(error1,results1){
                        if(error1){
                            console.log("Error routes-->sources-->admin-->getEventsInfo--",error1);
                            objectToSend["error"]=true;
                            objectToSend["data"]="Server side error. Can't fetch information right now"
                            res.end(JSON.stringify(objectToSend))
                        }else if(results1.length<1){
                            data["unallotted"]=[]
                            objectToSend["error"]=false;
                            objectToSend["data"]=data
                            res.send(JSON.stringify(objectToSend))
                        }else{
                            objectToSend["error"]=false;
                            data["unallotted"]=results1;
                            objectToSend["data"]=data
                            res.send(JSON.stringify(objectToSend))
                        }
                    });
                }
    
                
                
            }
        });
    }

    

});





//////////////
//Request to show acounts
router.get('/getAccInfo:dtls', (req, res) => {

    var temp=JSON.parse(req.params.dtls);

    console.log(temp)

    var ev_id="";

    var ev_name="";

    var unalloted_ev_id="";

    

    

    for(var k=0;k<temp.length;k++){
        if(temp[k].is_eve_allotted){
            ev_id+="'"+temp[k].ev_id+"',";
            
        }else{
            unalloted_ev_id+="'"+temp[k].ev_id+"',";
            
        }
    }

  

    var objectToSend={};

    var data={};

    if(ev_id==""){
        data["allotted"]=[]

        if(unalloted_ev_id==""){
            data["unallotted"]=[]
            objectToSend["error"]=false;
            
            objectToSend["data"]=data
            res.send(JSON.stringify(objectToSend))
        }else{
            unalloted_ev_id=unalloted_ev_id.substring(0,unalloted_ev_id.length-1);
            var sql_getEvents="Select * from accounts where ev_id in ("+unalloted_ev_id+") ";

            conSystemData.query(sql_getEvents,function(error1,results1){
                if(error1){
                    console.log("Error routes-->sources-->admin-->getProdInfo--",error1);
                    objectToSend["error"]=true;
                    objectToSend["data"]="Server side error. Can't fetch information right now"
                    res.end(JSON.stringify(objectToSend))
                }else if(results1.length<1){
                    objectToSend["error"]=false;
                    data["unallotted"]=[];
                    objectToSend["data"]=data
                    res.send(JSON.stringify(objectToSend))
                }else{
                    objectToSend["error"]=false;
                    data["unallotted"]=results1;
                    objectToSend["data"]=data
                    res.send(JSON.stringify(objectToSend))
                }
            });

        }

    }else{

        ev_id=ev_id.substring(0,ev_id.length-1);
        var sql_evInfo="Select * from accounts where ev_id in ("+ev_id+")";

        conUserData.query(sql_evInfo,function(error,results){
            if(error){
                console.log("Error routes-->sources-->admin-->getAccInfo--",error);
                objectToSend["error"]=true;
                objectToSend["data"]="Server side error. Can't fetch information right now"
                res.end(JSON.stringify(objectToSend))
            }else if(results.length<1){
                data["allotted"]=[]

                if(unalloted_ev_id==""){
                    data["unallotted"]=[]
                    objectToSend["error"]=false;
                    
                    objectToSend["data"]=data
                    res.send(JSON.stringify(objectToSend))
                }else{
                    unalloted_ev_id=unalloted_ev_id.substring(0,unalloted_ev_id.length-1);
                    var sql_getEvents="Select * from accounts where ev_id in ("+unalloted_ev_id+") ";
    
                    conSystemData.query(sql_getEvents,function(error1,results1){
                        if(error1){
                            console.log("Error routes-->sources-->admin-->getProdInfo--",error1);
                            objectToSend["error"]=true;
                            objectToSend["data"]="Server side error. Can't fetch information right now"
                            res.end(JSON.stringify(objectToSend))
                        }else if(results1.length<1){
                            objectToSend["error"]=false;
                            data["unallotted"]=[];
                            objectToSend["data"]=data
                            res.send(JSON.stringify(objectToSend))
                        }else{
                            objectToSend["error"]=false;
                            data["unallotted"]=results1;
                            objectToSend["data"]=data
                            res.send(JSON.stringify(objectToSend))
                        }
                    });

                }

                

            }else{
                var acc_num="";
                for(var k=0;k<results.length;k++){
                    if(k==results.length-1){
                        acc_num+="'"+results[k].account_number+"'";
                    }else{
                        acc_num+="'"+results[k].account_number+"',";
                    }
                    
                }
                data["allotted"]=results;
                if(unalloted_ev_id==""){
                    objectToSend["error"]=false;
                    data["unallotted"]=[];
                    objectToSend["data"]=data
                    res.send(JSON.stringify(objectToSend))
                }else{
                    unalloted_ev_id=unalloted_ev_id.substring(0,unalloted_ev_id.length-1);
                    var sql_getEvents="Select * from accounts where ev_id in ("+unalloted_ev_id+") and account_number not in ("+acc_num+") ";
        
                    conSystemData.query(sql_getEvents,function(error1,results1){
                        if(error1){
                            console.log("Error routes-->sources-->admin-->getProdInfo--",error1);
                            objectToSend["error"]=true;
                            objectToSend["data"]="Server side error. Can't fetch information right now"
                            res.end(JSON.stringify(objectToSend))
                        }else if(results1.length<1){
                            objectToSend["error"]=false;
                            data["unallotted"]=[];
                            objectToSend["data"]=data
                            res.send(JSON.stringify(objectToSend))
                        }else{
                            objectToSend["error"]=false;
                            data["unallotted"]=results1;
                            objectToSend["data"]=data
                            res.send(JSON.stringify(objectToSend))
                        }
                    });
                }
    
                
                
            }
        });
    }



    

});




//////////////
//Request to modify source system
router.post('/modifySrcSystem', (req, res) => {

    var objectToSend={}

    objectToSend["error"]=false;
    objectToSend["data"]="Coming Soon!!!!"

    res.send(JSON.stringify(objectToSend))
});



//////////////////////////////////////                  ///////////////////////////////////////////////   
//////////////////////////////////////DELETE SRC SYSTEM REQUESTS///////////////////////////////////////

//////////////////////
//Request to delete source system
router.delete('/deleteSrcSystem:dtls',   function (req, res) {
    var ss_id=req.params.dtls;
    var objectToSend={};

    try{

        var sql_deleteSs="delete from source_system where ss_id='"+ss_id+"'"
        var sql_getProdId="Select prod_id from products where ss_id='"+ss_id+"'"

        conUserData.query(sql_deleteSs+";"+sql_getProdId,function(error,results,fields){
            if(error){
                console.log("Error routes-->sources-->admin-->deleteSrcSystem--",error);
                objectToSend["error"]=true;
                objectToSend["data"]="Can't delete source system at the moment. Please try again later"
                res.end(JSON.stringify(objectToSend))
            }else{
                var prod_id="";
                for(var i=0;i<results[1].length;i++){
                    if(i==results[1].length-1){
                        prod_id+="'"+results[1][i].prod_id+"'"
                    }else{
                        prod_id+="'"+results[1][i].prod_id+"',"
                    }
                    
                }

                var sql_deleteProd="delete from products where ss_id='"+ss_id+"'"

                if(prod_id!=""){
                    prod_id=","+prod_id;
                }
                var sql_getEvId="Select ev_id from events where prod_id in ('undefined'"+prod_id+")"

                conUserData.query(sql_deleteProd+";"+sql_getEvId,function(error1,results1,fields1){
                    if(error1){
                        console.log("Error routes-->sources-->admin-->deleteSrcSystem--",error1);
                        objectToSend["error"]=true;
                        objectToSend["data"]="Can't delete source system completely at the moment. Please contact support"
                        res.end(JSON.stringify(objectToSend))
                    }else{
                        var ev_id=""
                        for(var i=0;i<results1[1].length;i++){
                            if(i==results1[1].length-1){
                                ev_id+="'"+results1[1][i].ev_id+"'"
                            }else{
                                ev_id+="'"+results1[1][i].ev_id+"',"
                            }
                        }

                        if(ev_id!=""){
                            ev_id=","+ev_id;
                        }

                        var sql_deleteEvents="delete from events where prod_id in ('undefined'"+prod_id+")"
                        var sql_deleteAccs="delete from accounts where ev_id in ('undefined'"+ev_id+")"

                        conUserData.query(sql_deleteEvents+";"+sql_deleteAccs,function(error2,results2,fields1){
                            if(error2){
                                console.log("Error routes-->sources-->admin-->deleteSrcSystem--",error2);
                                objectToSend["error"]=true;
                                objectToSend["data"]="Can't delete source system completely at the moment. Please contact support"
                                res.end(JSON.stringify(objectToSend))
                            }else{
                                objectToSend["error"]=false;
                                objectToSend["data"]="Source system deleted"
                                res.send(JSON.stringify(objectToSend))
                            }
                        });
                    }
                });
            }
        })
    }catch(ex){
        console.log("Error routes-->sources-->admin-->deleteSrcSystem--",ex);
        objectToSend["error"]=true;
        objectToSend["data"]="Source System not deleted Completely. Contact support"
        res.end(JSON.stringify(objectToSend))
    }
});







//////////////////////////////////////                  ///////////////////////////////////////   
//////////////////////////////////////RULE FILE REQUESTS///////////////////////////////////////


var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './uploads');
    },
    filename: function (req, file, callback) {
      console.log(file)
      callback(null, file.originalname);
    }
});


let upload = multer({ storage: storage }).single('rulefile');



////////////////////
//Request to upload rule file
router.post('/uploadRuleFile:dtl',   function (req, res) {
    console.log("calling file uploader")

    //upload.single('rulefile')

    var obj=JSON.parse(req.params.dtl);
    var objectToSend={};

    
    if (req.file!=undefined) {
        console.log("Error routes-->sources-->admin-->uploadRuleFile--Investigate this error in upload--req is->",req);
        objectToSend["error"]=true;
        objectToSend["data"]="Front end error"
        res.end(JSON.stringify(objectToSend))
        
    } else {
        
        upload(req,res,function(err) {
            if(err) {
                console.log("Error routes-->sources-->admin-->uploadRuleFile--",err);
                objectToSend["error"]=true;
                objectToSend["data"]="Server Side Error. Can't upload file at the moment "
                res.end(JSON.stringify(objectToSend))
                
            }else{

                try{

                    
                    var filename = obj.file_name;
                    var ent_cd=obj.ent_cd;




                    var localFile = './uploads/' + filename;
                    /* var remoteFileStream = hdfs.createWriteStream('/user/svayam/rules/' + filename);
                    localFileStream.pipe(remoteFileStream);
                    remoteFileStream.on('finish', function onFinish() {
                    }); */


                    var copyLoc="./ruleFiles/"+ent_cd+"/"+filename;


                    fs.copyFile(localFile,copyLoc,{recursive:true},(err1) => {
                        if(err1){
                            console.log("Error routes-->sources-->admin-->uploadRuleFile--",err1);
                            objectToSend["error"]=true;
                            objectToSend["data"]="Server Side Error. Can't upload file at the moment "
                            res.end(JSON.stringify(objectToSend))
                            
                        }else{

                            var sql_rule_info="insert into rule_file_info (ent_cd,file_name,status) values('"+ent_cd+"','"+filename+"','INACTIVE')";


                            conUserData.query(sql_rule_info,function(error,results){
                                if(error){
                                    console.log("Error routes-->sources-->admin-->uploadRuleFile--",error);
                                    objectToSend["error"]=true;
                                    objectToSend["data"]="Server Side Error. Can't upload file at the moment "
                                    res.end(JSON.stringify(objectToSend))
                                    
                                }else{
                                    objectToSend["error"]=false;
                                    objectToSend["data"]="File uploaded successfully"
                                    res.send(JSON.stringify(objectToSend))
                                    //res.send(JSON.stringify("Ok"))
                                }
                            });
                        }
                    });

                    
                }catch(ex){
                    console.log("Error routes-->sources-->admin-->uploadRuleFile--",ex);
                    objectToSend["error"]=true;
                    objectToSend["data"]="Server Side Error. Can't upload file at the moment "
                    res.end(JSON.stringify(objectToSend))
                }
               
            }
           
        });
       
        
    }
})


/////////////////////////////
///Request to download rule file
router.post('/downloadRuleFile', function (req, res) {
    
 
    var obj=req.body;
    var ent_cd=obj.ent_cd;
    var file_name=obj.file_name;

    try{
        var path="./ruleFiles/"+ent_cd;
        
        
        res.download(path+"/"+file_name);

    }catch(ex){
        console.log("Error routes-->sources-->admin-->downloadRuleFile--",ex);
        objectToSend["error"]=true;
        objectToSend["data"]="Can't download file at the moment. Please try again later"
        res.end(JSON.stringify(objectToSend))
    }

    
});
 



///////////////////////////////////
////Request to obtain rule file information
router.get('/getRuleInformation:dtls', function (req, res) {

    var ent_cd=req.params.dtls;

    var objectToSend={}

    console.log("ent for rule--"+ent_cd+"--  ");

    

    var sql_rule_info="Select file_id,file_name  ,status from rule_file_info where ent_cd ='"+ent_cd+"'";
    conUserData.query(sql_rule_info,function(error,results){
        if(error){
            console.log("Error routes-->sources-->admin-->getRuleInformation--",error);
            objectToSend["error"]=true;
            objectToSend["data"]="Can't fetch rule file info at the moment. Please try again later"
            res.end(JSON.stringify(objectToSend))
        }else{
            if(results[0].file_name==null){
                objectToSend["error"]=false;
                objectToSend["data"]={}
                res.end(JSON.stringify(objectToSend))
            }else{
                objectToSend["error"]=false;
                objectToSend["data"]=results
                res.end(JSON.stringify(objectToSend))
            }
            

        }
    });
})



///////////////////////////
//Request to activate rule file
router.put('/activateRuleFile', function (req, res) {
    var obj = req.body;
    
    var objectToSend={};

    var sqlquery = "update rule_file_info set status=(case when (ent_cd='"+obj.ent_cd+"' and status='ACTIVE') then 'INACTIVE'"
			+" when (ent_cd='"+obj.ent_cd+"' and status='INACTIVE' and file_name='"+obj.file_name+"') then 'ACTIVE'"
		+" 	else 'INACTIVE' END) where ent_cd='"+obj.ent_cd+"'"



        conUserData.query(sqlquery, function (err, results) {
        if(err){
            console.log("Error routes-->sources-->admin-->activateRuleFile--",err);
            objectToSend["error"]=true;
            objectToSend["data"]="Can't activate rule file at the moment"
            res.end(JSON.stringify(objectToSend))
        }else{

            objectToSend["error"]=false;
            objectToSend["data"]="Rule file is active now"
            res.end(JSON.stringify(objectToSend))
             payloads = [
                { topic: 'src_event', messages: 'reload_data', partition: 0 }
            ];
            producer.send(payloads, function (error, data) {
                if (error) {
                    console.log("Error routes-->sources-->admin-->activateRuleFile--",error);
                    objectToSend["error"]=true;
                    objectToSend["data"]="Some error occured while activating rule file"
                    res.end(JSON.stringify(objectToSend))

                } else {

                    objectToSend["error"]=false;
                    objectToSend["data"]="Rule file is active now"
                    res.end(JSON.stringify(objectToSend))
                    

                }
            }); 
        }
        
    })
})


module.exports = router;



////////////////////////////////////////////
////////////////////////
///////////////////////


/* 
hiveQuery = "insert into ref_product (id,leaf_col_id,hierarchy_id,hierarchy_name,leaf_cd,leaf_desc,lvl1_cd,lvl1_desc,"
                +"lvl2_cd,lvl2_desc,lvl3_cd,lvl3_desc,org_unit_cd)  values"
        for (var i = 0; i < postData.length; i++) {
            if (i < postData.length - 1) {
                hiveQuery += " ('" + postData[i].id + "','Detail Product Code','PRDCT-001','Product_Hierarchy','" + postData[i].leaf_cd + "','" + postData[i].leaf_desc + "','L1A-001','Trial Balance','" + postData[i].lvl4_cd + "','" + postData[i].lvl_desc + "','" + postData[i].leaf_cd + "','" + postData[i].leaf_desc + "','" + postData[i].ent_cd + "') ,"
                sqlquery += " ('" + postData[i].leaf_cd + "','" + postData[i].leaf_desc + "','" + postData[i].lvl2_cd + "','" + postData[i].lvl2_desc + "','" + postData[i].off_balance_sheet_exposure_type + "','" + postData[i].credit_conversion_factor + "','" + postData[i].ent_cd + "' ,'" + postData[i].src_system + "') ,"
            } else {
                sqlquery += " ('" + postData[i].leaf_cd + "','" + postData[i].leaf_desc + "','" + postData[i].lvl2_cd + "','" + postData[i].lvl2_desc + "','" + postData[i].off_balance_sheet_exposure_type + "','" + postData[i].credit_conversion_factor + "','" + postData[i].ent_cd + "','" + postData[i].src_system + "')"
                hiveQuery += " ('" + postData[i].id + "','Detail Product Code','PRDCT-001','Product_Hierarchy','" + postData[i].leaf_cd + "','" + postData[i].leaf_desc + "','L1A-001','Trial Balance','" + postData[i].lvl2_cd + "','" + postData[i].lvl2_desc + "','" + postData[i].leaf_cd + "','" + postData[i].leaf_desc + "','" + postData[i].ent_cd + "') "
            }
        }



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
                                            statement.executeUpdate(hiveQuery,
                                                function (err, count) {
                                                    if (err) {
                                                        console.log(err)
                                                        callback(err);
                                                    } else {

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
                    }); */
