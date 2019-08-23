var express = require('express');
var router = express.Router();
var conProcessingData = require('../connections/mysqlPrcessingDbCon.js');
var conUserData = require('../connections/mysqlUserData.js');


/////////////////////////
//Request to obtain all ppd(s)
router.get('/getAllPpd', (req, res) => {
    var objectToSend={}

    var sql_getAllPpd="Select DATE_FORMAT(ppd,'%Y-%m-%d') as ppd,CASE when current_timestamp between valid_start_ts and valid_end_ts"
                        +" then true "
                        +" else false "
                        +" end as isCurrent from "
                        +" ppd_realtime_ctl";

    conUserData.query(sql_getAllPpd, function (error, results, fields) {
        if (error) {
            console.log("Error routes-->operations-->getAllPpd--",error);
            objectToSend['error']=true
            objectToSend['data']="Can't fetch processing dates. Please try again later";
            res.end(JSON.stringify(objectToSend))
        }else{
            objectToSend['error']=false
            objectToSend['data']=results;
            res.send(JSON.stringify(objectToSend))
        }
    });


});


/////////////////////////
//Request to obtain counts
router.get('/getProcessCounts:dtls', (req, res) => {

    //console.log("getProcessCounts  :",req.params)
    var obj=JSON.parse(req.params.dtls);

    var ent_cd=obj.ent_cd;
    var ppd=obj.ppd;

    var objectToSend={};

    var sql_count="Select name,num_of_records,ppd from stream_status where ppd='"+ppd+"' and org_unit_cd='"+ent_cd+"'";

    conProcessingData.query(sql_count, function (error, results, fields) {
        if (error) {
            console.log("Error routes-->operations-->getProcessCounts--",error);
            objectToSend['error']=true
            objectToSend['data']="Can't fetch counts. Please try again later";
            res.end(JSON.stringify(objectToSend))
        }else{
            objectToSend['error']=false
            objectToSend['data']=results;
            res.send(JSON.stringify(objectToSend))
        }
    });

});



/////////////////////////
//Request to obtain active processes
router.get('/getActiveProcess:dtls', (req, res) => {

    //console.log("getActiveProcess  :",req.params)
    var  objectToSend={};

    var ent_cd=req.params.dtls;

    var sql_getActiveProcess="Select process_name,is_active from process where rpt_unit='"+ent_cd+"'"

    
    conProcessingData.query(sql_getActiveProcess, function (error, results, fields) {
        if (error) {
            console.log("Error routes-->operations-->getActiveProcesses--",error);
            objectToSend['error']=true
            objectToSend['data']="Can't fetch active processes. Please try again later";
            res.end(JSON.stringify(objectToSend))
        }else{
            objectToSend['error']=false
            objectToSend['data']=results;
            res.send(JSON.stringify(objectToSend))
        }
    });
});



/////////////////////////
//Request to change status of process
router.post('/changeState', (req, res) => {

    var input=req.body;

    console.log(input)

    var ent_cd=input.ent_cd;
    var process_name=input.process_name;
    var is_active=(input.activity=='Activate')?"true":"false";

    var objectToSend={};

    var sql_updateStatus="update process set is_active='"+is_active+"' where process_name='"+process_name+"' and rpt_unit='"+ent_cd+"'";

    console.log(sql_updateStatus)
    conProcessingData.query(sql_updateStatus, function (error, results, fields) {
        if (error) {
            console.log("Error routes-->operations-->getActiveProcesses--",error);
            objectToSend['error']=true
            if(is_active=='false'){
                objectToSend['data']="Can't deactivate process right now. Please try again later";
            }else{
                objectToSend['data']="Can't activate process right now. Please try again later";
            }
            
            res.end(JSON.stringify(objectToSend))
        }else{

            var sql_reloadInd="update reload_info set is_reload='true'"
            conProcessingData.query(sql_reloadInd, function (error1, results1, fields) {
                if (error1) {
                    console.log("Error routes-->operations-->getActiveProcesses--",error1);
                    objectToSend['error']=true
                    if(is_active=='false'){
                        objectToSend['data']="Can't deactivate process right now. Please try again later";
                    }else{
                        objectToSend['data']="Can't activate process right now. Please try again later";
                    }
                    
                    res.end(JSON.stringify(objectToSend))
                }else{
                    objectToSend['error']=false
                    if(is_active=='false'){
                        objectToSend['data']="Process Deactivated";
                    }else{
                        objectToSend['data']="Process Activated";
                    }
                    
                    res.send(JSON.stringify(objectToSend))

                }
            });
            
        }
    });

});


module.exports = router;
