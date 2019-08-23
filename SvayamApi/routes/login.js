var express = require('express');
var router = express.Router();
var conSystemData = require('../connections/mysqlsystemdata.js');
var conUserData = require('../connections/mysqlUserData.js');
var mailer = require('nodemailer');


var systemDataDbName=require('../config_con.js').system_data_database;

var senderEmail="sanjaiv12345@gmail.com";

var smtpTransport = mailer.createTransport({
    service: "Gmail",
    auth: {
        user: senderEmail,
        pass: "Sanjaiv90@"
    }
});



router.get('/getAfterLoginInfo:dtls', (req, res) => {

    var obj=JSON.parse(req.params.dtls);
    var objectToSend={}

    var data={};


    var email=obj.email;
    var password=obj.password;

    var sql_userInfo="Select * from user where email='"+email+"' and password='"+password.trim()+"'";

    conUserData.query(sql_userInfo, function (error1, results1, fields) {
        if (error1) {
            console.log("Error routes-->login-->login",error1);
            objectToSend["error"]=true;
            objectToSend["data"]="Error while logging in. Please try again later"
            res.end(JSON.stringify(objectToSend))
        }else if(results1.length<1){
            objectToSend["error"]=true;
            objectToSend["data"]="Wrong Email or password"
            res.end(JSON.stringify(objectToSend))
        }else{
            var tempObj={};
            var user_id=results1[0].user_id;
            tempObj["user_id"]=results1[0].user_id
            tempObj["acct_id"]=results1[0].acct_id
            tempObj["acct_name"]=results1[0].acct_name
            tempObj["email"]=results1[0].email
tempObj['f_name']=results1[0].f_name;
tempObj['l_name']=results1[0].l_name;

            data["user_info"]=tempObj;

            var sql_checkLe="Select count(*) as numLe from user_xref_legal_entity_xref_role where user_id='"+user_id+"' and ent_cd is not null";
            conUserData.query(sql_checkLe, function (error, results, fields1) {
                if (error) {
                    console.log("Error routes-->login-->login",error);
                    objectToSend["error"]=true;
                    objectToSend["data"]="Error while logging in. Please try again later"
                    res.end(JSON.stringify(objectToSend))
                }else{
                    var numOfLe=results[0].numLe;

                    if(numOfLe==0){
                        
                        var sqlQuery="Select u.ent_cd,r.role_id,r.role_name,res.resource_id,res.resource_name,"
                                            +" group_concat(rxrxp.permission_id) as perms from "
                                            +" (Select * from user_xref_legal_entity_xref_role where user_id='"+user_id+"') u "
                                            +" join "+systemDataDbName+".role_xref_resource_xref_perms rxrxp on u.role_id=rxrxp.role_id join role r"
                                            +"  on u.role_id=r.role_id join "+systemDataDbName+".resource res on rxrxp.resource_id=res.resource_id"
                                            +" "
                                            +" group by r.role_id,r.role_name,res.resource_name,u.ent_cd";
                        
                        conUserData.query(sqlQuery,function(error2,results2,fields2){
                            if (error2) {
                                console.log("Error routes-->login-->login",error2);
                                objectToSend["error"]=true;
                                objectToSend["data"]="Error while logging in. Please try again later"
                                res.end(JSON.stringify(objectToSend))
                            }else{
                                var temp={};
                                temp["ent_cd"]="";
                                temp["role_id"]=results2[0].role_id;
                                temp["role_name"]=results2[0].role_name;
                                temp["ent_desc"]="";
                                var tempRes=[]
                                for(var i=0;i<results2.length;i++){
                                    var obj1={};
                                    obj1["resource_id"]=results2[i].resource_id;
                                    obj1["resource_name"]=results2[i].resource_name;
                                    obj1["permission_id"]=results2[i].perms;

                                    tempRes[i]=obj1;
                                }
                                temp["resource_info"]=tempRes;
                                data["ent_info"]=[];
                                data["ent_info"][0]=temp;

                                data["isLegalEntityPresent"]=false;
                                objectToSend["error"]=false;
                                objectToSend["data"]=data;
                                res.end(JSON.stringify(objectToSend))


                            }
                        });

                    }else{
                        var sqlQuery="Select u.ent_cd,rpt.ent_desc,r.role_id,r.role_name,res.resource_id,res.resource_name,"
                                            +" group_concat(rxrxp.permission_id) as perms from "
                                            +" (Select * from user_xref_legal_entity_xref_role where user_id='"+user_id+"') u "
                                            +" join "+systemDataDbName+".role_xref_resource_xref_perms rxrxp on u.role_id=rxrxp.role_id join role r"
                                            +"  on u.role_id=r.role_id join "+systemDataDbName+".resource res on rxrxp.resource_id=res.resource_id"
                                            +" join reporting_unit rpt on u.ent_cd=rpt.ent_cd "
                                            +" where u.ent_cd is not null "
                                            +" group by rpt.ent_desc,r.role_id,r.role_name,res.resource_name,u.ent_cd order by u.ent_cd";


                        conUserData.query(sqlQuery,function(error2,results2,fields2){
                            if (error2) {
                                console.log("Error routes-->login-->login",error2);
                                objectToSend["error"]=true;
                                objectToSend["data"]="Error while logging in. Please try again later"
                                res.end(JSON.stringify(objectToSend))
                            }else{
                                var entArr=[]
                                var t="";
                                var index=0;
                                var j=0;
                                for(var k=0;k<results2.length;k++){
                                    
                                    if(t==""||t!=results2[k].ent_cd){
                                        var temp={};
                                        t=results2[k].ent_cd;
                                        temp["ent_cd"]=results2[k].ent_cd;
                                        temp["role_id"]=results2[k].role_id;
                                        temp["role_name"]=results2[k].role_name;
                                        temp["ent_desc"]=results2[k].ent_desc;
                                        
                                        var tempRes=[]
                                        for(var i=index;i<results2.length;i++){
                                            var obj1={};
                                            if(results2[i].ent_cd!=t){
                                                index=i;
                                                break;
                                            }
                                            obj1["resource_id"]=results2[i].resource_id;
                                            obj1["resource_name"]=results2[i].resource_name;
                                            obj1["permission_id"]=results2[i].perms;

                                            tempRes.push(obj1);
                                        }
                                        temp["resource_info"]=tempRes;
                                        entArr[j++]=temp;


                                    }
                                    /* var temp={};
                                    temp["ent_cd"]=results2[k].ent_cd;
                                    temp["role_id"]=results2[k].role_id;
                                    temp["role_name"]=results2[k].role_name;
                                    var tempRes=[]
                                    for(var i=0;i<results2.length;i++){
                                        var obj1={};
                                        obj1["resource_id"]=results2[i].resource_id;
                                        obj1["resource_name"]=results2[i].resource_name;
                                        obj1["permission_id"]=results2[i].perms;

                                        tempRes[i]=obj1;
                                    }
                                    temp["resource_info"]=tempRes;
                                    entArr[k]=temp; */
                                }
                                data["ent_info"]=entArr;

                                data["isLegalEntityPresent"]=true;

                                objectToSend["error"]=false;
                                objectToSend["data"]=data;
                                res.end(JSON.stringify(objectToSend))
                                
                            }
                        });
                    }
                }

            });


        }
    });
    
});




