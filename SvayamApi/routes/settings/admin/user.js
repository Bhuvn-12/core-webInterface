var express = require('express');
var router = express.Router();
var conSystemData = require('../../../connections/mysqlsystemdata.js');
var conUserData = require('../../../connections/mysqlUserData.js');
var mailer = require('nodemailer');
var propObj=require('../../../config_con.js');

var sign_up_page = propObj.sign_up_page;

//mailer block
var senderEmail = "sanjaiv12345@gmail.com";
var smtpTransport = mailer.createTransport({
    service: "Gmail",
    auth: {
        user: senderEmail,
        pass: "Sanjaiv90@"
    }
});



//////////////
//Request to show user info
router.get('/getAllUsersInfo:dtls', (req, res) => {

    var objectToSend={};
    var user_id=req.params.dtls;
    /* var sqlQuery = "Select u.user_id,u.name,u.email,uxl.ent_cd,rpt.ent_desc,r.role_id,r.role_name from "
                   +" (Select user_id,concat(f_name,' ',l_name) as name,email from "
                   +"  user where acct_id=(Select acct_id from user where user_id='"+user_id+"')) u "
                   +"  join user_xref_legal_entity_xref_role uxl on u.user_id=uxl.user_id"
                   +"  join reporting_unit rpt on uxl.ent_cd = rpt.ent_cd join user_xref_role uxr on u.user_id=uxr.user_id join role r"
                   +"  on uxr.role_id=r.role_id  order by uxl.ent_cd"; */

    var sqlQuery="Select  u.user_id,u.name,u.email,u.acct_name, rpt.ent_cd,rpt.ent_desc,r.role_id,r.role_name from"
                    +" (Select user_id,concat(f_name,' ',l_name) as name, email,acct_name from user"
                    +" where acct_id=(Select acct_id from user where user_id='"+user_id+"'))u join"
                    +" (Select * from user_xref_legal_entity_xref_role where ent_cd is not null) uxlxr"
                    +" on u.user_id=uxlxr.user_id join reporting_unit rpt on uxlxr.ent_cd=rpt.ent_cd join role r on uxlxr.role_id=r.role_id"
                    +" order by ent_cd ";
    
    conUserData.query(sqlQuery, function (error, results1, fields) {
        if (error) {
            console.log("Error routes-->settings-->admin-->user-->getAllUsersOfAccount",error);
            objectToSend["error"]=true;
            objectToSend["data"]="Cant retrieve Users of this account at the moment"
            res.end(JSON.stringify(objectToSend))
        }
        else {
            
            objectToSend["error"]=false;
            objectToSend["data"]=results1
            res.send(JSON.stringify(objectToSend))
            
        }
    });
})



