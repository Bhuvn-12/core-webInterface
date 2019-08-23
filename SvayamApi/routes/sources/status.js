var express = require('express');
var router = express.Router();
var conUserData = require('../../connections/mysqlUserData.js');



//////////////
//Request to show source system
router.get('/getStateOfSrcSystem:dtls', (req, res) => {

    var ent_cd=req.params.dtls;
    var objectToSend={};
    var sqlQuery = "Select ss_id,ss_name,status,error_desc from source_system s left join source_error_info serr"
                    +" on s.error_code=serr.error_code where ent_cd='"+ent_cd+"'";
    conUserData.query(sqlQuery, function (error, results, fields) {
        if (error) {
            console.log("Error routes-->sources-->status-->getStateOfSrcSystem",error);
            objectToSend["error"]=true;
            objectToSend["data"]="Cant retrieve the state of source system"
            res.end(JSON.stringify(objectToSend))
        }
        else {
            objectToSend["error"]=false;
            objectToSend["data"]=results
            res.send(JSON.stringify(objectToSend))
        }
    });
})







module.exports = router;