router.post('/sendUserPassword', function (req, res) {
    var useInfo=req.body;
    console.log("called ",useInfo)
    var objectToSend={};
    conUserData.query("select email,password from user where email='"+useInfo.email+"'", function (error, results) {
        var password;
        var recieverEmail;
        console.log("Results ",results)

        if(error){
            console.log("Error routes-->login-->sendUserPassword",error);
            objectToSend["error"]=true;
            objectToSend["data"]="Can't process yor request right now.Please try again later"
            res.end(JSON.stringify(objectToSend))
        }else if(results.length==0){
            objectToSend["error"]=true;
            objectToSend["data"]="No account with this email is present"
            res.end(JSON.stringify(objectToSend))
        }else{

            try{
            
                password=results[0]["password"]
                recieverEmail=results[0]["email"]

                

                
                console.log("Reciever is ",recieverEmail)

                var mail = {
                    from: senderEmail,
                    to: recieverEmail,
                    subject: "Sensitive Information",
                    text: "Your Password IS::> "+password
                    

                }
                smtpTransport.sendMail(mail, function (error2, info) {
                    if (error2) {
                        
                        console.log("Error routes-->login-->sendUserPassword",error2);
                        objectToSend["error"]=true;
                        objectToSend["data"]="Can't process yor request right now.Please try again later"
                        res.end(JSON.stringify(objectToSend))
                    } else {
                        console.log("Message sent: " + info.response);
                        
                        objectToSend["error"]=false;
                        objectToSend["data"]="Password sent to your registered email"
                        res.end(JSON.stringify(objectToSend))
                    }
                    
                    
                });
            }catch(ex){
                console.log("Error routes-->login-->sendUserPassword",ex);
                objectToSend["error"]=true;
                objectToSend["data"]="Can't process yor request right now.Please try again later"
                res.end(JSON.stringify(objectToSend))
            }
        }

    });

    
});






module.exports = router;