//////////////
//Request to get all roles
router.get('/getRoles', (req, res) => {

    var objectToSend={};
    var sqlQuery = "Select role_id ,role_name from role where role_id not in ('R1','R2','R6')";
    conSystemData.query(sqlQuery, function (error, results, fields) {
        if (error) {
            console.log("Error routes-->settings-->admin-->user-->getRoles",error);
            objectToSend["error"]=true;
            objectToSend["data"]="Can't fetch roles at the moment"
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
//Request to delete reference of legal entity for user
router.post('/deleteLeRefrence', function (req, res) {
    var obj=req.body;

    var objectToSend={};

    try{

        var ent_cd=obj.ent_cd;
        var user_id=obj.user_id;
        var role_id=obj.role_id;

        var sql_deleteRef="delete from user_xref_legal_entity_xref_role where user_id='"+user_id+"' and ent_cd='"+ent_cd+"' and role_id='"+role_id+"'";

        conUserData.query(sql_deleteRef, function (error, results, fields) {
            if (error) {
                console.log("Error routes-->settings-->admin-->user-->deleteLeRefrence",error);
                objectToSend["error"]=true;
                objectToSend["data"]="Can't delete reference at the moment"
                res.end(JSON.stringify(objectToSend))
            }else{
                objectToSend["error"]=false;
                objectToSend["data"]="Deleted this legal entity for user"
                res.send(JSON.stringify(objectToSend))
            }
        });
    }catch(ex){
        console.log("Error routes-->settings-->admin-->user-->deleteLeRefrence",error);
        objectToSend["error"]=true;
        objectToSend["data"]="Can't delete reference at the moment"
        res.end(JSON.stringify(objectToSend))
    }
});

//////////////
//Request to get all users under account admin
router.get('/getUsers:dtls', (req, res) => {

    var user_id=req.params.dtls;

    var objectToSend={};
    var sqlQuery = "Select user_id,concat(f_name,' ',l_name) as name from user where acct_id=(Select acct_id from user where user_id='"+user_id+"') and user_id!='"+user_id+"'";
    conUserData.query(sqlQuery, function (error, results, fields) {
        if (error) {
            console.log("Error routes-->settings-->admin-->user-->getUsers",error);
            objectToSend["error"]=true;
            objectToSend["data"]="Can't fetch users at the moment"
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
//Request to send an invitation
router.post('/inviteUser', (req, res) => {

    var obj = req.body;

    //console.log(obj)

    var objectToSend={};

    var key =(Date.now()/10000 | 0)+"";

    try{
        
        var email=obj.email;
        var role_id=obj.role_id;
        var role_name=obj.role_name
        var host_user_id=obj.user_id;

        var ent_cd="";
        

        


        conUserData.query("select * from user where user_id='" + host_user_id + "'", function (error1, user) {
            if (error1) {
                console.log("Error routes-->settings-->admin-->user-->inviteUser",error1);
                objectToSend["error"]=true;
                objectToSend["data"]="Some error occured at the server side"
                res.end(JSON.stringify(objectToSend))
            }else{
                var acct_id=user[0].acct_id;
                var f_name=user[0].f_name;
                var l_name=user[0].l_name;
                var host_email=user[0].email;
                var query="";
                if(role_id!='R3'){
                    ent_cd=obj.ent_cd
                    query="insert into invitation_info (inv_key,email,ent_cd,role_id,acct_id)"
                        +" values('"+key+"','"+email+"','"+ent_cd+"','"+role_id+"','"+acct_id+"')";
                }else{
        
                    query="insert into invitation_info (inv_key,email,role_id,acct_id)"
                        +" values('"+key+"','"+email+"','"+role_id+"','"+acct_id+"')";
                }
                //console.log(query)
                conUserData.query(query, function (error, results, fields) {
                    if (error) {
                        console.log("Error routes-->settings-->admin-->user-->inviteUser",error);
                        objectToSend["error"]=true;
                        objectToSend["data"]="Some error occured at the server side"
                        res.end(JSON.stringify(objectToSend))
                    }
                    else{
                        var mail = {
                            from: host_email,
                            to: email,
                            subject: "Invitation from " + f_name + " " + l_name,
                            text: "",
                            html: " " + f_name + " " + l_name + " invited you to join <b>Svayam FPEM <b>" + sign_up_page + "<br> For <b>"+role_name+"<b> role. Use the following key to signup. Key will expire in 24 hrs. <br><b>KEY<b>:" + key 
            
                        }
                        smtpTransport.sendMail(mail, function (error2, response) {
                            if (error2) {
                                console.log("Error routes-->settings-->admin-->user-->inviteUser",error2);
                                objectToSend["error"]=true;
                                objectToSend["data"]="Cant send mail to "+email
                                res.end(JSON.stringify(objectToSend))
                            } else {
                                console.log("Message sent: " + response);
                                objectToSend["error"]=false;
                                objectToSend["data"]="Invitation sent to "+email;
                                res.send(JSON.stringify(objectToSend))
                            }
                            smtpTransport.close();
                            
                        });
                    }
                });
            }

        });


   

    }catch(ex){
        console.log("Error routes-->settings-->admin-->user-->catch-->inviteUser--",ex)
        objectToSend["error"]=true;
        objectToSend["data"]="Some error occured at the server side"
        res.end(JSON.stringify(objectToSend))
    }


});



//////////////
//Request to add legal entity and role
router.post('/addLegalEntityAndRoleForUser', (req, res) => {

    var obj = req.body;
    var objectToSend={};

    try{

        var ent_cd=obj.ent_cd;
        var role_id=obj.role_id;
        var user_id=obj.user_id;

        var sql_insertUserXLe="";
        if(role_id=='R3'){

            sql_insertUserXLe="insert into user_xref_legal_entity_xref_role (user_id,role_id) values "
                            +" ('"+user_id+"','"+role_id+"')";
        }else{
            sql_insertUserXLe="insert into user_xref_legal_entity_xref_role (user_id,ent_cd,role_id) values "
                            +" ('"+user_id+"','"+ent_cd+"','"+role_id+"')";
        }

        

        conUserData.query(sql_insertUserXLe, function (error, results, fields) {
            if (error) {
                console.log("Error routes-->settings-->admin-->user-->addLegalEntityAndRole",error);
                objectToSend["error"]=true;
                objectToSend["data"]="Cannot add legal entity and role right now"
                res.end(JSON.stringify(objectToSend))
            }else{
                
                
                objectToSend["error"]=false;
                objectToSend["data"]="Added user to legel entity"
                res.end(JSON.stringify(objectToSend))
                
                
            }
        });

    }catch(ex){

        console.log("Error routes-->settings-->admin-->user-->catch-->addLegalEntityAndRole--",ex)
        objectToSend["error"]=true;
        objectToSend["data"]="Some error occured at the server side"
        res.end(JSON.stringify(objectToSend))
    }



});



//////////////
//Request to add legal entity and role
router.post('/modifyUser', (req, res) => {
    var obj=req.body;
    var objectToSend={};

    try{
        var oldRow=obj.old_row;
        var newRow=obj.new_row;

        var user_id=oldRow.user_id;

        

        var sql="";

        if(oldRow.email!=newRow.email){
            sql+="update user set email='"+newRow.email+"' where user_id='"+user_id+"';";
        }
        if(oldRow.ent_cd!=newRow.ent_cd){
            sql+="update user_xref_legal_entity_xref_role set ent_cd='"+newRow.ent_cd+"',role_id='"+newRow.role_id+"' where user_id='"+user_id+"' and ent_cd='"+oldRow.ent_cd+"';";
        }
        if(oldRow.role_id!=newRow.role_id){
            sql+="update user_xref_legal_entity_xref_role set ent_cd='"+newRow.ent_cd+"',role_id='"+newRow.role_id+"' where user_id='"+user_id+"' and ent_cd='"+oldRow.ent_cd+"';";
        
        }

        if(sql!=""){

            sql=sql.substring(0,sql.length-1);

            conUserData.query(sql, function (error, results, fields) {
                if (error) {
                    console.log("Error routes-->settings-->admin-->user-->modifyUser",error);
                    objectToSend["error"]=true;
                    objectToSend["data"]="Can't update user's information at the moment"
                    res.end(JSON.stringify(objectToSend))
                }else{
                    objectToSend["error"]=false;
                    objectToSend["data"]="Modified User Information"
                    res.end(JSON.stringify(objectToSend))
                }
            });
        }else{
            objectToSend["error"]=false;
            objectToSend["data"]="Nothing to modify"
            res.end(JSON.stringify(objectToSend))
        }

        

    }catch(ex){
        console.log("Error routes-->settings-->admin-->user-->catch-->modifyUser--",ex)
        objectToSend["error"]=true;
        objectToSend["data"]="Some error occured at the server side"
        res.end(JSON.stringify(objectToSend))
    }

});


module.exports = router;