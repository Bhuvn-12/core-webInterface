var express = require('express');
var router = express.Router();
var ruleEngineCon=require('../../connections/mysqlRuleEngineDbCon.js')
var conUserData = require('../../connections/mysqlUserData.js');
var asyncjs = require('async');
var hiveconnection = require('../../connections/hiveconnection.js');
hiveDbCon = hiveconnection.hivecon;
jdbcconnerr = hiveconnection.connerr;
var producer = require('../../connections/kafkaconnection.js');


/////////////////////////////////////
//////SORCE SYSTEM CREATION REQUESTS
/////////////////////////////////////



//////////////
//Request to add source system
router.post('/addSrcSystem', (req, res) => {

    var obj=req.body;
    console.log(obj)

    try{
        var objectToSend={}

        var query="insert into source_system (ent_cd,ss_name) values('"+obj.ent_cd+"','"+obj.ss_name+"')"

        conUserData.query(query,function(error,results){
            if(error){
                console.log("Error-->routes-->sources-->sourcesAndRule-->addSrcSystem--",error)
                objectToSend["error"]=true
                objectToSend["data"]="Can't insert source system info at the moment.Please try again later. If problem persists, call support"
                res.send(objectToSend);
            }else{
                objectToSend["error"]=false
                objectToSend["data"]=results.insertId
                res.send(objectToSend);
            }
        })
    }catch(ex){
        console.log("Error-->routes-->sources-->sourcesAndRule-->addSrcSystem--",ex)
        objectToSend["error"]=true
        objectToSend["data"]="Can't insert source system info at the moment.Please try again later. If problem persists, call support"
        res.send(objectToSend);
    }

})


//////////////
//Request to add product
router.post('/addProducts', (req, res) => {

    var obj=req.body;
    var objectToSend={}

    console.log(obj)

    if (jdbcconnerr == 1) {
        objectToSend["error"]=true;
        objectToSend["data"]="Some error occured while connecting to hive"
        res.send(JSON.stringify(objectToSend))
    }else{
        try{
            
    
            var ss_id=(obj.ss_id==null)?null:"'"+obj.ss_id+"'"
            var ent_cd=(obj.ent_cd==null)?null:"'"+obj.ent_cd+"'"
            var prod_cd=(obj.prod_cd==null)?null:"'"+obj.prod_cd+"'"
            var prod_desc=(obj.prod_desc==null)?null:"'"+obj.prod_desc+"'"
            var dtl_prod_cd=(obj.dtl_prod_cd==null)?null:"'"+obj.dtl_prod_cd+"'"
            var dtl_prod_desc=(obj.dtl_prod_desc==null)?null:"'"+obj.dtl_prod_desc+"'"
            var obset=(obj.off_balance_sheet_exposure_type==null)?null:"'"+obj.off_balance_sheet_exposure_type+"'"
            var ccf=(obj.credit_conversion_factor==null)?null:"'"+obj.credit_conversion_factor+"'"
    
            var hiveQuery="insert into ref_product (id,leaf_col_id,hierarchy_id,hierarchy_name,leaf_cd,leaf_desc,"
                    +"lvl2_cd,lvl2_desc,lvl3_cd,lvl3_desc,org_unit_cd)  values('undefined',"
                    +"'Detail Product Code','PRDCT-001','Product_Hierarchy',"+dtl_prod_cd+","+dtl_prod_desc+","+prod_cd+","
                    +prod_desc+","+dtl_prod_cd+","+dtl_prod_desc+","+ent_cd+")"
                   
    
            var query="insert into products (ss_id,ent_cd,prod_cd,prod_desc,dtl_prod_cd,dtl_prod_desc,off_balance_sheet_exposure_type,"
                    +" credit_conversion_factor) values("+ss_id+","+ent_cd+","+prod_cd+","+prod_desc+","+dtl_prod_cd+","
                    +dtl_prod_desc+","+obset+","+ccf+")"
    
    
    
            hiveDbCon.reserve(function (err, connObj) {
                if (connObj) {
            
                    var conn = connObj.conn;
    
                    var hiveTasks=[];
    
                    hiveTasks.push(function (callback) {
                        //InsertProducts
                        conn.createStatement(function (err, statement) {
                            if (err) {
                                callback(err);
                            } else {
                                statement.executeUpdate(hiveQuery,
                                    function (err1, count) {
                                        if (err1) {
                                            callback(err1);
                                        } else {
                                            callback(null,count);
                                            
                                        }
                                });
                            }
                        })
                    });
    
                    asyncjs.series(hiveTasks, function (err, results0) {
                        console.log("hive callback-->",results0);
    
                        if(err!=null){
                            console.log("Error-->routes-->sources-->sourcesAndRule-->addProduct--",err)
                            objectToSend["error"]=true
                            objectToSend["data"]="Can't insert products info at the moment.Please try again later. If problem persists, call support"
                            res.send(objectToSend);
    
                        }else{
                            conUserData.query(query,function(error,results){
                                if(error){
                                    console.log("Error-->routes-->sources-->sourcesAndRule-->addProduct--",error)
                                    objectToSend["error"]=true
                                    objectToSend["data"]="Can't insert products info at the moment.Please try again later. If problem persists, call support"
                                    res.send(objectToSend);
                                }else{
                                    objectToSend["error"]=false
                                    objectToSend["data"]=results.insertId
                                    res.send(objectToSend);
                                }
                            })
                        }
                        hiveDb.release(connObj, function (err1) {
                            if (err1) {
                                console.log("Error-->routes-->sources-->sourcesAndRule-->addProduct--",err1)
                            } else {
                                console.log("Hive conn released")
                            }
                        })
                    })
    
                }
            });
    
            
        }catch(ex){
            console.log("Error-->routes-->sources-->sourcesAndRule-->addProduct--",ex)
            objectToSend["error"]=true
            objectToSend["data"]="Can't insert products info at the moment.Please try again later. If problem persists, call support"
            res.send(objectToSend);
        }
    }

    

})



