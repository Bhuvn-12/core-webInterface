var express = require('express');
var router = express.Router();
var conSystemData = require('../../connections/mysqlsystemdata.js');
var conUserData = require('../../connections/mysqllegalentity.js');
var hiveconnection = require('../../connections/hiveconnection.js');
var asyncjs = require('async');



router.get('/reporting_fields:ent_cd', function (req, res) {
    var ent_cd =req.params.ent_cd;
    var data={};
    var values={};
    console.log(ent_cd);
       conUserData.query("select base_currency,gaap,(select group_concat(ppd) from ppd_realtime_ctl) as ppd from reporting_unit where ent_cd ='" + ent_cd + "'", function (error, results) {
           if (error) {
               console.log('Error routes-->reports-->reporting_fields')
               res.send(JSON.stringify("Erorr"))
               values['error']=true;
               values['data']=error;
           }
           else {
               console.log('Succesfull Query')
              // console.log(rows);
              console.log(results[0]);
              data['base_currency']=results[0].base_currency;
              var list_ppd=results[0].ppd;
              list_ppd=list_ppd.split(",");
              var arr_ppd=[];

              for(var i=0;i<list_ppd.length;i++){
                arr_ppd[i]=list_ppd[i];
             }
             data['ppd']=arr_ppd;
              var gaplist=results[0].gaap;
             var gaaps= gaplist.split(",");
             console.log(gaaps)
             var gaap=[];

             for(var i=0;i<gaaps.length;i++){
                gaap[i]=gaaps[i];
             }
             data['gaap']=gaap;
               values['error']=false;
               values['data']=data;
               res.send(values);
           }
       });
   });


   router.get('/reporting_accounts:ent_cd', function (req, res) {
    var ent_cd =req.params.ent_cd;
    var data={};
    var values={};
    console.log(ent_cd);
       conUserData.query("select distinct account_number as acct_num,acct_desc from accounts where ent_cd ='" + ent_cd + "'", function (error, results) {
           if (error) {
               console.log('Error routes-->reports-->reporting_fields')
               res.send(JSON.stringify("Erorr"))
               values['error']=true;
               values['data']=error;
           }
           else {
               values['error']=false;
               values['data']=results;
               res.send(values);
               }
       });
   });
   module.exports = router;   