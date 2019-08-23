var express = require('express');
var router = express.Router();
var conUserData = require('../../../connections/mysqlUserData.js');
var propObj = require('../../../config_con.js');


router.post('/updateAccControl', (req, res) => {
    var obj=req.body;

    var objectToSend={};


    try{

        var ent_cd=obj.ent_cd.trim();
    

        var sql_updateAccCtrl="update accounting_control set fp_start_month='"+obj.st_mon+"', fp_start_year='"+obj.st_year+"', "
                            +"fp_end_month='"+obj.end_mon+"', fp_end_year='"+obj.end_year+"' where ent_cd='"+ent_cd+"' "

        console.log(sql_updateAccCtrl)
        conUserData.query(sql_updateAccCtrl,function(error,result,fields){
            if(error){
                console.log("Error routes-->settings-->configuration-->accounting Control-->updateAccControl", error);
                objectToSend["error"]=true;
                objectToSend["data"]="Can't update accounting control at the moment."
                res.send(JSON.stringify(objectToSend))
            }else{
                objectToSend["error"]=false;
                objectToSend["data"]="Acounting control updated."
                res.send(JSON.stringify(objectToSend))
            }
        })
    }catch(ex){
        console.log("Error routes-->settings-->configuration-->accounting Control-->updateAccControl", ex);
        objectToSend["error"]=true;
        objectToSend["data"]="Can't update accounting control at the moment."
        res.send(JSON.stringify(objectToSend))
    }
});


router.get('/getAccControl:dtls', (req, res) => {
    var ent_cd=req.params.dtls;

    var objectToSend={}

    try{

        var sql="Select *,(Select DATE_FORMAT(ppd,'%Y-%m-%d') from ppd_realtime_ctl where current_timestamp between valid_start_ts and valid_end_ts) as ppd"
                        +" from accounting_control where ent_cd='"+ent_cd+"'"
                    
        conUserData.query(sql,function(error,results,fields){
            if(error){
                console.log("Error routes-->settings-->configuration-->accounting Control-->getAccControl", error);
                objectToSend["error"]=true;
                objectToSend["data"]="Can't fetch accounting control info at the moment."
                res.send(JSON.stringify(objectToSend))
            }else if(results.length<1){
                objectToSend["error"]=false;
                objectToSend["data"]=[];
                res.send(JSON.stringify(objectToSend))
            }else{
                objectToSend["error"]=false;
                objectToSend["data"]=results;
                res.send(JSON.stringify(objectToSend))
            }
        })
    }catch(ex){
        console.log("Error routes-->settings-->configuration-->accounting Control-->getAccControl", ex);
        objectToSend["error"]=true;
        objectToSend["data"]="Can't fetch accounting control info at the moment."
        res.send(JSON.stringify(objectToSend))
    }
});











module.exports = router;