//////////////
//Request to add events
router.post('/addEvents', (req, res) => {


    var obj=req.body;

    try{
        var objectToSend={}

        var query="insert into events (ev_name,prod_id,screen_to_project) values('"+obj.ev_name+"','"+obj.prod_id+"','"+obj.screen_to_project+"')"

        conUserData.query(query,function(error,results){
            if(error){
                console.log("Error-->routes-->sources-->sourcesAndRule-->addEvents--",error)
                objectToSend["error"]=true
                objectToSend["data"]="Can't insert events info at the moment.Please try again later. If problem persists, call support"
                res.send(objectToSend);
            }else{
                objectToSend["error"]=false
                objectToSend["data"]=results.insertId
                res.send(objectToSend);
            }
        })
    }catch(ex){
        console.log("Error-->routes-->sources-->sourcesAndRule-->addEvents--",ex)
        objectToSend["error"]=true
        objectToSend["data"]="Can't insert events info at the moment.Please try again later. If problem persists, call support"
        res.send(objectToSend);
    }


})


//////////////
//Request to get models to create rule
router.get('/getModels:dtls', (req, res) => {

    try{
        var objectToSend={}
        var ent_cd=req.params.dtls;
        var query="Select model_name,group_concat(column_name) as column_names from model_info mi join model_meta mm on "
                    +" mi.model_id=mm.model_id where ent_cd in ('"+ent_cd+"','default')"
                    +" group by model_name"

        

        ruleEngineCon.query(query,function(error,results){
            if(error){
                console.log("Error-->routes-->sources-->sourceAndRule-->getModels--",ex)
                objectToSend["error"]=true
                objectToSend["data"]="Can't fetch data models at the moment.Please try again later. If problem persists call support"
                res.send(objectToSend);
            }else{
                var obj={}
                for(var i=0;i<results.length;i++){
                    obj[results[i].model_name]=results[i].column_names.split(",")
                }
                objectToSend["error"]=false
                objectToSend["data"]=obj
                res.send(objectToSend);

            }
        })

    }catch(ex){
        console.log("Error-->routes-->sources-->sourceAndRule-->getModels--",ex)
        objectToSend["error"]=true
        objectToSend["data"]="Can't fetch data models at the moment.Please try again later. If problem persists call support"
        res.send(objectToSend);
    }

});


