var express = require('express');
var router = express.Router();
var conSystemData = require('../../../connections/mysqlsystemdata.js');
var conUserData = require('../../../connections/mysqlUserData.js');
var asyncjs = require('async');
var hiveconnection = require('../../../connections/hiveconnection.js');
hiveDbCon = hiveconnection.hivecon;
jdbcconnerr = hiveconnection.connerr;



///////////////////////                 //////////////////////////////
/////////////////////////GET REQUESTS/////////////////////////////////

//////////////
//Request to show customer heirarchy
router.get('/getCustomers:dtls', (req, res) => {

    var objectToSend={};

    if (jdbcconnerr == 1) {
        objectToSend["error"]=true;
        objectToSend["data"]="Some error occured while connecting to hive"
        res.send(JSON.stringify(objectToSend))
    }else{

        try{
            var ent_cd=req.params.dtls;
            var hiveRefAcc="Select * from ref_customer_type where org_unit_cd='"+ent_cd+"'";

            hiveDbCon.reserve(function (err, connObj) {
                if(err){
                    console.log("Error routes-->settings-->configuration-->referenceData-->getCustomers--",err)
                    objectToSend["error"]=true;
                    objectToSend["data"]="Can't fetch customer heirarchy at the moment"
                    res.send(JSON.stringify(objectToSend))
                }else{
                    if(connObj){

                        var conn = connObj.conn;

                        conn.createStatement(function (err1, statement) {
                            if (err1) {
                                console.log("Error routes-->settings-->configuration-->referenceData-->getCustomers--",err1)
                                objectToSend["error"]=true;
                                objectToSend["data"]="Can't fetch customer heirarchy at the moment"
                                res.send(JSON.stringify(objectToSend))
                            } else {
                                statement.executeQuery(hiveRefAcc,
                                    function (err2, rows) {
                                        if (err2) {
                                            console.log("Error routes-->settings-->configuration-->referenceData-->getCustomers--",err2)
                                            objectToSend["error"]=true;
                                            objectToSend["data"]="Can't fetch customer heirarchy at the moment"
                                            res.send(JSON.stringify(objectToSend))
                                        } else {
                                            rows.toObjArray(function(error,rs){
                                                if(error){
                                                    console.log("Error routes-->settings-->configuration-->referenceData-->getCustomers--",err2)
                                                    objectToSend["error"]=true;
                                                    objectToSend["data"]="Can't fetch customer heirarchy at the moment"
                                                    res.send(JSON.stringify(objectToSend))
                                                }else{
                                                    objectToSend["error"]=false;
                                                    objectToSend["data"]=rs
                                                    res.send(JSON.stringify(objectToSend))
                                                    hiveDb.release(connObj, function (err) {
                                                        if (err) {
                                                            console.log("Error routes-->settings-->configuration-->referenceData-->getCustomers--Error while releasing con",error8)
                                                        } else {
                                                            console.log("Hive conn released")
                                                        }
                                                    })
                                                }
                                                
                                            })
                                            
                                            
                                        }
                                });
                            }
                        });

                    }else{
                        console.log("Error routes-->settings-->configuration-->referenceData-->getCustomers--Problem with con object",connObj)
                        objectToSend["error"]=true;
                        objectToSend["data"]="Can't fetch customer heirarchy at the moment"
                        res.send(JSON.stringify(objectToSend))
                    }
                }
            });

        }catch(ex){
            console.log("Error routes-->settings-->configuration-->referenceData-->getCustomers--",ex)
            objectToSend["error"]=true;
            objectToSend["data"]="Can't fetch customer heirarchy at the moment"
            res.send(JSON.stringify(objectToSend))
        }
    }

});




//////////////
//Request to show chart of account heirarchy
router.get('/getAccounts:dtls', (req, res) => {

    var objectToSend={};

    if (jdbcconnerr == 1) {
        objectToSend["error"]=true;
        objectToSend["data"]="Some error occured while connecting to hive"
        res.send(JSON.stringify(objectToSend))
    }else{

        try{
            var ent_cd=req.params.dtls;
            var hiveRefAcc="Select * from ref_chart_of_acc where org_unit_cd='"+ent_cd+"'";

            hiveDbCon.reserve(function (err, connObj) {
                if(err){
                    console.log("Error routes-->settings-->configuration-->referenceData-->getAccounts--",err)
                    objectToSend["error"]=true;
                    objectToSend["data"]="Can't fetch chart of account heirarchy at the moment"
                    res.send(JSON.stringify(objectToSend))
                }else{
                    if(connObj){

                        var conn = connObj.conn;

                        conn.createStatement(function (err1, statement) {
                            if (err1) {
                                console.log("Error routes-->settings-->configuration-->referenceData-->getAccounts--",err1)
                                objectToSend["error"]=true;
                                objectToSend["data"]="Can't fetch chart of account heirarchy at the moment"
                                res.send(JSON.stringify(objectToSend))
                            } else {
                                statement.executeQuery(hiveRefAcc,
                                    function (err2, rows) {
                                        if (err2) {
                                            console.log("Error routes-->settings-->configuration-->referenceData-->getAccounts--",err2)
                                            objectToSend["error"]=true;
                                            objectToSend["data"]="Can't fetch chart of account heirarchy at the moment"
                                            res.send(JSON.stringify(objectToSend))
                                        } else {
                                            rows.toObjArray(function(error,rs){
                                                if(error){
                                                    console.log("Error routes-->settings-->configuration-->referenceData-->getAccounts--",err2)
                                                    objectToSend["error"]=true;
                                                    objectToSend["data"]="Can't fetch chart of account heirarchy at the moment"
                                                    res.send(JSON.stringify(objectToSend))
                                                }else{
                                                    objectToSend["error"]=false;
                                                    objectToSend["data"]=rs
                                                    res.send(JSON.stringify(objectToSend))
                                                    hiveDb.release(connObj, function (err) {
                                                        if (err) {
                                                            console.log("Error routes-->settings-->configuration-->referenceData-->getAccounts--Error while releasing con",error8)
                                                        } else {
                                                            console.log("Hive conn released")
                                                        }
                                                    })
                                                }
                                                
                                            })
                                            
                                            
                                        }
                                });
                            }
                        });

                    }else{
                        console.log("Error routes-->settings-->configuration-->referenceData-->getAccounts--Problem with con object",connObj)
                        objectToSend["error"]=true;
                        objectToSend["data"]="Can't fetch chart of account heirarchy at the moment"
                        res.send(JSON.stringify(objectToSend))
                    }
                }
            });

        }catch(ex){
            console.log("Error routes-->settings-->configuration-->referenceData-->getAccounts--",ex)
            objectToSend["error"]=true;
            objectToSend["data"]="Can't fetch chart of account heirarchy at the moment"
            res.send(JSON.stringify(objectToSend))
        }
    }

});




