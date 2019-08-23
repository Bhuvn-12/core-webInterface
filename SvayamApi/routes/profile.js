var express = require('express');
var router = express.Router();
var conSystemData = require('../connections/mysqlsystemdata.js');
var conUserData = require('../connections/mysqlUserData.js');
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


let upload = multer({ storage: storage }).single('pimage');



////////////////////
//Request to upload rule file
router.post('/uploadImage:dtl',   function (req, res) {
    console.log("calling profile image uploader")

    //upload.single('rulefile')

    var obj=JSON.parse(req.params.dtl);
    var objectToSend={};

    
    if (req.file!=undefined) {
        console.log("Error routes-->profile-->uploadImage--Investigate this error in upload--req is->",req);
        objectToSend["error"]=true;
        objectToSend["data"]="Front end error"
        res.end(JSON.stringify(objectToSend))
        
    } else {
        
        upload(req,res,function(err) {
            if(err) {
                console.log("Error routes-->profile-->uploadImage--",err);
                objectToSend["error"]=true;
                objectToSend["data"]="Server Side Error. Can't upload image at the moment "
                res.end(JSON.stringify(objectToSend))
                
            }else{

                try{

                    
                    var filename = obj.file_name;
                    var user_id=obj.user_id;




                    var localFile = './uploads/' + filename;
                    /* var remoteFileStream = hdfs.createWriteStream('/user/svayam/rules/' + filename);
                    localFileStream.pipe(remoteFileStream);
                    remoteFileStream.on('finish', function onFinish() {
                    }); */

                    var dir="./images/user_images/"+user_id;

                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }


                    var copyLoc="./images/user_images/"+user_id+"/"+"img.jpg";


                    fs.copyFile(localFile,copyLoc,{recursive:true},(err1) => {
                        if(err1){
                            console.log("Error routes-->profile-->uploadImage--",err1);
                            objectToSend["error"]=true;
                            objectToSend["data"]="Server Side Error. Can't upload image at the moment "
                            res.end(JSON.stringify(objectToSend))
                            
                        }else{

                            
                            objectToSend["error"]=false;
                            objectToSend["data"]="Image uploaded successfully"
                            res.send(JSON.stringify(objectToSend))

                            
                        }
                    });

                    
                }catch(ex){
                    console.log("Error routes-->profile-->uploadImage--",ex);
                    objectToSend["error"]=true;
                    objectToSend["data"]="Server Side Error. Can't upload file at the moment "
                    res.end(JSON.stringify(objectToSend))
                }
               
            }
           
        });
       
        
    }
})

/////////////////////////////
///Request to get profile image
router.post('/getProfileImage', function (req, res) {
    
 
    var obj=req.body;
    var user_id=obj.user_id;

    console.log(obj)

    var objectToSend={};
    

    try{
        /* var path="./images/"+user_id;
        var url="F:\SvayamTech\SvayamApi\images\1"+"\img.jpg";
 */
        fs.readFile("./images/user_images/"+user_id+"/img.jpg", function (err, content) {
            if (err) {
                console.log("Error routes-->profile-->getProfileImage--",err);
                objectToSend["error"]=true;
                objectToSend["data"]="Can't fetch profile image at the moment. Please try again later"
                res.end(JSON.stringify(objectToSend))
            } else {
                
                res.writeHead(200,{'Content-type':'image/jpg'});
                res.end(content);
            }
        });
        
        
        //res.sendFile("F:\SvayamTech\SvayamApi\images\1"+"\img.jpg");

    }catch(ex){
        console.log("Error routes-->profile-->getProfileImage--",ex);
        objectToSend["error"]=true;
        objectToSend["data"]="Can't fetch profile image at the moment. Please try again later"
        res.end(JSON.stringify(objectToSend))
    }

    
});



router.get('/getprofileinfo:dtls', (req, res) => {
    var value={};
    var userDtl = req.params.dtls;
    var sqlquery = "select user_id,f_name,l_name,email,phone_no,designation,country,state,postal_code,address1,address2 from user where user_id="+userDtl+"";
    conUserData.query(sqlquery, function (error, results, fields) {
        if (error) {
            console.log("Error routes-->profile-->getprofileinfo--",error);
            value['error']=true
            value['data']="Can't fetch profile right now. Please try again later";
            res.send(value)
        }
        else {
            value['error']=false
            value['data']=results;
            
            res.send(value);
        }
    });
});

router.post('/updateprofile', function (req, res) {
    var value={};
    var input = req.body;

    
    console.log(input);
    

    var query = "update user set f_name='" + input.firstname + "',l_name='" + input.lastname + "',email='" + input.email +"',phone_no='"+input.phone_number+"',designation='"+input.desgination+"',country='" + input.country + "',state='"+input.state+"',postal_code='"+input.code+"',address1='"+input.address1+"',address2='"+input.address2+"' where user_id='"+input.user_id+"'";
    
    console.log(query)
    conUserData.query(query, function (error, results) {
        if (error){
        console.log("Error routes-->profile-->updateprofile--",error);
        value['error']=true
        value['data']="Can't update your profile. Please try again later";
        res.send(value)
        }
        else {
            value['error']=false
            value['data']="Profile updated successfully";
            res.send(value)
           
        }
    });
});


router.put('/changepassword', function (req, res) {
    var value={};
    
    var input = req.body;
    console.log(input)
    

    var query = "select user_id from user where user_id='"+input.user_id+"' and password='"+input.oldPassword+"' ";
  //  console.log(query)
    conUserData.query(query, function (error, results) {
        if (error){
        value['error']=true
        value['data']="Server Side error. Can't update your password";
        }
        else {
            
            if(results.length>0){
                query="update user set password='"+input.newPassword+"' where user_id='"+input.user_id+"'";
                
                conUserData.query(query, function (error1, results1) {
                    
                    if (error1){
                    value['error']=true
                    value['data']="Server Side error. Can't update your password";
                    res.send(value)
                    }
                    else {
                        value['error']=false
                        value['data']="Password changed";
                        res.send(value)
                        console.log(results1); 
                    }
                });
            }
            else{
                
                value['error']=true
                value['data']="Old password is incorrect";
                res.send(value)
            }
            
        }
    });
});

            

router.post('/testFile', function (req, res) {
    console.log("Val--",req.body)
    res.send("Ok")
});





module.exports = router;