//////////////
//Request to create drl file
router.post('/createDrl', (req, res) => {
    

    try{

        var objectToSend={}

        var obj_init=req.body;
    
        var file_name=obj_init.rulesetName
        
        var ent_cd=obj_init.ent_cd

        var ev_id=obj_init.ev_id

       
        
        
        
        var query_init="insert into rule_meta (rule_set_name,ent_cd,rule_structure,ev_id) values"

        query_init+="( '"+file_name+"','"+ent_cd+"','"+obj_init.value+"','"+ev_id+"')"

        ruleEngineCon.beginTransaction(function(err){
            if(err){
                console.log("Error-->routes-->sources-->sourceAndRule-->createDrl--",err)
                objectToSend["error"]=true
                objectToSend["data"]="Can't create ruleset at the moment.Please try again later. If problem persists call support"
                res.send(objectToSend);
            }else{

                ruleEngineCon.query(query_init,function(error,results){
                    if(error){
                        console.log("Error-->routes-->sources-->sourceAndRule-->createDrl--",error)
                        

                        ruleEngineCon.rollback(function(){
                            objectToSend["error"]=true
                            objectToSend["data"]="Can't create ruleset at the moment.Please try again later. If problem persists call support"
                            res.send(objectToSend);
                        })
                    }else{
                        var rule_set_id = results.insertId;

                        ruleEngineCon.query("Select rule_structure from rule_meta where rule_set_id='" + rule_set_id + "'", function (error0, results0) {
                            if (error0) {
                                console.log("Error-->routes-->sources-->sourceAndRule-->createDrl--", error0)
                                ruleEngineCon.rollback(function(){
                                    objectToSend["error"]=true
                                    objectToSend["data"]="Can't create ruleset at the moment.Please try again later. If problem persists call support"
                                    res.send(objectToSend);
                                })
                            } else {
                    
                                var obj = JSON.parse(results0[0].rule_structure)
                    
                                
                    
                    
                                var drlContent = "package Test.Rules;\nimport Test.Rules.InputRecord;\n";
                    
                                
                    
                                var inputObject = null;
                    
                                var outputObjects = {}
                    
                                var lookupsName = {}
                    
                    
                    
                                for (var i = 0; i < obj.length; i++) {
                                    var rule_temp = obj[i]
                                    inputObject = rule_temp.inputDataObj
                    
                                    var then_temp = rule_temp.then
                    
                                    for (var j = 0; j < then_temp.length; j++) {
                                        outputObjects[then_temp[j].outputDataObject] = ""
                                    }
                    
                                }
                    
                                var outObjStr = ""
                    
                                var distOutModels = Object.keys(outputObjects)
                    
                                for (var i = 0; i < distOutModels.length; i++) {
                                    outObjStr += ",'" + distOutModels[i] + "'"
                                    
                                }
                    
                                var sql_getColTypes = "Select mi.model_id,mi.model_name,mm.column_name,mm.column_type from"
                                    + " (Select model_id,model_name from model_info where model_name in ('" + inputObject + "'" + outObjStr + ") "
                                    + " and ent_cd in ('" + ent_cd + "','default')) mi "
                                    + " join model_meta mm on mm.model_id=mi.model_id "
                    
                                ruleEngineCon.query(sql_getColTypes, function (error1, results1) {
                                    if (error1) {
                                        console.log("Error-->routes-->sources-->sourceAndRule-->createDrl--", error1)
                                        ruleEngineCon.rollback(function(){
                                            objectToSend["error"]=true
                                            objectToSend["data"]="Can't create ruleset at the moment.Please try again later. If problem persists call support"
                                            res.send(objectToSend);
                                        })
                                    } else if (results1.length == 0) {
                                        objectToSend["error"] = true
                                        objectToSend["data"] = "No columns defined for data objects"
                                        res.send(objectToSend);
                                    } else {
                                        var column_type_info = {}
                    
                                        for (var k = 0; k < results1.length; k++) {
                    
                    
                    
                                            if (column_type_info[results1[k].model_name] == undefined) {
                                                var outer_obj = {}
                                                var temp_obj = {}
                    
                                                temp_obj[results1[k].column_name] = results1[k].column_type
                    
                                                outer_obj["col_info"] = temp_obj
                                                outer_obj["model_id"] = results1[k].model_id
                                                column_type_info[results1[k].model_name] = outer_obj
                                            } else {
                                                column_type_info[results1[k].model_name]["col_info"][results1[k].column_name] = results1[k].column_type
                                            }
                                        }
                                        var salience = -1;
                    
                                        for (var l = 0; l < obj.length; l++) {
                    
                                            var rule = obj[l]
                    
                                            var rule_name = rule.ruleName;
                    
                                            inputObject = rule.inputDataObj
                    
                                            var when = rule.when;
                    
                                            var condition = when.condition
                    
                                            var when_clause = when.rules
                    
                                            drlContent+='rule "'+rule_name+'_'+ent_cd+'"\n'

                                            drlContent+="salience "+(salience-l)+"\n"
                    
                                            drlContent += "when \n"
                    
                                            if (when_clause.length > 0) {
                    
                                                drlContent += "input:InputRecord(\n"

                                                drlContent+='input.get("org_unit_cd")=="'+ent_cd+'"\n'
                    
                                                for (var m = 0; m < when_clause.length; m++) {
                                                    var clause = when_clause[m]

                                                    drlContent += (condition=='and')?'&&\n':'||\n'
                    
                                                    var exprType = clause.function;
                    
                                                    if (exprType == "static") {
                                                        drlContent += 'input.get("' + clause.field + '")' + clause.operator
                                                        if (column_type_info[inputObject]["col_info"][clause.field] == "string") {
                                                            drlContent += '"' + clause.value + '"\n'
                                                        }else{
                                                            drlContent +=  clause.value + '\n'
                                                        }
                                                    } else if (exprType == "expression") {
                                                        drlContent += 'input.get("' + clause.field + '")' + clause.operator + clause.value + '\n'
                                                    } else if (exprType == "derived") {
                                                        drlContent += 'input.get("' + clause.field + '")' + clause.operator + 'input.get("' + clause.newfield + '")\n'
                                                    } else {
                                                        lookupsName[clause.lookupname] = ""
                                                        drlContent += 'input.get("' + clause.field + '")' + clause.operator
                                                            + 'Lookup.from("' + clause.lookupname + '",input.get("' + clause.lookupkey + '"))\n'
                                                    }
                    
                                                   
                    
                    
                                                }
                                                drlContent += ")\n"
                                            }
                    
                                            var then = rule.then
                    
                                            drlContent += "then\n"
                    
                                            if (then.length > 0) {
                    
                                                for (m = 0; m < then.length; m++) {
                    
                                                    var outModel = then[m].outputDataObject
                    
                                                    var asmts = then[m].assignments
                    
                                                    var variable_name = outModel + "_" + i
                                                    drlContent += 'OutputRecord ' + variable_name + ' = new OutputRecord("' + outModel + '"); \n '
                    
                                                    for (var n = 0; n < asmts.length; n++) {
                    
                                                        var temp_asmt = asmts[n]
                                                        var asmt_value = "";
                                                        if (temp_asmt.function == "static") {
                                                            if (column_type_info[outModel]["col_info"][temp_asmt.field] == "string") {
                                                                asmt_value = '"' + temp_asmt.value + '"'
                                                            }else{
                                                                asmt_value = temp_asmt.value
                                                            }
                                                        } else if (temp_asmt.function == "derived") {
                                                            asmt_value = 'input.get("' + temp_asmt.newfield + '")'
                                                        } else if (temp_asmt.function == "expression") {
                                                            asmt_value = temp_asmt.value
                                                        } else {
                                                            lookupsName[temp_asmt.lookupname] = ""
                                                            asmt_value = 'Lookup.from("' + temp_asmt.lookupname + '","' + temp_asmt.lookupkey + '")'
                                                        }
                    
                                                        drlContent += variable_name + '.set("' + temp_asmt.field + '",' + asmt_value + ');\n'
                                                    }
                                                    drlContent += 'input.setOutput(' + variable_name + ');\n'
                    
                                                }
                                            }
                    
                                            drlContent += "end\n"
                                        }
                    
                                        
                    
                                        var sql_insertDrl = "update rule_meta set drl_content='" + drlContent + "' where rule_set_id='" + rule_set_id + "'"
                    
                                        var sql_inModel = "insert into rule_xref_in_model (rule_id,model_id) values ('" + rule_set_id + "','" + column_type_info[inputObject]["model_id"] + "')"
                    
                    
                                        var sql_outModel="insert into rule_xref_out_model (rule_id,model_id) values "
                    
                                        if(distOutModels.length>0){
                                            for(var p=0;p<distOutModels.length;p++){
                                                sql_outModel+="('"+rule_set_id+"','"+column_type_info[distOutModels[p]]["model_id"]+"')"
                        
                                                if(p<distOutModels.length-1){
                                                    sql_outModel+=","
                                                }
                                            }
                                        }else{
                                            sql_outModel+="('"+rule_set_id+"',null)"
                                        }
                    
                                        
                                       
                    
                                        var lookup_names=""
                    
                                        var lookupUsed=Object.keys(lookupsName)
                    
                                        if(lookupUsed.length>0){
                                            for(var p=0;p<lookupUsed.length;p++){
                                                lookup_names+="'"+lookupUsed[p]+"'"
                        
                                                if(p<lookupUsed.length-1){
                                                    lookup_names+=","
                                                }
                                            }
                                        }else{
                                            lookup_names+="'null'"
                                        }
                    
                                        
                    
                                        var sql_getLookupId="Select lookup_id from lookup_info where ent_cd = '"+ent_cd+"' and lookup_name in ("+lookup_names+")"
                    
                                        ruleEngineCon.query(sql_getLookupId,function(error3,results3){
                                            if(error3){
                                                console.log("Error-->routes-->sources-->sourceAndRule-->createDrl--", error3)
                                                ruleEngineCon.rollback(function(){
                                                    objectToSend["error"]=true
                                                    objectToSend["data"]="Can't create ruleset at the moment.Please try again later. If problem persists call support"
                                                    res.send(objectToSend);
                                                })
                                            }else{
                                                
                    
                                                var sql_insertRuleXlookup="insert into rule_xref_lookups (rule_id,lookup_id) values"
                    
                                                if(results3.length>0){
                                                    for(var q=0;q<results3.length;q++){
                                                        sql_insertRuleXlookup+="('"+rule_set_id+"','"+results3[q].lookup_id+"')"
                        
                                                        if(q<results3.length-1){
                                                            sql_insertRuleXlookup+=","
                                                        }
                                                    }
                                                }else{
                                                    sql_insertRuleXlookup+="('"+rule_set_id+"',null)"
                                                }
                    
                                                var final_query=sql_insertDrl+";"+sql_inModel+";"+sql_outModel+";"+sql_insertRuleXlookup
                    
                                                
                    
                                                ruleEngineCon.query(final_query,function(error4,results4){
                    
                                                    if(error4){
                                                        console.log("Error-->routes-->sources-->sourceAndRule-->createDrl--", error4)
                                                        ruleEngineCon.rollback(function(){
                                                            objectToSend["error"]=true
                                                            objectToSend["data"]="Can't create ruleset at the moment.Please try again later. If problem persists call support"
                                                            res.send(objectToSend);
                                                        })
                                                    }else{
                                                        /////////////
                                                        //////create drl file if required

                                                        ruleEngineCon.commit(function(err3){
                                                            if(err3){
                                                                console.log("Error-->routes-->sources-->sourceAndRule-->createDrl--", err3)
                                                                objectToSend["error"]=true
                                                                objectToSend["data"]="Can't create ruleset at the moment.Please try again later. If problem persists call support"
                                                                res.send(objectToSend);
                                                            }else{

                                                                payloads = [
                                                                    { topic: 'src_event', messages: 'reload_data', partition: 0 }
                                                                ];
                                                                producer.send(payloads, function (error8, data) {
                                                                    if (error8) {
                                                                        console.log("Error-->routes-->sources-->sourceAndRule-->createDrl--", err3)
                                                                        objectToSend["error"]=true
                                                                        objectToSend["data"]="Ruleset created but rule execution engine is not working.Please call support"
                                                                        res.send(objectToSend);
                
                                                                    }else{
                                                                        objectToSend["error"] = false
                                                                        objectToSend["data"] = "Rule set created successfully"
                                                                        res.send(objectToSend);
                                                                    }
                
                                                                });
                                                                
                                                            }
                                                        })
                            
                                                        
                            
                            
                                                    }
                            
                                                })
                                                
                                            }
                                        })
                                        
                    
                                    }
                                })
                    
                    
                    
                            }
                        })
                    

                    }
                })
            }
        })

        

        
       
        
      

    }catch(ex){
        console.log("Error-->routes-->sources-->sourceAndRule-->createDrl--",ex)
        objectToSend["error"]=true
        objectToSend["data"]="Can't create ruleset at the moment.Please try again later. If problem persists call support"
        res.send(objectToSend);
    }
     

    
});







