var express = require('express');
var router = express.Router();
var conSystemData = require('../connections/mysqlsystemdata.js');
var conUserData = require('../connections/mysqlUserData.js');
const fs=require('fs');



/////////////////////////
///Request to sign up

router.post('/signUp', function (req, res) {
    
    var input = req.body;

    var objectToSend={};

    /* var input={};
    input["email"]="s@t";
    input["password"]="123456"
    input["key"]="123456789" */

    
    console.log(input);
    
    
    
    if (input.key != '') {
        key = input.key.trim();

        var getInvitedUserInfo="Select *,current_timestamp as ct from invitation_info where inv_key='"+key+"' and key_state='ACTIVE'";

        conUserData.query(getInvitedUserInfo, function (error, results) {
            if (error) {
                console.log("Error routes-->signup-->signUp--",error);
                objectToSend["error"]=true;
                objectToSend["data"]="Some error occured while setting up your account. Please try again later"
                res.end(JSON.stringify(objectToSend))
            }else{
                if(results.length<1){
                    objectToSend["error"]=true;
                    objectToSend["data"]="Either key is invalid or it is not active anymore"
                    res.end(JSON.stringify(objectToSend))
                }else{

                   
                    
                    var acct_id=results[0].acct_id;
                    var role_id=results[0].role_id;
                    var email=results[0].email;
                    var ent_cd=results[0].ent_cd;

                    var end_time=new Date(results[0].ct).getTime();
                    var creation_time=new Date(results[0].sent_time).getTime();

                    var hours=(((end_time-creation_time)/(60*60*1000))|0)

                    
                    if(hours>24){
                        objectToSend["error"]=true;
                        objectToSend["data"]="Key Expired"
                        res.end(JSON.stringify(objectToSend))
                        
                    }else if(email!=input.email){
                        objectToSend["error"]=true;
                        objectToSend["data"]="Email mismatch"
                        res.end(JSON.stringify(objectToSend))
                        
                    }else{
                        var sql_insertUserInfo="insert into user (email,password,acct_id) values"
                                    +" ('"+email+"','"+input.password+"','"+acct_id+"')";

                        conUserData.query(sql_insertUserInfo, function (error1, results1) {
                            if (error1) {
                                console.log("Error routes-->signup-->signUp--",error1);
                                objectToSend["error"]=true;
                                objectToSend["data"]="Server Side Error"
                                res.end(JSON.stringify(objectToSend))
                                
                            }else{
                                
                                var sql_getNewUserId="Select * from user where email='"+email+"'";
                                conUserData.query(sql_getNewUserId, function (error2, results2) {
                                    if (error2) {
                                        console.log("Error routes-->signup-->signUp--",error2);
                                        objectToSend["error"]=true;
                                        objectToSend["data"]="Server Side Error"
                                        res.end(JSON.stringify(objectToSend))
                                    }else{
                                        var new_uid=results2[0].user_id;

                                        var sql_insertUser_x_le_x_role="";

                                        if(role_id!='R3'){
                                            sql_insertUser_x_le_x_role="insert into user_xref_legal_entity_xref_role (user_id,ent_cd,role_id)"
                                            +" values('"+new_uid+"','"+ent_cd+"','"+role_id+"')"
                                        }else{
                                            sql_insertUser_x_le_x_role="insert into user_xref_legal_entity_xref_role (user_id,role_id)"
                                            +" values('"+new_uid+"','"+role_id+"')"
                                        }

                                        conUserData.query(sql_insertUser_x_le_x_role, function (error3, results3) {
                                            if (error3) {
                                                console.log("Error routes-->signup-->signUp--",error3);
                                                objectToSend["error"]=true;
                                                objectToSend["data"]="Server Side Error"
                                                res.end(JSON.stringify(objectToSend))
                                            }else{
                                                var sql_deactivateKey="update invitation_info set key_state='INACTIVE' where inv_key='"+key+"'";
                                                conUserData.query(sql_deactivateKey, function (error5, results5) {
                                                    if (error5) {
                                                        console.log("Error routes-->signup-->signUp--",error5);
                                                        //res.end(JSON.stringify("error"))
                                                    }else{
                                                        console.log("Successfully deactivated key-"+key)
                                                    }
                                                });

                                                var profileImgDir="./images/user_images/"+new_uid;
                                                var acctImgDir="./images/account_images/"+acct_id;

                                                if (!fs.existsSync(profileImgDir)) {
                                                    fs.mkdirSync(profileImgDir);
                                                }

                                                if (!fs.existsSync(acctImgDir)) {
                                                    fs.mkdirSync(acctImgDir);
                                                }

                                                var copyLoc="./images/user_images/"+new_uid+"/"+"img.jpg";
                                                var sourceLoc="./images/default.jpg";

                                                var acctImgSource="./images/default_account.jpg";
                                                var acctImgeDest="./images/account_images/"+acct_id+"/"+"img.jpg";


                                                fs.copyFile(sourceLoc,copyLoc,{recursive:true},(err1) => {
                                                    if(err1){
                                                        console.log("Error routes-->profile-->uploadImage--",err1);
                                                        objectToSend["error"]=true;
                                                        objectToSend["data"]="Server Side Error"
                                                        res.end(JSON.stringify(objectToSend))
                                                        
                                                    }else{
                                                        fs.copyFile(acctImgSource,acctImgeDest,{recursive:true},(err2) => {
                                                            if(err2){
                                                                console.log("Error routes-->profile-->uploadImage--",err2);
                                                                objectToSend["error"]=true;
                                                                objectToSend["data"]="Server Side Error"
                                                                res.end(JSON.stringify(objectToSend))
                                                                
                                                            }else{
                                    
                                                                
                                                                objectToSend["error"]=false;
                                                                objectToSend["data"]="Signup Successful"
                                                                res.send(JSON.stringify(objectToSend))
                                    
                                                                
                                                            }
                                                        });
                                                        
                                                        
                                                        
                                                    }
                                                });

                                                
                                            }

                                        });

                                        
                                        
                                    }
                                });
                            }
                        });
                        
                    }
                }
                
            }
        });

        
    }
    else {
        conUserData.query(" select max(acct_id) as id  from user", function (error, results) {
            if (error){
                console.log("Error routes-->signup-->signUp--",error);
                res.end(JSON.stringify("error"))
            }else {
                var acct_id="";
                var role_id="R2";
                var email=input.email;
                var new_uid="";
                if (results[0].id == null)
                    acct_id = 10000;
                else {
                    acct_id = results[0].id + 1;
                }
                var sql_insertUserInfo="insert into user (email,password,acct_id) values"
                                    +" ('"+email+"','"+input.password+"','"+acct_id+"')";

                conUserData.query(sql_insertUserInfo, function (error1, results1) {
                    if (error1){
                        console.log("Error routes-->signup-->signUp--",error1);
                        objectToSend["error"]=true;
                        objectToSend["data"]="Some error occured. Please try again later"
                        res.end(JSON.stringify(objectToSend))
                    }else{
                        var sql_getNewUserId="Select * from user where email='"+email+"'";
                        conUserData.query(sql_getNewUserId, function (error2, results2) {
                            if (error2){
                                console.log("Error routes-->signup-->signUp--",error2);
                                objectToSend["error"]=true;
                                objectToSend["data"]="Server SIde Error"
                                res.end(JSON.stringify(objectToSend))
                            }else{
                                new_uid=results2[0].user_id;
                                var sql_insertUser_x_le_role="insert into user_xref_legal_entity_xref_role (user_id,role_id) values"
                                                                +" ('"+new_uid+"','"+role_id+"')"
                                conUserData.query(sql_insertUser_x_le_role, function (error3, results3) {
                                    if (error3){
                                        console.log("Error routes-->signup-->signUp--",error3);
                                        objectToSend["error"]=true;
                                        objectToSend["data"]="Server SIde Error"
                                        res.end(JSON.stringify(objectToSend))
                                    }else{
                                        var profileImgDir="./images/user_images/"+new_uid;
                                        var acctImgDir="./images/account_images/"+acct_id;

                                        if (!fs.existsSync(profileImgDir)) {
                                            fs.mkdirSync(profileImgDir);
                                        }
                                        if (!fs.existsSync(acctImgDir)) {
                                            fs.mkdirSync(acctImgDir);
                                        }

                                        var copyLoc="./images/user_images/"+new_uid+"/"+"img.jpg";
                                        var sourceLoc="./images/default.jpg";

                                        var acctImgSource="./images/default_account.jpg";
                                        var acctImgeDest="./images/account_images/"+acct_id+"/"+"img.jpg";

                                        fs.copyFile(sourceLoc,copyLoc,{recursive:true},(err1) => {
                                            if(err1){
                                                console.log("Error routes-->profile-->uploadImage--",err1);
                                                objectToSend["error"]=true;
                                                objectToSend["data"]="Server Side Error"
                                                res.end(JSON.stringify(objectToSend))
                                                
                                            }else{
                                                fs.copyFile(acctImgSource,acctImgeDest,{recursive:true},(err2) => {
                                                    if(err2){
                                                        console.log("Error routes-->profile-->uploadImage--",err2);
                                                        objectToSend["error"]=true;
                                                        objectToSend["data"]="Server Side Error"
                                                        res.end(JSON.stringify(objectToSend))
                                                        
                                                    }else{
                            
                                                        
                                                        objectToSend["error"]=false;
                                                        objectToSend["data"]="Signup Successful"
                                                        res.send(JSON.stringify(objectToSend))
                            
                                                        
                                                    }
                                                });
                                                
                                                
                                                
                                            }
                                        });
                                        
                                    }
                                });
                            }
                        });
                    }
                });
            }
           
        });
    };
});









module.exports = router;
