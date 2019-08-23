var express = require('express');
var router = express.Router();
var conSystemData = require('../../connections/mysqlsystemdata.js');
var conUserData = require('../../connections/mysqlUserData.js');
var producer = require('../../connections/kafkaconnection.js');
var conSourceSystemdata=require('../../connections/mysqlsouresystemDb.js')
var multer = require('multer');
const fs=require('fs');


var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './uploads');
    },
    filename: function (req, file, callback) {
      console.log(file)
      callback(null, file.originalname);
    }
});


let upload = multer({ storage: storage }).single('eventfile');




//////////////
//Request to show source system
router.get('/getSrcSystem:dtls', (req, res) => {

    var objectToSend={};
    var entCd=req.params.dtls;
    //var sqlQuery = "Select ss_name,ss_id from source_system where ent_cd='"+entCd+"'";

    var sqlQuery="Select t.ss_name,t.ss_id, CASE when dss.ss_id is null then false"
                +" else true end as is_running from (Select ss_name,ss_id from source_system where ent_cd='"+entCd+"' and is_automatic !='Y')t"
                +" left join demo_source_system dss"
                +" on t.ss_id=dss.ss_id"
    conUserData.query(sqlQuery, function (error, results, fields) {
        if (error) {
            console.log("Error routes-->sources-->manual-->getSrcSystem",error);
            objectToSend["error"]=true;
            objectToSend["data"]="Cant retrieve source system for given entity code" 
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
//Request to get products and events of a source system
router.get('/getProductsAndEvents:dtls', (req, res) => {

    var ss_id=req.params.dtls;

    var objectToSend={};


    var sqlQuery = "Select p.prod_cd,p.prod_desc,p.dtl_prod_cd,p.dtl_prod_desc,group_concat(e.ev_name) as events,"
                    +" group_concat(e.screen_to_project) as screen"
                    +" from"
                   +" (Select * from products where ss_id in ("+ss_id+")) p join events e on p.prod_id=e.prod_id "
                   +" group by p.prod_cd,p.prod_desc,p.dtl_prod_cd,"
                   +" p.dtl_prod_desc"
                   +" order by dtl_prod_cd";

    var dataToSend=[]

    
    conUserData.query(sqlQuery, function (error, results, fields) {
        if (error) {
            console.log("Error routes-->sources-->manual-->getProductsAndEvents",error);
            objectToSend["error"]=true;
            objectToSend["data"]="Cant retrieve products and events at the moment" 
            res.end(JSON.stringify(objectToSend))
        }
        else {
            try{

                var dataToSend=[];
            
                

                for(var k=0;k<results.length;k++){
                    var obj={}
                    var prodObj={}
                    var eventArr=[]
                    

                    prodObj["prod_cd"]=results[k]["prod_cd"]
                    prodObj["prod_desc"]=results[k]["prod_desc"]
                    prodObj["dtl_prod_cd"]=results[k]["dtl_prod_cd"]
                    prodObj["dtl_prod_desc"]=results[k]["dtl_prod_desc"]

                    obj["product"]=prodObj

                    var e=results[k]["events"].split(",")
                    var scr=results[k]["screen"].split(",")

                    for(var i=0;i<e.length;i++){
                        var evObj={} 
                        evObj["ev_name"]=e[i]
                        evObj["screen_to_project"]=scr[i]

                        eventArr[i]=evObj
                    }

                    obj["events"]=eventArr

                    dataToSend[k]=obj

                   

                }
                objectToSend["error"]=false;
                objectToSend["data"]=dataToSend
                res.send(JSON.stringify(objectToSend))
                
            }catch(ex){
                console.log("Error routes-->sources-->manual-->getProductsAndEvents Catch--",ex)
                objectToSend["error"]=true;
                objectToSend["data"]="Cant retrieve products and events at the moment" 
                res.end(JSON.stringify(objectToSend))
            }

            
            
        }
    });
})



////////////////////////
//Request to get Country
router.get('/getCountryInfo', function (req, res) {
    var objectToSend={}
    conSystemData.query('select * from country_info', function (error5, results) {
        if (error5){
            console.log("Error routes-->sources-->manual-->getCountryInfo->",error5);
            objectToSend["error"]=true
            objectToSend["data"]="Cant fetch country related information at the moment"
            res.end(JSON.stringify(objectToSend))
        }
        else {
            objectToSend["error"]=false
            objectToSend["data"]=results
            res.end(JSON.stringify(objectToSend))
        }
    })
});



////////////////////////
//Request to get assigned parties
router.get('/getAllAssignedParties:dtls', function (req, res) {

    var objectToSend={}
    var ent_cd=req.params.dtls.trim()

    var sql="Select * from customer where ent_cd='"+ent_cd+"' group by dtl_customer_type_cd";

    console.log(sql)

    conUserData.query(sql,function(error2,results2){

        if(error2){
            console.log("Error routes-->sources-->manual-->getAllAssignedParties->",error2);
            objectToSend["error"]=true
            objectToSend["data"]="Cant fetch customer related information at the moment"
            res.end(JSON.stringify(objectToSend))
        }
        else{
            objectToSend["error"]=false
            objectToSend["data"]=results2
            res.end(JSON.stringify(objectToSend))
        }
    });
});


//////////////////////
//Request to post events
router.post('/postEvent', function (req, res) {
    var str=JSON.stringify(req.body);

    var objectToSend={} 
    console.log(str)

    //res.send(JSON.stringify("OK"))
     payloads = [
        { topic:'manual_event' , messages: str, partition: 0 }
    ];
    producer.send(payloads, function (err, data) {
        if (err) {
            console.log("Error routes-->sources-->manual-->getAllAssignedParties->",err);
            objectToSend["error"]=true
            objectToSend["data"]="Can't fire this event at the moment"
            res.end(JSON.stringify(objectToSend))

        } else {
            objectToSend["error"]=false
            objectToSend["data"]="Event fired successfully"
            res.end(JSON.stringify(objectToSend))
            
        }
    }); 
})



router.get('/searchSrc:pObj',(req,res)=>{
    var params=JSON.parse(req.params.pObj);

    var objectToSend={} 
    sqlQuery="select * from ss_lookup where org_unit_cd='"+params.org_unit_cd+"'"

    if(params.name!=""){
        sqlQuery+="and name like '"+params.name+"%' "
    }
    if(params.product!=""){
        sqlQuery+=" and prod_cd='"+params.product+"' "
    }
    if(params.arr_num!=""){
        sqlQuery+=" and arr_num='"+params.arr_num+"' "
    }
    if(params.cust_type!=""){
        sqlQuery+=" and cust_industry_cd='"+params.cust_type+"' "
    }
	
    console.log(sqlQuery)
    conSourceSystemdata.query(sqlQuery,(err,results)=>{
        if(err){
            console.log("Error routes-->sources-->manual-->searchSrc->",err);
            objectToSend["error"]=true
            objectToSend["data"]="Cant fetch information from source system"
            res.end(JSON.stringify(objectToSend))
        }else{
            objectToSend["error"]=false
            objectToSend["data"]=results
            res.end(JSON.stringify(objectToSend))
        }
    })
})




////////////////////
//Request to upload event file
router.post('/uploadEventFile:dtl',   function (req, res) {
    

    

    var obj=JSON.parse(req.params.dtl);
    var objectToSend={};

    
    if (req.file!=undefined) {
        console.log("Error routes-->sources-->manual-->uploadEventFile--req_value-->",req);
        objectToSend["error"]=true;
        objectToSend["data"]="Front end error"
        res.end(JSON.stringify(objectToSend))
        
    } else {
        
        upload(req,res,function(err) {
            if(err) {
                console.log("Error routes-->sources-->manual-->uploadEventFile--",err);
                objectToSend["error"]=true;
                objectToSend["data"]="Server Side Error. Can't upload event File at the moment "
                res.end(JSON.stringify(objectToSend))
                
            }else{

                try{

                    
                    var filename = obj.file_name;
                    var ent_cd=obj.ent_cd;




                    var localFile = './uploads/' + filename;
                    

                    var dir="../event_files/"+ent_cd;

                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }

console.log("dir is --",dir)


                    var copyLoc="../event_files/"+ent_cd+"/"+filename;


                    fs.copyFile(localFile,copyLoc,{recursive:true},(err1) => {
                        if(err1){
                            console.log("Error routes-->sources-->manual-->uploadEventFile--",err1);
                            objectToSend["error"]=true;
                            objectToSend["data"]="Server Side Error. Can't upload event file at the moment "
                            res.end(JSON.stringify(objectToSend))
                            
                        }else{

                            var sql_insertEventFile="insert into event_file_info (ent_cd,event_file_name) values"
                                                +"('"+ent_cd+"','"+filename+"')"

                            conUserData.query(sql_insertEventFile,(err,results)=>{
                                if(err){
                                    console.log("Error routes-->sources-->manual-->uploadEventFile--",err);
                                    objectToSend["error"]=true
                                    objectToSend["data"]="Server side error"
                                    res.end(JSON.stringify(objectToSend))
                                }else{

                                    payloads = [
                                        { topic: 'file_event', messages: 'reload_data', partition: 0 }
                                    ];
                                    producer.send(payloads, function (error8, data) {
                                        if (error8) {
                                            console.log("Error routes-->sources-->manual-->uploadEventFile--",error8)
                                            objectToSend["error"]=true;
                                            objectToSend["data"]="File upload complete but source system is busy right hence it can't be processed at the moment"
                                            res.end(JSON.stringify(objectToSend))

                                        }else{
                                            objectToSend["error"]=false;
                                            objectToSend["data"]="Event File uploaded successfully"
                                            res.send(JSON.stringify(objectToSend))
                                        }

                                    });
                                    
                                }
                            })

                            
                            

                            
                        }
                    });

                    
                }catch(ex){
                    console.log("Error routes-->sources-->manual-->uploadEventFile--",ex);
                    objectToSend["error"]=true;
                    objectToSend["data"]="Server Side Error. Can't upload file at the moment "
                    res.end(JSON.stringify(objectToSend))
                }
               
            }
           
        });
       
        
    }
})


//////////////////////
//Request to start demo source system
router.post('/startDemoSrc',   function (req, res) {
    var obj=req.body;
    var objectToSend={}

    try{
        var ent_cd=obj.ent_cd;
        var ss_id=obj.ss_id;
        var ss_name=obj.ss_name;

        var sql="insert into demo_source_system (ss_id,ss_name,ent_cd) values('"+ss_id+"','"+ss_name+"','"+ent_cd+"')"

        conUserData.query(sql,function(error,results,fields){
            if(error){
                console.log("Error routes-->sources-->manual-->startDemoSrc--",error);
                objectToSend["error"]=true;
                objectToSend["data"]="Can't start demo source system a the moment"
                res.end(JSON.stringify(objectToSend))
            }else{
                payloads = [
                    { topic: 'auto_event', messages: "reload_data", partition: 0 }
                ];
                producer.send(payloads, function (err1, data1) {
                    if(err1){
                        console.log("Error routes-->sources-->manual-->startDemoSrc--",err1);
                        objectToSend["error"]=true;
                        objectToSend["data"]="Can't start demo source system a the moment"
                        res.end(JSON.stringify(objectToSend))
                    }else{
                        objectToSend["error"]=false;
                        objectToSend["data"]="Demo source system started"
                        res.end(JSON.stringify(objectToSend))
                    }
                    
            
                });
            }
        })

    }catch(ex){
        console.log("Error routes-->sources-->manual-->startDemoSrc--",ex);
        objectToSend["error"]=true;
        objectToSend["data"]="Can't start demo source system a the moment"
        res.end(JSON.stringify(objectToSend))
    }
});


//////////////////////
//Request to stop demo source system
router.delete('/stopDemoSrc:dtls',   function (req, res) {
    var obj=JSON.parse(req.params.dtls);
    var objectToSend={}

    try{
        var ent_cd=obj.ent_cd;
        var ss_id=obj.ss_id;
        var ss_name=obj.ss_name;

        var sql="delete from demo_source_system where ss_id='"+ss_id+"'"

        conUserData.query(sql,function(error,results,fields){
            if(error){
                console.log("Error routes-->sources-->manual-->stopDemoSrc--",error);
                objectToSend["error"]=true;
                objectToSend["data"]="Can't stop demo source system a the moment"
                res.end(JSON.stringify(objectToSend))
            }else{
                payloads = [
                        { topic: 'auto_event', messages: "reload_data", partition: 0 }
                ];
                producer.send(payloads, function (err1, data1) {
                    if(err1){
                        console.log("Error routes-->sources-->manual-->stopDemoSrc--",err1);
                        objectToSend["error"]=true;
                        objectToSend["data"]="Can't stop demo source system a the moment"
                        res.end(JSON.stringify(objectToSend))
                    }else{
                        objectToSend["error"]=false;
                        objectToSend["data"]="Demo source system stopped"
                        res.end(JSON.stringify(objectToSend))
                    }
                    
            
                });
                
            }
        })

    }catch(ex){
        console.log("Error routes-->sources-->manual-->stopDemoSrc--",ex);
        objectToSend["error"]=true;
        objectToSend["data"]="Can't stop demo source system a the moment"
        res.end(JSON.stringify(objectToSend))
    }
});


module.exports = router;