//////////////////////////////////
//////GET REQUESTS FOR SOURCE FLOW
//////////////////////////////////


//////////////
//Request to get products of a source system

router.get('/getProducts:dtls', (req, res) => {

    try{
        var objectToSend={}
        var ss_id=req.params.dtls;

        var query="Select * from products where ss_id = '"+ss_id+"'";

        conUserData.query(query,function(error,results){
            if(error){
                console.log("Error-->routes-->sources-->sourceAndRule-->getProducts--",error)
                objectToSend["error"]=true
                objectToSend["data"]="Can't fetch products info at the moment.Please try again later. If problem persists call support"
                res.send(objectToSend);
            }else{
                objectToSend["error"]=false
                objectToSend["data"]=results
                res.send(objectToSend);
            }
        })

    }catch(ex){
        console.log("Error-->routes-->sources-->sourceAndRule-->getProducts--",ex)
        objectToSend["error"]=true
        objectToSend["data"]="Can't fetch products info at the moment.Please try again later. If problem persists call support"
        res.send(objectToSend);
    }
})

///////////////
//////Request to get events of a product

router.get('/getEvents:dtls', (req, res) => {

    try{
        var objectToSend={}
        var prod_id=req.params.dtls;

        if(prod_id=="0"){
            prod_id='undefined';
        }

        var query="Select * from events where prod_id in ("+prod_id+")";

        conUserData.query(query,function(error,results){
            if(error){
                console.log("Error-->routes-->sources-->sourceAndRule-->getEvents--",error)
                objectToSend["error"]=true
                objectToSend["data"]="Can't fetch events info at the moment.Please try again later. If problem persists call support"
                res.send(objectToSend);
            }else{
                objectToSend["error"]=false
                objectToSend["data"]=results
                res.send(objectToSend);
            }
        })

    }catch(ex){
        console.log("Error-->routes-->sources-->sourceAndRule-->getEvents--",ex)
        objectToSend["error"]=true
        objectToSend["data"]="Can't fetch products info at the moment.Please try again later. If problem persists call support"
        res.send(objectToSend);
    }
})

