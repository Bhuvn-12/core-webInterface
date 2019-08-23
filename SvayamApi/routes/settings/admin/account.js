var express = require('express');
var router = express.Router();
var conUserData = require('../../../connections/mysqlUserData.js');
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


let upload = multer({ storage: storage }).single('aimage');



////////////////////
//Request to upload rule file
router.post('/uploadAccountImage:dtl',   function (req, res) {
    console.log("calling account image uploader")

    //upload.single('rulefile')

    var obj=JSON.parse(req.params.dtl);
    var objectToSend={};

    
    if (req.file!=undefined) {
        console.log("Error routes-->settings-->admin-->account-->getaccountInfo--Investigate this error in upload--req is->",req);
        objectToSend["error"]=true;
        objectToSend["data"]="Front end error"
        res.end(JSON.stringify(objectToSend))
        
    } else {
        
        upload(req,res,function(err) {
            if(err) {
                console.log("Error routes-->settings-->admin-->account-->getaccountInfo", err);
                objectToSend["error"]=true;
                objectToSend["data"]="Server Side Error. Can't upload image at the moment "
                res.end(JSON.stringify(objectToSend))
                
            }else{

                try{

                    
                    var filename = obj.file_name;
                    var acct_id=obj.acct_id;

                    var localFile = './uploads/' + filename;
                    /* var remoteFileStream = hdfs.createWriteStream('/user/svayam/rules/' + filename);
                    localFileStream.pipe(remoteFileStream);
                    remoteFileStream.on('finish', function onFinish() {
                    }); */

                    var dir="./images/account_images/"+acct_id;

                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }


                    var copyLoc="./images/account_images/"+acct_id+"/"+"img.jpg";
console.log(localFile+"  "+copyLoc);


                    fs.copyFile(localFile,copyLoc,{recursive:true},(err1) => {
                        if(err1){
                            console.log("Error routes-->settings-->admin-->account-->getaccountInfo--",err1);
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
                    console.log("Error routes-->settings-->admin-->account-->getaccountInfo--",ex);
                    objectToSend["error"]=true;
                    objectToSend["data"]="Server Side Error. Can't upload file at the moment "
                    res.end(JSON.stringify(objectToSend))
                }
               
            }
           
        });
       
        
    }
})




router.get('/getaccountInfo:id', (req, res) => {
    var value = {};
    var userid = req.params.id;
    var sqlquery = "select acct_name,acct_id from user where user_id='" + userid + "'";
    conUserData.query(sqlquery, function (error, results, fields) {
        if (error) {
            console.log("Error routes-->settings-->admin-->account-->getaccountInfo", error);
            value['error'] = true
            value['data'] = "Can't fetch accountInfo right now. Please try again later";
            res.send(JSON.stringify(value))
        }
        else {
            value['error'] = false
            value['data'] = results;
            res.send(JSON.stringify(value));
            
        }
    });
});

router.post('/updateaccountInfo', function (req, res) {
    var value = {};
    var input = req.body;
    //input['acct_name']='abc'
    //input['user_id']=1
    //var query = "update user set acct_name='" + input.acct_name + "' where acct_id = (Select * from (select acct_id from user where user_id='" + input.user_id + "')t)";
    var query = "update user set acct_name='" + input.acct_name + "' where acct_id = '" + input.acct_id + "'";
    conUserData.query(query, function (error, results) {
        if (error) {
            console.log("Error routes-->settings-->admin-->account-->updateaccountInfo", error);
            value['error'] = true
            value['data'] = "Can't update your account. Please try again later";
            res.send(value)
        }
        else {
            value['error'] = false
            value['data'] = "Account updated successfully";
            res.send(value)

        }
    });
});




/////////////////////////////
///Request to get account image
router.post('/getAccountImage', function (req, res) {
    
 
    var obj=req.body;
    var acct_id=obj.acct_id;

    console.log(obj)

    var objectToSend={};
    

    try{
        
        fs.readFile("./images/account_images/"+acct_id+"/img.jpg", function (err, content) {
            if (err) {
                console.log("Error routes-->settings-->admin-->account-->getAccountImage--",err);
                objectToSend["error"]=true;
                objectToSend["data"]="Can't fetch account image at the moment. Please try again later"
                res.end(JSON.stringify(objectToSend))
            } else {
                
                res.writeHead(200,{'Content-type':'image/jpg'});
                res.end(content);
            }
        });
        
        
        //res.sendFile("F:\SvayamTech\SvayamApi\images\1"+"\img.jpg");

    }catch(ex){
        console.log("Error routes-->settings-->admin-->account-->getAccountImage--",ex);
        objectToSend["error"]=true;
        objectToSend["data"]="Can't fetch account image at the moment. Please try again later"
        res.end(JSON.stringify(objectToSend))
    }

    
});


module.exports = router;