//////////////
//Request to show product heirarchy
router.get('/getProducts:dtls', (req, res) => {

    var objectToSend={};

    if (jdbcconnerr == 1) {
        objectToSend["error"]=true;
        objectToSend["data"]="Some error occured while connecting to hive"
        res.send(JSON.stringify(objectToSend))
    }else{

        try{
            var ent_cd=req.params.dtls;
            var hiveRefAcc="Select * from ref_product where org_unit_cd='"+ent_cd+"'";

            //console.log(hiveRefAcc)

            hiveDbCon.reserve(function (err, connObj) {
                if(err){
                    console.log("Error routes-->settings-->configuration-->referenceData-->getProducts--",err)
                    objectToSend["error"]=true;
                    objectToSend["data"]="Can't fetch product heirarchy at the moment"
                    res.send(JSON.stringify(objectToSend))
                }else{
                    if(connObj){

                        var conn = connObj.conn;

                        conn.createStatement(function (err1, statement) {
                            if (err1) {
                                console.log("Error routes-->settings-->configuration-->referenceData-->getProducts--",err1)
                                objectToSend["error"]=true;
                                objectToSend["data"]="Can't fetch product heirarchy at the moment"
                                res.send(JSON.stringify(objectToSend))
                            } else {
                                statement.executeQuery(hiveRefAcc,
                                    function (err2, rows) {
                                        if (err2) {
                                            console.log("Error routes-->settings-->configuration-->referenceData-->getProducts--",err2)
                                            objectToSend["error"]=true;
                                            objectToSend["data"]="Can't fetch product heirarchy at the moment"
                                            res.send(JSON.stringify(objectToSend))
                                        } else {
                                            rows.toObjArray(function(error,rs){
                                                if(error){
                                                    console.log("Error routes-->settings-->configuration-->referenceData-->getProducts--",err2)
                                                    objectToSend["error"]=true;
                                                    objectToSend["data"]="Can't fetch product heirarchy at the moment"
                                                    res.send(JSON.stringify(objectToSend))
                                                }else{
                                                    objectToSend["error"]=false;
                                                    //console.log(rs)
                                                    objectToSend["data"]=rs
                                                    res.send(JSON.stringify(objectToSend))
                                                    hiveDb.release(connObj, function (err) {
                                                        if (err) {
                                                            console.log("Error routes-->settings-->configuration-->referenceData-->getProducts--Error while releasing con",error8)
                                                        } else {
                                                            console.log("Hive conn released")
                                                        }
                                                    })
                                                }
                                                
                                            })
                                            
                                            
                                        }
                                });
                            }
                        });

                    }else{
                        console.log("Error routes-->settings-->configuration-->referenceData-->getProducts--Problem with con object",connObj)
                        objectToSend["error"]=true;
                        objectToSend["data"]="Can't fetch product heirarchy at the moment"
                        res.send(JSON.stringify(objectToSend))
                    }
                }
            });

        }catch(ex){
            console.log("Error routes-->settings-->configuration-->referenceData-->getProducts--",ex)
            objectToSend["error"]=true;
            objectToSend["data"]="Can't fetch product heirarchy at the moment"
            res.send(JSON.stringify(objectToSend))
        }
    }

});



///////////////////////                 //////////////////////////////
/////////////////////////POST REQUESTS/////////////////////////////////