////////////
//////Request to get ruleset structure of a product
router.get('/getRulesetStructure:dtls', (req, res) => {

    try{

        var objectToSend={}
    
        var obj=JSON.parse(req.params.dtls)

        var ev_id=obj.ev_id;

        console.log(obj)
    
        var query="Select rule_set_name,ent_cd,ev_id,rule_structure from rule_meta where ev_id = '"+ev_id+"'";
    
        ruleEngineCon.query(query,function(error,results){
    
            if(error){
                console.log("Error-->routes-->sources-->sourceAndRule-->getRulesetStructure--",error)
                objectToSend["error"]=true
                objectToSend["data"]="Can't fetch ruleset structure info at the moment.Please try again later. If problem persists call support"
                res.send(objectToSend);
            }else if(results.length==0){

                var q2="Select rule_set_name,ent_cd,ev_id,rule_structure from rule_meta where ent_cd='default'"
                        +" and ev_name='"+obj.ev_name+"'"

                ruleEngineCon.query(q2,function(error1,results1){
                    if(error1){
                        console.log("Error-->routes-->sources-->sourceAndRule-->getRulesetStructure--",error1)
                        objectToSend["error"]=true
                        objectToSend["data"]="Can't fetch ruleset structure info at the moment.Please try again later. If problem persists call support"
                        res.send(objectToSend);
                    }else if(results1.length==0){
                        var temp={}
                        temp["rules"]=[]
                        temp["rulesetName"]=""
                        temp["ent_cd"]=""
                        temp["ev_id"]=""
                        objectToSend["error"]=false
                        objectToSend["data"]=temp;
                        res.send(objectToSend);
                    }else{
                        var temp={}
                        temp["rules"]=JSON.parse(results1[0].rule_structure)
                        temp["rulesetName"]=results1[0].rule_set_name
                        temp["ent_cd"]=results1[0].ent_cd
                        temp["ev_id"]=results1[0].ev_id

                        objectToSend["error"]=false
                        objectToSend["data"]=temp;
                        res.send(objectToSend);
                    }
                })
                


                
            }else{


                var temp={}


                temp["rules"]=JSON.parse(results[0].rule_structure)
                temp["rulesetName"]=results[0].rule_set_name
                temp["ent_cd"]=results[0].ent_cd
                temp["ev_id"]=results[0].ev_id

                objectToSend["error"]=false
                objectToSend["data"]=temp;
                res.send(objectToSend);
            }
        })
    }catch(ex){
        console.log("Error-->routes-->sources-->sourceAndRule-->getRulesetStructure--",ex)
        objectToSend["error"]=true
        objectToSend["data"]="Can't fetch ruleset structure info at the moment.Please try again later. If problem persists call support"
        res.send(objectToSend);
    }
    
});



//////////////////////////////////////////////
//////REQUESTS FOR MODIFICATION OF SOURCE INFO
//////////////////////////////////////////////



////////////
//////Request to update source info

router.put('/updateSrcSystem', (req, res) => {

    try{
        var objectToSend={}
        var obj=req.body;

        var query="update source_system set ss_name='"+obj.ss_name+"' where ss_id='"+obj.ss_id+"'";

        conUserData.query(query,function(error,results){
            if(error){
                console.log("Error-->routes-->sources-->sourceAndRule-->updateSrcSystem--",error)
                objectToSend["error"]=true
                objectToSend["data"]="Can't update source name at the moment.Please try again later. If problem persists call support"
                res.send(objectToSend);
            }else{
                objectToSend["error"]=false
                objectToSend["data"]="Source info updated"
                res.send(objectToSend);
            }
        })

    }catch(ex){
        console.log("Error-->routes-->sources-->sourceAndRule-->updateSrcSystem--",ex)
        objectToSend["error"]=true
        objectToSend["data"]="Can't fetch products info at the moment.Please try again later. If problem persists call support"
        res.send(objectToSend);
    }
})

