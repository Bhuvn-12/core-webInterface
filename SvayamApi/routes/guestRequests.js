var express = require('express');
var router = express.Router();
var conSystemData = require('../connections/mysqlsystemdata.js');


////////////////////
//Request to save guest's comment
router.post('/saveGuestInfo',   function (req, res) {
    var obj=req.body;

    var value={};

    var sql="insert into guest (f_name,l_name,email,comment) values ('"+obj.fname+"','"+obj.lname+"','"+obj.email+"','"+obj.text+"')"

    conSystemData.query(sql, function (error, results) {
        if (error){
            console.log("Error routes-->website-->saveGuestInfo--",error);
            value['error']=true
            value['data']="Can't send your message right now.Please try again later";
            res.send(JSON.stringify(value))
        }
        else {
            value['error']=false
            value['data']="Message sent!! We will get back to you as soon as we can.";
            res.send(JSON.stringify(value))
           
        }
    });

});


module.exports=router;