////////////////////////
//Request to modify product's heirarchy
router.post('/modifyProductsRef', function (req, res) {

    var objectToSend={};

    if (jdbcconnerr == 1) {
        objectToSend["error"]=true;
        objectToSend["data"]="Some error occured while connecting to hive"
        res.send(JSON.stringify(objectToSend))
    }else{
        var obj=req.body;
          console.log(obj);
        var oldRow=obj["old"];
     console.log("**************old*******",oldRow)
        var newRow=obj["new"];
        console.log("************new *********",newRow)
        var ent_cd=oldRow.org_unit_cd;
    
        var leaf_cd=oldRow.leaf_cd

        var lvl1_desc=newRow.lvl1_desc;
        var lvl2_desc=newRow.lvl2_desc;
        var lvl3_desc=newRow.lvl3_desc;
        var lvl1_cd=newRow.lvl1_cd;

        lvl1_desc=(lvl1_desc==null)?null:"'"+lvl1_desc+"'"
        lvl2_desc=(lvl2_desc==null)?null:"'"+lvl2_desc+"'"
        lvl3_desc=(lvl3_desc==null)?null:"'"+lvl3_desc+"'"
        lvl1_cd=(lvl1_cd==null)?null:"'"+lvl1_cd+"'"



    
        var hive_updateProd="update ref_product set lvl1_desc="+lvl1_desc+", lvl2_desc="+lvl2_desc+", "
                            +" lvl3_desc="+lvl3_desc+", lvl1_cd="+lvl1_cd+","
                            +"leaf_desc="+lvl3_desc+" where org_unit_cd='"+ent_cd+"' and leaf_cd='"+leaf_cd+"'";

        try{
            hiveDbCon.reserve(function (err, connObj) {
                if(err){
                    console.log("Error routes-->settings-->configuration-->referenceData-->modifyProductsRef--",err)
                    objectToSend["error"]=true;
                    objectToSend["data"]="Can't modify products heirarchy at the moment"
                    res.send(JSON.stringify(objectToSend))
                }else{
                    if(connObj){

                        var conn = connObj.conn;

                        conn.createStatement(function (err1, statement) {
                            if (err1) {
                                console.log("Error routes-->settings-->configuration-->referenceData-->modifyProductsRef--",err1)
                                objectToSend["error"]=true;
                                objectToSend["data"]="Can't modify products heirarchy at the moment"
                                res.send(JSON.stringify(objectToSend))
                            } else {
                                statement.executeUpdate(hive_updateProd,
                                    function (err2, count) {
                                        if (err2) {
                                            console.log("Error routes-->settings-->configuration-->referenceData-->modifyProductsRef--",err2)
                                            objectToSend["error"]=true;
                                            objectToSend["data"]="Can't modify products heirarchy at the moment"
                                            res.send(JSON.stringify(objectToSend))
                                        } else {
                                            
                                            objectToSend["error"]=false;
                                            objectToSend["data"]="Product's Heirarchy Updated"
                                            res.send(JSON.stringify(objectToSend))
                                            hiveDb.release(connObj, function (err) {
                                                if (err) {
                                                    console.log("Error routes-->settings-->configuration-->referenceData-->modifyProductsRef--Error while releasing con",error8)
                                                } else {
                                                    console.log("Hive conn released")
                                                }
                                            })
                                            
                                            
                                        }
                                });
                            }
                        });

                    }else{
                        console.log("Error routes-->settings-->configuration-->referenceData-->modifyProductsRef--Problem with con object",connObj)
                        objectToSend["error"]=true;
                        objectToSend["data"]="Can't modify products heirarchy at the moment"
                        res.send(JSON.stringify(objectToSend))
                    }
                }
            });

        }catch(ex){
            console.log("Error routes-->settings-->configuration-->referenceData-->modifyProducts--",ex)
            objectToSend["error"]=true;
            objectToSend["data"]="Can't modify products heirarchy at the moment"
            res.send(JSON.stringify(objectToSend))
        }
    }

    


});



////////////////////////
//Request to modify customer's heirarchy
router.post('/modifyCustomersRef', function (req, res) {

    var objectToSend={};

    if (jdbcconnerr == 1) {
        objectToSend["error"]=true;
        objectToSend["data"]="Some error occured while connecting to hive"
        res.send(JSON.stringify(objectToSend))
    }else{
        var obj=req.body;
            console.log("************************",req.body)
        var oldRow=obj["old"];
    
        var newRow=obj["new"];
    
        var ent_cd=oldRow.org_unit_cd;
    
        var leaf_cd=oldRow.leaf_cd

        var lvl1_desc=newRow.lvl1_desc;
        var lvl2_desc=newRow.lvl2_desc;
        var lvl3_desc=newRow.lvl3_desc;
        var lvl1_cd=newRow.lvl1_cd;

        lvl1_desc=(lvl1_desc==null)?null:"'"+lvl1_desc+"'"
        lvl2_desc=(lvl2_desc==null)?null:"'"+lvl2_desc+"'"
        lvl3_desc=(lvl3_desc==null)?null:"'"+lvl3_desc+"'"
        lvl1_cd=(lvl1_cd==null)?null:"'"+lvl1_cd+"'"



    
        var hive_updateProd="update ref_customer_type set lvl1_desc="+lvl1_desc+", lvl2_desc="+lvl2_desc+", "
                            +" lvl3_desc="+lvl3_desc+", lvl1_cd="+lvl1_cd+","
                            +"leaf_desc="+lvl3_desc+" where org_unit_cd='"+ent_cd+"' and leaf_cd='"+leaf_cd+"'";

        try{
            hiveDbCon.reserve(function (err, connObj) {
                if(err){
                    console.log("Error routes-->settings-->configuration-->referenceData-->modifyCustomersRef--",err)
                    objectToSend["error"]=true;
                    objectToSend["data"]="Can't modify customer's heirarchy at the moment"
                    res.send(JSON.stringify(objectToSend))
                }else{
                    if(connObj){

                        var conn = connObj.conn;

                        conn.createStatement(function (err1, statement) {
                            if (err1) {
                                console.log("Error routes-->settings-->configuration-->referenceData-->modifyCustomersRef--",err1)
                                objectToSend["error"]=true;
                                objectToSend["data"]="Can't modify customer's heirarchy at the moment"
                                res.send(JSON.stringify(objectToSend))
                            } else {
                                statement.executeUpdate(hive_updateProd,
                                    function (err2, count) {
                                        if (err2) {
                                            console.log("Error routes-->settings-->configuration-->referenceData-->modifyCustomersRef--",err2)
                                            objectToSend["error"]=true;
                                            objectToSend["data"]="Can't modify customer's heirarchy at the moment"
                                            res.send(JSON.stringify(objectToSend))
                                        } else {
                                            
                                            objectToSend["error"]=false;
                                            objectToSend["data"]="Customer's Heirarchy Updated"
                                            res.send(JSON.stringify(objectToSend))
                                            hiveDb.release(connObj, function (err) {
                                                if (err) {
                                                    console.log("Error routes-->settings-->configuration-->referenceData-->modifyCustomersRef--Error while releasing con",error8)
                                                } else {
                                                    console.log("Hive conn released")
                                                }
                                            })
                                            
                                            
                                        }
                                });
                            }
                        });

                    }else{
                        console.log("Error routes-->settings-->configuration-->referenceData-->modifyCustomersRef--Problem with con object",connObj)
                        objectToSend["error"]=true;
                        objectToSend["data"]="Can't modify customer's heirarchy at the moment"
                        res.send(JSON.stringify(objectToSend))
                    }
                }
            });

        }catch(ex){
            console.log("Error routes-->settings-->configuration-->referenceData-->modifyCustomersRef--",ex)
            objectToSend["error"]=true;
            objectToSend["data"]="Can't modify customer's heirarchy at the moment"
            res.send(JSON.stringify(objectToSend))
        }
    }

    


});