////////////
//////Request to update products info

router.put('/updateProduct', (req, res) => {

    try{
        var objectToSend={}
        var obj=req.body;

        var query="update products set prod_cd='"+obj.prod_cd+"', prod_desc='"+obj.prod_desc+"',"
                +" dtl_prod_cd='"+obj.dtl_prod_cd+"', dtl_prod_desc='"+obj.dtl_prod_desc+"'"
                +" , off_balance_sheet_exposure_type='"+obj.off_balance_sheet_exposure_type+"', "
                +"credit_conversion_factor='"+obj.credit_conversion_factor+"'"
                +" where prod_id='"+obj.prod_id+"'";

        conUserData.query(query,function(error,results){
            if(error){
                console.log("Error-->routes-->sources-->sourceAndRule-->updateProducts--",error)
                objectToSend["error"]=true
                objectToSend["data"]="Can't update product's info at the moment.Please try again later. If problem persists call support"
                res.send(objectToSend);
            }else{
                objectToSend["error"]=false
                objectToSend["data"]="Product updated"
                res.send(objectToSend);
            }
        })

    }catch(ex){
        console.log("Error-->routes-->sources-->sourceAndRule-->updateProducts--",ex)
        objectToSend["error"]=true
        objectToSend["data"]="Can't fetch product's info at the moment.Please try again later. If problem persists call support"
        res.send(objectToSend);
    }
})


////////////
//////Request to update events info

router.put('/updateEvent', (req, res) => {

    try{
        var obj=req.body;
        var objectToSend={}

        var query="update events set ev_name='"+obj.ev_name+"', screen_to_project='"+obj.screen_to_project+"',"
                    +" prod_id='"+obj.prod_id+"' where ev_id='"+obj.ev_id+"'";

        conUserData.query(query,function(error,results){
            if(error){
                console.log("Error-->routes-->sources-->sourceAndRule-->updateEvents--",error)
                objectToSend["error"]=true
                objectToSend["data"]="Can't update event's info at the moment.Please try again later. If problem persists call support"
                res.send(objectToSend);
            }else{
                objectToSend["error"]=false
                objectToSend["data"]="Event updated"
                res.send(objectToSend);
            }
        })

    }catch(ex){
        console.log("Error-->routes-->sources-->sourceAndRule-->updateEvents--",ex)
        objectToSend["error"]=true
        objectToSend["data"]="Can't fetch event's info at the moment.Please try again later. If problem persists call support"
        res.send(objectToSend);
    }
})


//////////////
//Request to update drl file

router.put('/updateDrl', (req, res) => {
    

    try{

        var objectToSend={}

        var obj_init=req.body;
    
        var rule_set_name=obj_init.rulesetName
        
        var ent_cd=obj_init.ent_cd

        var ev_id=obj_init.ev_id

        
        
        
        
        var query_init="update rule_meta set rule_set_name='"+rule_set_name+"',ent_cd='"+ent_cd+"'"
                +",rule_structure='"+obj_init.value+"'" 
                +" where ev_id='"+ev_id+"'"

        
        ruleEngineCon.beginTransaction(function(err){
            if(err){
                console.log("Error-->routes-->sources-->sourceAndRule-->updateDrl--",err)
                objectToSend["error"]=true
                objectToSend["data"]="Can't update ruleset at the moment.Please try again later. If problem persists call support"
                res.send(objectToSend);
            }else{

                ruleEngineCon.query(query_init,function(error,results){
                    if(error){
                        console.log("Error-->routes-->sources-->sourceAndRule-->updateDrl--",error)
                        

                        ruleEngineCon.rollback(function(){
                            objectToSend["error"]=true
                            objectToSend["data"]="Can't update ruleset at the moment.Please try again later. If problem persists call support"
                            res.send(objectToSend);
                        })
                    }else{
                        
                        ruleEngineCon.query("Select rule_set_id,rule_structure from rule_meta where ev_id='" + ev_id + "'", function (error0, results0) {
                            if (error0) {
                                console.log("Error-->routes-->sources-->sourceAndRule-->updateDrl--", error0)
                                ruleEngineCon.rollback(function(){
                                    objectToSend["error"]=true
                                    objectToSend["data"]="Can't update ruleset at the moment.Please try again later. If problem persists call support"
                                    res.send(objectToSend);
                                })
                            } else {
                                var rule_set_id=results0[0].rule_set_id
                    
                                var obj = JSON.parse(results0[0].rule_structure)
                    
                                
                    
                    
                                var drlContent = "package Test.Rules;\nimport Test.Rules.InputRecord;\n";
                    
                                
                    
                                var inputObject = null;
                    
                                var outputObjects = {}
                    
                                var lookupsName = {}
                    
                    
                    
                                for (var i = 0; i < obj.length; i++) {
                                    var rule_temp = obj[i]
                                    inputObject = rule_temp.inputDataObj
                    
                                    var then_temp = rule_temp.then
                    
                                    for (var j = 0; j < then_temp.length; j++) {
                                        outputObjects[then_temp[j].outputDataObject] = ""
                                    }
                    
                                }
                    
                                var outObjStr = ""
                    
                                var distOutModels = Object.keys(outputObjects)
                    
                                for (var i = 0; i < distOutModels.length; i++) {
                                    outObjStr += ",'" + distOutModels[i] + "'"
                                    
                                }
                    
                                var sql_getColTypes = "Select mi.model_id,mi.model_name,mm.column_name,mm.column_type from"
                                    + " (Select model_id,model_name from model_info where model_name in ('" + inputObject + "'" + outObjStr + ") "
                                    + " and ent_cd in ('" + ent_cd + "','default')) mi "
                                    + " join model_meta mm on mm.model_id=mi.model_id "
                    
                                ruleEngineCon.query(sql_getColTypes, function (error1, results1) {
                                    if (error1) {
                                        console.log("Error-->routes-->sources-->sourceAndRule-->updateDrl--", error1)
                                        ruleEngineCon.rollback(function(){
                                            objectToSend["error"]=true
                                            objectToSend["data"]="Can't update ruleset at the moment.Please try again later. If problem persists call support"
                                            res.send(objectToSend);
                                        })
                                    } else if (results1.length == 0) {
                                        objectToSend["error"] = true
                                        objectToSend["data"] = "No columns defined for data objects"
                                        res.send(objectToSend);
                                    } else {
                                        var column_type_info = {}
                    
                                        for (var k = 0; k < results1.length; k++) {
                    
                    
                    
                                            if (column_type_info[results1[k].model_name] == undefined) {
                                                var outer_obj = {}
                                                var temp_obj = {}
                    
                                                temp_obj[results1[k].column_name] = results1[k].column_type
                    
                                                outer_obj["col_info"] = temp_obj
                                                outer_obj["model_id"] = results1[k].model_id
                                                column_type_info[results1[k].model_name] = outer_obj
                                            } else {
                                                column_type_info[results1[k].model_name]["col_info"][results1[k].column_name] = results1[k].column_type
                                            }
                                        }
                                        var salience = -1;
                    
                                        for (var l = 0; l < obj.length; l++) {
                    
                                            var rule = obj[l]
                    
                                            var rule_name = rule.ruleName;
                    
                                            inputObject = rule.inputDataObj
                    
                                            var when = rule.when;
                    
                                            var condition = when.condition
                    
                                            var when_clause = when.rules
                    
                                            drlContent+='rule "'+rule_name+'_'+ent_cd+'"\n'

                                            drlContent+="salience "+(salience-l)+"\n"
                    
                                            drlContent += "when \n"
                    
                                            if (when_clause.length > 0) {
                    
                                                drlContent += "input:InputRecord(\n"

                                                drlContent+='input.get("org_unit_cd")=="'+ent_cd+'"\n'
                    
                                                for (var m = 0; m < when_clause.length; m++) {

                                                    drlContent += (condition=='and')?'&&\n':'||\n'

                                                    var clause = when_clause[m]
                    
                                                    var exprType = clause.function;
                    
                                                    if (exprType == "static") {
                                                        drlContent += 'input.get("' + clause.field + '")' + clause.operator
                                                        if (column_type_info[inputObject]["col_info"][clause.field] == "string") {
                                                            drlContent += '"' + clause.value + '"\n'
                                                        }else{
                                                            drlContent +=  clause.value + '\n'
                                                        }
                                                    } else if (exprType == "expression") {
                                                        drlContent += 'input.get("' + clause.field + '")' + clause.operator + clause.value + '\n'
                                                    } else if (exprType == "derived") {
                                                        drlContent += 'input.get("' + clause.field + '")' + clause.operator + 'input.get("' + clause.newfield + '")\n'
                                                    } else {
                                                        lookupsName[clause.lookupname] = ""
                                                        drlContent += 'input.get("' + clause.field + '")' + clause.operator
                                                            + 'Lookup.from("' + clause.lookupname + '",input.get("' + clause.lookupkey + '"))\n'
                                                    }
                    
                                                    
                    
                    
                                                }
                                                drlContent += ")\n"
                                            }
                    
                                            var then = rule.then
                    
                                            drlContent += "then\n"
                    
                                            if (then.length > 0) {
                    
                                                for (m = 0; m < then.length; m++) {
                    
                                                    var outModel = then[m].outputDataObject
                    
                                                    var asmts = then[m].assignments
                    
                                                    var variable_name = outModel + "_" + m
                                                    drlContent += 'OutputRecord ' + variable_name + ' = new OutputRecord("' + outModel + '"); \n '
                    
                                                    for (var n = 0; n < asmts.length; n++) {
                    
                                                        var temp_asmt = asmts[n]
                                                        var asmt_value = "";
                                                        if (temp_asmt.function == "static") {
                                                            if (column_type_info[outModel]["col_info"][temp_asmt.field] == "string") {
                                                                asmt_value = '"' + temp_asmt.value + '"'
                                                            }else{
                                                                asmt_value = temp_asmt.value
                                                            }
                                                        } else if (temp_asmt.function == "derived") {
                                                            asmt_value = 'input.get("' + temp_asmt.newfield + '")'
                                                        } else if (temp_asmt.function == "expression") {
                                                            asmt_value = temp_asmt.value
                                                        } else {
                                                            lookupsName[temp_asmt.lookupname] = ""
                                                            asmt_value = 'Lookup.from("' + temp_asmt.lookupname + '","' + temp_asmt.lookupkey + '")'
                                                        }
                    
                                                        drlContent += variable_name + '.set("' + temp_asmt.field + '",' + asmt_value + ');\n'
                                                    }
                                                    drlContent += 'input.setOutput(' + variable_name + ');\n'
                    
                                                }
                                            }
                    
                                            drlContent += "end\n"
                                        }
                    
                                       
                    
                                        var sql_insertDrl = "update rule_meta set drl_content='" + drlContent + "' where rule_set_id='" + rule_set_id + "'"
                    
                                        var sql_inModel = "update rule_xref_in_model set model_id='"
                                             + column_type_info[inputObject]["model_id"] + "' where rule_id='"+rule_set_id+"'"

                                        var sql_deleteOutModel="delete from rule_xref_out_model where rule_id='"+rule_set_id+"'"
                                        
                                        
                                        var sql_outModel="insert into rule_xref_out_model (rule_id,model_id) values "
                    
                                        if(distOutModels.length>0){
                                            for(var p=0;p<distOutModels.length;p++){
                                                sql_outModel+="('"+rule_set_id+"','"+column_type_info[distOutModels[p]]["model_id"]+"')"
                        
                                                if(p<distOutModels.length-1){
                                                    sql_outModel+=","
                                                }
                                            }
                                        }else{
                                            sql_outModel+="('"+rule_set_id+"',null)"
                                        }
                    
                                        
                                       
                    
                                        var lookup_names=""
                    
                                        var lookupUsed=Object.keys(lookupsName)
                    
                                        if(lookupUsed.length>0){
                                            for(var p=0;p<lookupUsed.length;p++){
                                                lookup_names+="'"+lookupUsed[p]+"'"
                        
                                                if(p<lookupUsed.length-1){
                                                    lookup_names+=","
                                                }
                                            }
                                        }else{
                                            lookup_names+="'null'"
                                        }
                    
                                        
                    
                                        var sql_getLookupId="Select lookup_id from lookup_info where ent_cd = '"+ent_cd+"' and lookup_name in ("+lookup_names+")"
                    
                                        ruleEngineCon.query(sql_getLookupId,function(error3,results3){
                                            if(error3){
                                                console.log("Error-->routes-->sources-->sourceAndRule-->updateDrl--", error3)
                                                ruleEngineCon.rollback(function(){
                                                    objectToSend["error"]=true
                                                    objectToSend["data"]="Can't update ruleset at the moment.Please try again later. If problem persists call support"
                                                    res.send(objectToSend);
                                                })
                                            }else{
                                                var sql_deleteLookup="delete from rule_xref_lookups where rule_id='"+rule_set_id+"'"
                                        
                    
                                                var sql_insertRuleXlookup="insert into rule_xref_lookups (rule_id,lookup_id) values"
                    
                                                if(results3.length>0){
                                                    for(var q=0;q<results3.length;q++){
                                                        sql_insertRuleXlookup+="('"+rule_set_id+"','"+results3[q].lookup_id+"')"
                        
                                                        if(q<results3.length-1){
                                                            sql_insertRuleXlookup+=","
                                                        }
                                                    }
                                                }else{
                                                    sql_insertRuleXlookup+="('"+rule_set_id+"',null)"
                                                }
                    
                                                var final_query=sql_insertDrl+";"+sql_inModel+";"+sql_deleteOutModel
                                                        +";"+sql_outModel+";"+sql_deleteLookup+";"+sql_insertRuleXlookup
                    
                                                
                    
                                                ruleEngineCon.query(final_query,function(error4,results4){
                    
                                                    if(error4){
                                                        console.log("Error-->routes-->sources-->sourceAndRule-->createDrl--", error4)
                                                        ruleEngineCon.rollback(function(){
                                                            objectToSend["error"]=true
                                                            objectToSend["data"]="Can't update ruleset at the moment.Please try again later. If problem persists call support"
                                                            res.send(objectToSend);
                                                        })
                                                    }else{
                                                        /////////////
                                                        //////create drl file if required

                                                        ruleEngineCon.commit(function(err3){
                                                            if(err3){
                                                                console.log("Error-->routes-->sources-->sourceAndRule-->updateDrl--", err3)
                                                                objectToSend["error"]=true
                                                                objectToSend["data"]="Can't update ruleset at the moment.Please try again later. If problem persists call support"
                                                                res.send(objectToSend);
                                                            }else{
                                                                payloads = [
                                                                    { topic: 'src_event', messages: 'reload_data', partition: 0 }
                                                                ];
                                                                producer.send(payloads, function (error8, data) {
                                                                    if (error8) {
                                                                        console.log("Error-->routes-->sources-->sourceAndRule-->createDrl--", err3)
                                                                        objectToSend["error"]=true
                                                                        objectToSend["data"]="Ruleset created but rule execution engine is not working.Please call support"
                                                                        res.send(objectToSend);
                
                                                                    }else{
                                                                        objectToSend["error"] = false
                                                                        objectToSend["data"] = "Rule set created successfully"
                                                                        res.send(objectToSend);
                                                                    }
                
                                                                });
                                                            }
                                                        })
                            
                                                        
                            
                            
                                                    }
                            
                                                })
                                                
                                            }
                                        })
                                        
                    
                                    }
                                })
                    
                    
                    
                            }
                        })
                    

                    }
                })
            }
        })

        

        
       
        
      

    }catch(ex){
        console.log("Error-->routes-->sources-->sourceAndRule-->updateDrl--",ex)
        objectToSend["error"]=true
        objectToSend["data"]="Can't update ruleset at the moment.Please try again later. If problem persists call support"
        res.send(objectToSend);
    }
     

    
});


module.exports=router;