////////////////////////
//Request to modify accounts's heirarchy
router.post('/modifyAccountsRef', function (req, res) {
    //console.log("modify Accounts",req.body);
    var objectToSend={};

    if (jdbcconnerr == 1) {
        objectToSend["error"]=true;
        objectToSend["data"]="Some error occured while connecting to hive"
        res.send(JSON.stringify(objectToSend))
    }else{
      
        var obj=req.body;
      //  console.log("object inside else",obj)
        var oldRow=obj.old;
       // console.log("old Accounts",oldRow);
    
        var newRow=obj["new"];
    
      //  console.log("new Accounts",newRow);
    
        var ent_cd=oldRow.org_unit_cd;
    
        var leaf_cd=oldRow.leaf_cd

        var lvl1_desc=newRow.lvl1_desc;
        var lvl2_desc=newRow.lvl2_desc;
        var lvl3_desc=newRow.lvl3_desc;
        var lvl4_desc=newRow.lvl4_desc;
        var lvl1_cd=newRow.lvl1_cd;

        lvl1_desc=(lvl1_desc==null)?null:"'"+lvl1_desc+"'"
        lvl2_desc=(lvl2_desc==null)?null:"'"+lvl2_desc+"'"
        lvl3_desc=(lvl3_desc==null)?null:"'"+lvl3_desc+"'"
        lvl4_desc=(lvl4_desc==null)?null:"'"+lvl4_desc+"'"
        lvl1_cd=(lvl1_cd==null)?null:"'"+lvl1_cd+"'"



    
        var hive_updateProd="update ref_chart_of_acc set lvl1_desc="+lvl1_desc+", lvl2_desc="+lvl2_desc+", "
                            +" lvl3_desc="+lvl3_desc+",lvl4_desc="+lvl4_desc+", lvl1_cd="+lvl1_cd+","
                            +"leaf_desc="+lvl4_desc+" where org_unit_cd='"+ent_cd+"' and leaf_cd='"+leaf_cd+"'";

                            console.log("**************************",hive_updateProd)
        try{
            hiveDbCon.reserve(function (err, connObj) {
                if(err){
                    console.log("Error routes-->settings-->configuration-->referenceData-->modifyAccountsRef--",err)
                    objectToSend["error"]=true;
                    objectToSend["data"]="Can't modify chart of account's heirarchy at the moment"
                    res.send(JSON.stringify(objectToSend))
                }else{
                    if(connObj){

                        var conn = connObj.conn;

                        conn.createStatement(function (err1, statement) {
                            if (err1) {
                                console.log("Error routes-->settings-->configuration-->referenceData-->modifyAccountsRef--",err1)
                                objectToSend["error"]=true;
                                objectToSend["data"]="Can't modify chart of account's heirarchy at the moment"
                                res.send(JSON.stringify(objectToSend))
                            } else {
                                statement.executeUpdate(hive_updateProd,
                                    function (err2, count) {
                                        if (err2) {
                                            console.log("Error routes-->settings-->configuration-->referenceData-->modifyAccountsRef--",err2)
                                            objectToSend["error"]=true;
                                            objectToSend["data"]="Can't modify chart of account's heirarchy at the moment"
                                            res.send(JSON.stringify(objectToSend))
                                        } else {
                                            
                                            objectToSend["error"]=false;
                                            objectToSend["data"]="Product's Heirarchy Updated"
                                            res.send(JSON.stringify(objectToSend))
                                            hiveDb.release(connObj, function (err) {
                                                if (err) {
                                                    console.log("Error routes-->settings-->configuration-->referenceData-->modifyAccountsRef--Error while releasing con",error8)
                                                } else {
                                                    console.log("Hive conn released")
                                                }
                                            })
                                            
                                            
                                        }
                                });
                            }
                        });

                    }else{
                        console.log("Error routes-->settings-->configuration-->referenceData-->modifyAccountsRef--Problem with con object",connObj)
                        objectToSend["error"]=true;
                        objectToSend["data"]="Can't modify chart of account's heirarchy at the moment"
                        res.send(JSON.stringify(objectToSend))
                    }
                }
            });

        }catch(ex){
            console.log("Error routes-->settings-->configuration-->referenceData-->modifyAccountsRef--",ex)
            objectToSend["error"]=true;
            objectToSend["data"]="Can't modify chart of account's heirarchy at the moment"
            res.send(JSON.stringify(objectToSend))
        }
    }

    


});


////////////////////////
//Request to delete customer's heirarchy
router.delete('/deleteCustomersRef:dtls', function (req, res) {

    console.log("delete customer Ref ",req.params.dtls)
    try{
        var obj=JSON.parse(req.params.dtls)

        var objectToSend={};

        var leaf_cd=obj.leaf_cd
        var org_unit_cd=obj.org_unit_cd

        var hiveDeleteCust="delete from ref_customer_type where leaf_cd='"+leaf_cd+"' and org_unit_cd='"+org_unit_cd+"'"

        hiveDbCon.reserve(function (err, connObj) {
            if(err){
                console.log("Error routes-->settings-->configuration-->referenceData-->deleteCustomersRef--",err)
                objectToSend["error"]=true;
                objectToSend["data"]="Can't delete record at the moment"
                res.send(JSON.stringify(objectToSend))
            }else{
                if(connObj){
                    var conn = connObj.conn;

                    conn.createStatement(function (err1, statement) {
                        if (err1) {
                            console.log("Error routes-->settings-->configuration-->referenceData-->deleteCustomersRef--",err1)
                            objectToSend["error"]=true;
                            objectToSend["data"]="Can't delete record at the moment"
                            res.send(JSON.stringify(objectToSend))
                        } else {
                            statement.executeUpdate(hiveDeleteCust,
                                function (err2, count) {
                                    if (err2) {
                                        console.log("Error routes-->settings-->configuration-->referenceData-->deleteCustomersRef--",err2)
                                        objectToSend["error"]=true;
                                        objectToSend["data"]="Can't delete record at the moment"
                                        res.send(JSON.stringify(objectToSend))
                                    } else {
                                        
                                        objectToSend["error"]=false;
                                        objectToSend["data"]="Record Deleted"
                                        res.send(JSON.stringify(objectToSend))
                                        hiveDb.release(connObj, function (err) {
                                            if (err) {
                                                console.log("Error routes-->settings-->configuration-->referenceData-->deleteCustomersRef--Error while releasing con",error8)
                                            } else {
                                                console.log("Hive conn released")
                                            }
                                        })
                                        
                                        
                                    }
                            });
                        }
                    });

                }else{
                    console.log("Error routes-->settings-->configuration-->referenceData-->deleteCustomersRef--ConnObject",connObj)
                    objectToSend["error"]=true;
                    objectToSend["data"]="Can't delete record at the moment"
                    res.send(JSON.stringify(objectToSend))
                }

            }
        });
    }catch(ex){
        console.log("Error routes-->settings-->configuration-->referenceData-->deleteCustomersRef--",ex)
        objectToSend["error"]=true;
        objectToSend["data"]="Server Side error"
        res.send(JSON.stringify(objectToSend))
    }

});


////////////////////////
//Request to delete product's heirarchy
router.delete('/deleteProductsRef:dtls', function (req, res) {

    console.log("deleteProductsRef  ",req.params.dtls)
    try{
        var obj=JSON.parse(req.params.dtls)

        var objectToSend={};

        var leaf_cd=obj.leaf_cd
        var org_unit_cd=obj.org_unit_cd

        var hiveDeleteProd="delete from ref_product where leaf_cd='"+leaf_cd+"' and org_unit_cd='"+org_unit_cd+"'"

        hiveDbCon.reserve(function (err, connObj) {
            if(err){
                console.log("Error routes-->settings-->configuration-->referenceData-->deleteProductsRef--",err)
                objectToSend["error"]=true;
                objectToSend["data"]="Can't delete record at the moment"
                res.send(JSON.stringify(objectToSend))
            }else{
                if(connObj){
                    var conn = connObj.conn;

                    conn.createStatement(function (err1, statement) {
                        if (err1) {
                            console.log("Error routes-->settings-->configuration-->referenceData-->deleteProductsRef--",err1)
                            objectToSend["error"]=true;
                            objectToSend["data"]="Can't delete record at the moment"
                            res.send(JSON.stringify(objectToSend))
                        } else {
                            statement.executeUpdate(hiveDeleteProd,
                                function (err2, count) {
                                    if (err2) {
                                        console.log("Error routes-->settings-->configuration-->referenceData-->deleteProductsRef--",err2)
                                        objectToSend["error"]=true;
                                        objectToSend["data"]="Can't delete record at the moment"
                                        res.send(JSON.stringify(objectToSend))
                                    } else {
                                        
                                        objectToSend["error"]=false;
                                        objectToSend["data"]="Record Deleted"
                                        res.send(JSON.stringify(objectToSend))
                                        hiveDb.release(connObj, function (err) {
                                            if (err) {
                                                console.log("Error routes-->settings-->configuration-->referenceData-->deleteProductsRef--Error while releasing con",error8)
                                            } else {
                                                console.log("Hive conn released")
                                            }
                                        })
                                        
                                        
                                    }
                            });
                        }
                    });

                }else{
                    console.log("Error routes-->settings-->configuration-->referenceData-->deleteProductsRef--ConnObject",connObj)
                    objectToSend["error"]=true;
                    objectToSend["data"]="Can't delete record at the moment"
                    res.send(JSON.stringify(objectToSend))
                }

            }
        });
    }catch(ex){
        console.log("Error routes-->settings-->configuration-->referenceData-->deleteProductsRef--",ex)
        objectToSend["error"]=true;
        objectToSend["data"]="Server Side error"
        res.send(JSON.stringify(objectToSend))
    }

});



////////////////////////
//Request to delete account's heirarchy
router.delete('/deleteAccountsRef:dtls', function (req, res) {
    console.log("deleteAccountsRef  ",req.params.dtls)
    try{
        var obj=JSON.parse(req.params.dtls)

        var objectToSend={};

        var leaf_cd=obj.leaf_cd
        var org_unit_cd=obj.org_unit_cd

        var hiveDeleteAcc="delete from ref_chart_of_acc where leaf_cd='"+leaf_cd+"' and org_unit_cd='"+org_unit_cd+"'"

        hiveDbCon.reserve(function (err, connObj) {
            if(err){
                console.log("Error routes-->settings-->configuration-->referenceData-->deleteAccountsRef--",err)
                objectToSend["error"]=true;
                objectToSend["data"]="Can't delete record at the moment"
                res.send(JSON.stringify(objectToSend))
            }else{
                if(connObj){
                    var conn = connObj.conn;

                    conn.createStatement(function (err1, statement) {
                        if (err1) {
                            console.log("Error routes-->settings-->configuration-->referenceData-->deleteAccountsRef--",err1)
                            objectToSend["error"]=true;
                            objectToSend["data"]="Can't delete record at the moment"
                            res.send(JSON.stringify(objectToSend))
                        } else {
                            statement.executeUpdate(hiveDeleteAcc,
                                function (err2, count) {
                                    if (err2) {
                                        console.log("Error routes-->settings-->configuration-->referenceData-->deleteAccountsRef--",err2)
                                        objectToSend["error"]=true;
                                        objectToSend["data"]="Can't delete record at the moment"
                                        res.send(JSON.stringify(objectToSend))
                                    } else {
                                        
                                        objectToSend["error"]=false;
                                        objectToSend["data"]="Record Deleted"
                                        res.send(JSON.stringify(objectToSend))
                                        hiveDb.release(connObj, function (err) {
                                            if (err) {
                                                console.log("Error routes-->settings-->configuration-->referenceData-->deleteAccountsRef--Error while releasing con",error8)
                                            } else {
                                                console.log("Hive conn released")
                                            }
                                        })
                                        
                                        
                                    }
                            });
                        }
                    });

                }else{
                    console.log("Error routes-->settings-->configuration-->referenceData-->deleteAccountsRef--ConnObject",connObj)
                    objectToSend["error"]=true;
                    objectToSend["data"]="Can't delete record at the moment"
                    res.send(JSON.stringify(objectToSend))
                }

            }
        });
    }catch(ex){
        console.log("Error routes-->settings-->configuration-->referenceData-->deleteAccountsRef--",ex)
        objectToSend["error"]=true;
        objectToSend["data"]="Server Side error"
        res.send(JSON.stringify(objectToSend))
    }

});




////////////////////////
//Request to add row in account's heirarchy
router.post('/addAccountsRef:dtls', function (req, res) {

    try{
        var obj=req.body

        var objectToSend={};

        
        var ent_cd=obj.ent_cd

        var hiveAccQuery="insert into ref_chart_of_acc (id,leaf_col_id,hierarchy_id,hierarchy_name,leaf_cd,leaf_desc,lvl1_cd,lvl1_desc,"
                            +"lvl2_cd,lvl2_desc,lvl3_cd,lvl3_desc,lvl4_cd,lvl4_desc,org_unit_cd) values"
        for(var i=0;i<obj.length;i++){
            var postData1=obj[i]

            var lvl1_cd=(postData1.lvl1_cd==null||postData1.lvl1_cd=="")?null:"'"+postData1.lvl1_cd+"'"
            var lvl1_desc=(postData1.lvl1_desc==null||postData1.lvl1_desc=="")?null:"'"+postData1.lvl1_desc+"'"
            var lvl2_cd=(postData1.lvl2_cd==null||postData1.lvl2_cd=="")?null:"'"+postData1.lvl2_cd+"'"
            var lvl2_desc=(postData1.lvl2_desc==null||postData1.lvl2_desc=="")?null:"'"+postData1.lvl2_desc+"'"
            var lvl3_cd=(postData1.lvl3_cd==null||postData1.lvl3_cd=="")?null:"'"+postData1.lvl3_cd+"'"
            var lvl3_desc=(postData1.lvl3_desc==null||postData1.lvl3_desc=="")?null:"'"+postData1.lvl3_desc+"'"
            var lvl4_cd=(postData1.lvl4_cd==null||postData1.lvl4_cd=="")?null:"'"+postData1.lvl4_cd+"'"
            var lvl4_desc=(postData1.lvl4_desc==null||postData1.lvl4_desc=="")?null:"'"+postData1.lvl4_desc+"'"

            if(i==obj.length-1){
                hiveAccQuery += "('" + postData1.id + "','" + i + "','ACC-001','Chart_of_Account-Hierarchy',"
                                + lvl4_cd + "," + lvl4_desc + ","+lvl1_cd+","+lvl1_desc+"," + 
                                lvl2_cd + "," + lvl2_desc + "," + lvl3_cd + "," + 
                                lvl3_desc + "," + lvl4_cd + "," + lvl4_desc + ",'" + 
                                ent_cd + "')"
            }else{
                hiveAccQuery += "('" + postData1.id + "','" + i + "','ACC-001','Chart_of_Account-Hierarchy',"
                                + lvl4_cd + "," + lvl4_desc + ","+lvl1_cd+","+lvl1_desc+"," + 
                                lvl2_cd + "," + lvl2_desc + "," + lvl3_cd + "," + 
                                lvl3_desc + "," + lvl4_cd + "," + lvl4_desc + ",'" + 
                                ent_cd + "'),"
            }
        }

        hiveDbCon.reserve(function (err, connObj) {
            if(err){
                console.log("Error routes-->settings-->configuration-->referenceData-->addAccountsRef--",err)
                objectToSend["error"]=true;
                objectToSend["data"]="Can't add record at the moment"
                res.send(JSON.stringify(objectToSend))
            }else{
                if(connObj){
                    var conn = connObj.conn;

                    conn.createStatement(function (err1, statement) {
                        if (err1) {
                            console.log("Error routes-->settings-->configuration-->referenceData-->addAccountsRef--",err1)
                            objectToSend["error"]=true;
                            objectToSend["data"]="Can't add record at the moment"
                            res.send(JSON.stringify(objectToSend))
                        } else {
                            statement.executeUpdate(hiveAccQuery,
                                function (err2, count) {
                                    if (err2) {
                                        console.log("Error routes-->settings-->configuration-->referenceData-->addAccountsRef--",err2)
                                        objectToSend["error"]=true;
                                        objectToSend["data"]="Can't add record at the moment"
                                        res.send(JSON.stringify(objectToSend))
                                    } else {
                                        
                                        objectToSend["error"]=false;
                                        objectToSend["data"]="Record(s) Added"
                                        res.send(JSON.stringify(objectToSend))
                                        hiveDb.release(connObj, function (err) {
                                            if (err) {
                                                console.log("Error routes-->settings-->configuration-->referenceData-->addAccountsRef--Error while releasing con",error8)
                                            } else {
                                                console.log("Hive conn released")
                                            }
                                        })
                                        
                                        
                                    }
                            });
                        }
                    });

                }else{
                    console.log("Error routes-->settings-->configuration-->referenceData-->addAccountsRef--ConnObject",connObj)
                    objectToSend["error"]=true;
                    objectToSend["data"]="Can't add record at the moment"
                    res.send(JSON.stringify(objectToSend))
                }

            }
        });
    }catch(ex){
        console.log("Error routes-->settings-->configuration-->referenceData-->addAccountsRef--",ex)
        objectToSend["error"]=true;
        objectToSend["data"]="Server Side error"
        res.send(JSON.stringify(objectToSend))
    }

});


////////////////////////
//Request to add row in customer's heirarchy
router.post('/addCustomersRef:dtls', function (req, res) {

    try{
        
        var obj=req.body

        var objectToSend={};

        
        var ent_cd=obj.ent_cd

        var hiveCustQuery="insert into ref_customer_type (id,leaf_col_id,hierarchy_id,hierarchy_name,leaf_cd,leaf_desc,lvl1_cd,lvl1_desc,"
                            +"lvl2_cd,lvl2_desc,lvl3_cd,lvl3_desc,org_unit_cd)  values"

        for(var i=0;i<obj.length;i++){
            var postData1=obj[i]

            var lvl1_cd=(postData1.lvl1_cd==null||postData1.lvl1_cd=="")?null:"'"+postData1.lvl1_cd+"'"
            var lvl1_desc=(postData1.lvl1_desc==null||postData1.lvl1_desc=="")?null:"'"+postData1.lvl1_desc+"'"
            var lvl2_cd=(postData1.lvl2_cd==null||postData1.lvl2_cd=="")?null:"'"+postData1.lvl2_cd+"'"
            var lvl2_desc=(postData1.lvl2_desc==null||postData1.lvl2_desc=="")?null:"'"+postData1.lvl2_desc+"'"
            var lvl3_cd=(postData1.lvl3_cd==null||postData1.lvl3_cd=="")?null:"'"+postData1.lvl3_cd+"'"
            var lvl3_desc=(postData1.lvl3_desc==null||postData1.lvl3_desc=="")?null:"'"+postData1.lvl3_desc+"'"
            

            if(i==obj.length-1){
                hiveCustQuery += "('" + postData1.id + "','Detail Customer Type Code','CUSTHRC-001','Customer-Type-Hierarchy',"
                                + lvl3_cd + "," + lvl3_desc + ","+lvl1_cd+","+lvl1_desc+"," + 
                                lvl2_cd + "," + lvl2_desc + "," + lvl3_cd + "," + 
                                lvl3_desc + ",'" + 
                                ent_cd + "')"

                
            }else{
                hiveCustQuery += "('" + postData1.id + "','Detail Customer Type Code','CUSTHRC-001','Customer-Type-Hierarchy',"
                                + lvl3_cd + "," + lvl3_desc + ","+lvl1_cd+","+lvl1_desc+"," + 
                                lvl2_cd + "," + lvl2_desc + "," + lvl3_cd + "," + 
                                lvl3_desc + ",'" + 
                                ent_cd + "'),"
            }
        }

        hiveDbCon.reserve(function (err, connObj) {
            if(err){
                console.log("Error routes-->settings-->configuration-->referenceData-->addCustomersRef--",err)
                objectToSend["error"]=true;
                objectToSend["data"]="Can't add record at the moment"
                res.send(JSON.stringify(objectToSend))
            }else{
                if(connObj){
                    var conn = connObj.conn;

                    conn.createStatement(function (err1, statement) {
                        if (err1) {
                            console.log("Error routes-->settings-->configuration-->referenceData-->addCustomersRef--",err1)
                            objectToSend["error"]=true;
                            objectToSend["data"]="Can't add record at the moment"
                            res.send(JSON.stringify(objectToSend))
                        } else {
                            statement.executeUpdate(hiveCustQuery,
                                function (err2, count) {
                                    if (err2) {
                                        console.log("Error routes-->settings-->configuration-->referenceData-->addCustomersRef--",err2)
                                        objectToSend["error"]=true;
                                        objectToSend["data"]="Can't add record at the moment"
                                        res.send(JSON.stringify(objectToSend))
                                    } else {
                                        
                                        objectToSend["error"]=false;
                                        objectToSend["data"]="Record(s) Added"
                                        res.send(JSON.stringify(objectToSend))
                                        hiveDb.release(connObj, function (err) {
                                            if (err) {
                                                console.log("Error routes-->settings-->configuration-->referenceData-->addCustomersRef--Error while releasing con",error8)
                                            } else {
                                                console.log("Hive conn released")
                                            }
                                        })
                                        
                                        
                                    }
                            });
                        }
                    });

                }else{
                    console.log("Error routes-->settings-->configuration-->referenceData-->addCustomersRef--ConnObject",connObj)
                    objectToSend["error"]=true;
                    objectToSend["data"]="Can't add record at the moment"
                    res.send(JSON.stringify(objectToSend))
                }

            }
        });
    }catch(ex){
        console.log("Error routes-->settings-->configuration-->referenceData-->addCustomersRef--",ex)
        objectToSend["error"]=true;
        objectToSend["data"]="Server Side error"
        res.send(JSON.stringify(objectToSend))
    }

});



////////////////////////
//Request to add row in products's heirarchy
router.post('/addProductsRef:dtls', function (req, res) {

    try{
        
        var obj=req.body

        var objectToSend={};

        
        var ent_cd=obj.ent_cd

        var hiveProdQuery="insert into ref_product (id,leaf_col_id,hierarchy_id,hierarchy_name,leaf_cd,leaf_desc,lvl1_cd,lvl1_desc,"
                            +"lvl2_cd,lvl2_desc,lvl3_cd,lvl3_desc,org_unit_cd)  values"

        for(var i=0;i<obj.length;i++){
            var postData1=obj[i]

            var lvl1_cd=(postData1.lvl1_cd==null||postData1.lvl1_cd=="")?null:"'"+postData1.lvl1_cd+"'"
            var lvl1_desc=(postData1.lvl1_desc==null||postData1.lvl1_desc=="")?null:"'"+postData1.lvl1_desc+"'"
            var lvl2_cd=(postData1.lvl2_cd==null||postData1.lvl2_cd=="")?null:"'"+postData1.lvl2_cd+"'"
            var lvl2_desc=(postData1.lvl2_desc==null||postData1.lvl2_desc=="")?null:"'"+postData1.lvl2_desc+"'"
            var lvl3_cd=(postData1.lvl3_cd==null||postData1.lvl3_cd=="")?null:"'"+postData1.lvl3_cd+"'"
            var lvl3_desc=(postData1.lvl3_desc==null||postData1.lvl3_desc=="")?null:"'"+postData1.lvl3_desc+"'"
            

            if(i==obj.length-1){
                hiveProdQuery += "('" + postData1.id + "','Detail Product Code','PRDCT-001','Product-Hierarchy',"
                                + lvl3_cd + "," + lvl3_desc + ","+lvl1_cd+","+lvl1_desc+"," + 
                                lvl2_cd + "," + lvl2_desc + "," + lvl3_cd + "," + 
                                lvl3_desc + ",'" + 
                                ent_cd + "')"

                
            }else{
                hiveProdQuery += "('" + postData1.id + "','Detail Product Code','PRDCT-001','Product-Hierarchy',"
                                + lvl3_cd + "," + lvl3_desc + ","+lvl1_cd+","+lvl1_desc+"," + 
                                lvl2_cd + "," + lvl2_desc + "," + lvl3_cd + "," + 
                                lvl3_desc + ",'" + 
                                ent_cd + "'),"
            }
        }

        hiveDbCon.reserve(function (err, connObj) {
            if(err){
                console.log("Error routes-->settings-->configuration-->referenceData-->addProductsRef--",err)
                objectToSend["error"]=true;
                objectToSend["data"]="Can't add record at the moment"
                res.send(JSON.stringify(objectToSend))
            }else{
                if(connObj){
                    var conn = connObj.conn;

                    conn.createStatement(function (err1, statement) {
                        if (err1) {
                            console.log("Error routes-->settings-->configuration-->referenceData-->addProductsRef--",err1)
                            objectToSend["error"]=true;
                            objectToSend["data"]="Can't add record at the moment"
                            res.send(JSON.stringify(objectToSend))
                        } else {
                            statement.executeUpdate(hiveProdQuery,
                                function (err2, count) {
                                    if (err2) {
                                        console.log("Error routes-->settings-->configuration-->referenceData-->addProductsRef--",err2)
                                        objectToSend["error"]=true;
                                        objectToSend["data"]="Can't add record at the moment"
                                        res.send(JSON.stringify(objectToSend))
                                    } else {
                                        
                                        objectToSend["error"]=false;
                                        objectToSend["data"]="Record(s) Added"
                                        res.send(JSON.stringify(objectToSend))
                                        hiveDb.release(connObj, function (err) {
                                            if (err) {
                                                console.log("Error routes-->settings-->configuration-->referenceData-->addProductsRef--Error while releasing con",error8)
                                            } else {
                                                console.log("Hive conn released")
                                            }
                                        })
                                        
                                        
                                    }
                            });
                        }
                    });

                }else{
                    console.log("Error routes-->settings-->configuration-->referenceData-->addProductsRef--ConnObject",connObj)
                    objectToSend["error"]=true;
                    objectToSend["data"]="Can't add record at the moment"
                    res.send(JSON.stringify(objectToSend))
                }

            }
        });
    }catch(ex){
        console.log("Error routes-->settings-->configuration-->referenceData-->addProductsRef--",ex)
        objectToSend["error"]=true;
        objectToSend["data"]="Server Side error"
        res.send(JSON.stringify(objectToSend))
    }

});


module.exports=router;