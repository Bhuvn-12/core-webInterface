var express = require('express');
var router = express.Router();
var ruleEngineCon=require('../../connections/mysqlRuleEngineDbCon.js')



///////////////////////////
////////////DATA OBJECT(MODEL) REQUESTS

router.post('/createModel', (req, res) => {

    try{

        var objectToSend={}
        var obj=req.body;

        var query="insert into model_info (ent_cd,model_name) values('"+obj.ent_cd+"','"+obj.model_name+"')"

        ruleEngineCon.query(query,function(error,results){
    
            if(error){
                console.log("Error-->routes-->ruleComponents-->metaDefinition-->createModel--",error)
                objectToSend["error"]=true
                objectToSend["data"]="Can't create data model at the moment.Please try again later. If problem persists, call support"
                res.send(objectToSend);
            }else{
                objectToSend["error"]=false
                objectToSend["data"]=results.insertId
                res.send(objectToSend);
            }
        })
    

    }catch(ex){
        console.log("Error-->routes-->ruleComponents-->metaDefinition-->createModel--",ex)
        objectToSend["error"]=true
        objectToSend["data"]="Can't create data model at the moment.Please try again later. If problem persists, call support"
        res.send(objectToSend);
    }

});


router.get('/getModelInfo:dtls', (req, res) => {

    try{
        var objectToSend={}
    

        var ent_cd=req.params.dtls;

        

    
        var query="Select mi.model_id,id,model_name,column_name,column_desc,column_type,col_seq_no,is_nullable from"
                    +" model_info mi left join model_meta mm on mi.model_id=mm.model_id"
                    +" where ent_cd in ('"+ent_cd+"','default')";
    
        ruleEngineCon.query(query,function(error,results){
    
            if(error){
                console.log("Error-->routes-->ruleComponents-->metaDefinition-->getModelInfo--",error)
                objectToSend["error"]=true
                objectToSend["data"]="Can't fetch data model info at the moment.Please try again later. If problem persists, call support"
                res.send(objectToSend);
            }else{

                
                var finalRes={}
                
    
                for(var i=0;i<results.length;i++){
    
                    var model_name=results[i].model_name
                    if(model_name in finalRes){
                        
                        finalRes[model_name].push(results[i])
                    }else{
                        var temp=[]
                       
                        
                        temp.push(results[i])
                        finalRes[model_name]=temp
                    }
                    
    
                    
                }

                

                objectToSend["error"]=false
                objectToSend["data"]=finalRes;
                res.send(objectToSend);
            }
        })
    }catch(ex){
        console.log("Error-->routes-->ruleComponents-->metaDefinition-->getModelInfo--",ex)
        objectToSend["error"]=true
        objectToSend["data"]="Can't fetch data model info at the moment.Please try again later. If problem persists, call support"
        res.send(objectToSend);
    }
    
});


router.put('/updateModelInfo', (req, res) => {


    try{
        var objectToSend={}
        var obj=req.body

        var query="update model_meta set column_name='"+obj.column_name+"',"
                       +" column_type='"+obj.column_type+"',column_desc='"+obj.column_desc+"' where id='"+obj.id+"'"

        ruleEngineCon.query(query,function(error,results){
            if(error){
                console.log("Error-->routes-->ruleComponents-->metaDefinition-->updateModelInfo--",ex)
                objectToSend["error"]=true
                objectToSend["data"]="Can't update model info at the moment.Please try again later. If problem persists, call support"
                res.send(objectToSend);
            }else{
                objectToSend["error"]=false
                objectToSend["data"]="Model info updated"
                res.send(objectToSend);
            }
        })

    }catch(Ex){
        console.log("Error-->routes-->ruleComponents-->metaDefinition-->updateModelInfo--",ex)
        objectToSend["error"]=true
        objectToSend["data"]="Can't update model info at the moment.Please try again later. If problem persists, call support"
        res.send(objectToSend);
    }
});

router.delete('/deleteModelInfo:dtls', (req, res) => {


    try{
        var objectToSend={}
        var obj=req.params.dtls

        var query="delete from model_meta where id='"+obj+"'"

        ruleEngineCon.query(query,function(error,results){
            if(error){
                console.log("Error-->routes-->ruleComponents-->metaDefinition-->deleteModelInfo--",ex)
                objectToSend["error"]=true
                objectToSend["data"]="Can't delete model info at the moment.Please try again later. If problem persists, call support"
                res.send(objectToSend);
            }else{
                objectToSend["error"]=false
                objectToSend["data"]="Model info deleted"
                res.send(objectToSend);
            }
        })

    }catch(Ex){
        console.log("Error-->routes-->ruleComponents-->metaDefinition-->deleteModelInfo--",ex)
        objectToSend["error"]=true
        objectToSend["data"]="Can't delete model info at the moment.Please try again later. If problem persists, call support"
        res.send(objectToSend);
    }
});

router.post('/insertModelInfo', (req, res) => {


    try{
        var objectToSend={}
        var obj=req.body

        var query="insert into model_meta (model_id,column_name,column_desc,column_type,col_seq_no)"
                +" values('"+obj.model_id+"','"+obj.column_name+"','"+obj.column_desc+"','"+obj.column_type+"','"+obj.col_seq_no+"')"

        ruleEngineCon.query(query,function(error,results){
            if(error){
                console.log("Error-->routes-->ruleComponents-->metaDefinition-->insertModelInfo--",ex)
                objectToSend["error"]=true
                objectToSend["data"]="Can't insert model info at the moment.Please try again later. If problem persists, call support"
                res.send(objectToSend);
            }else{
                objectToSend["error"]=false
                objectToSend["data"]=results.insertId
                res.send(objectToSend);
            }
        })

    }catch(Ex){
        console.log("Error-->routes-->ruleComponents-->metaDefinition-->insertModelInfo--",ex)
        objectToSend["error"]=true
        objectToSend["data"]="Can't insert model info at the moment.Please try again later. If problem persists, call support"
        res.send(objectToSend);
    }
});


///////////////////////////
////////////LOOKUP REQUESTS

router.get('/getLookups:dtls', (req, res) => {

    try{
        var objectToSend={}
    

        var ent_cd=req.params.dtls;
    
        var query="Select lookup_id,lookup_name,lookup_sub_type from lookup_info where ent_cd='"+ent_cd+"'";
    
        ruleEngineCon.query(query,function(error,results){
    
            if(error){
                console.log("Error-->routes-->ruleComponents-->metaDefinition-->getLookups--",error)
                objectToSend["error"]=true
                objectToSend["data"]="Can't fetch lookups at the moment.Please try again later. If problem persists, call support"
                res.send(objectToSend);
            }else{

                
                
                objectToSend["error"]=false
                objectToSend["data"]=results;
                res.send(objectToSend);
            }
        })
    }catch(ex){
        console.log("Error-->routes-->ruleComponents-->metaDefinition-->getLookups--",ex)
        objectToSend["error"]=true
        objectToSend["data"]="Can't fetch lookups at the moment.Please try again later. If problem persists, call support"
        res.send(objectToSend);
    }
    
});

router.get('/getLookupInfo:dtls', (req, res) => {

    try{
        var objectToSend={}
    
        var obj=JSON.parse(req.params.dtls)

        var lookup_id=obj.lookup_id;
    
        var query="Select input_cols from db_to_inputs where lookup_sub_type='"+obj.lookup_sub_type+"'";
    
        ruleEngineCon.query(query,function(error,results){
    
            if(error){
                console.log("Error-->routes-->ruleComponents-->metaDefinition-->getLookupInfo--",error)
                objectToSend["error"]=true
                objectToSend["data"]="Can't fetch lookup info at the moment.Please try again later. If problem persists, call support"
                res.send(objectToSend);
            }else{

                var infoSql="Select "

                for(var i=0;i<results.length;i++){
                    infoSql+=results[i].input_cols

                    if(i<results.length-1){
                        infoSql+=","
                    }
                }

                infoSql+=" from lookup_info where lookup_id='"+lookup_id+"'"

                ruleEngineCon.query(infoSql,function(error1,results1){
    
                    if(error1){
                        console.log("Error-->routes-->ruleComponents-->metaDefinition-->getLookupInfo--",error1)
                        objectToSend["error"]=true
                        objectToSend["data"]="Can't fetch lookup info at the moment.Please try again later. If problem persists, call support"
                        res.send(objectToSend);
                    }else{
                        objectToSend["error"]=false
                        objectToSend["data"]=results1;
                        res.send(objectToSend);
                    }
                })

                
                
                
            }
        })
    }catch(ex){
        console.log("Error-->routes-->ruleComponents-->metaDefinition-->getLookupInfo--",ex)
        objectToSend["error"]=true
        objectToSend["data"]="Can't fetch lookup info at the moment.Please try again later. If problem persists, call support"
        res.send(objectToSend);
    }
    
});


router.delete('/deleteLookup:dtls',(req,res) => {

    try{

        var objectToSend={}

        var lookup_id=req.params.dtls;

        var query="delete from lookup_info where lookup_id='"+lookup_id+"'"

        ruleEngineCon.query(query,function(error,results){
            if(error){
                console.log("Error-->routes-->ruleComponents-->metaDefinition-->deletelookup--",error)
                objectToSend["error"]=true
                objectToSend["data"]="Can't delete lookup at the moment.Please try again later. If problem persists, call support"
                res.send(objectToSend);
            }else{
                objectToSend["error"]=false
                objectToSend["data"]="Lookup deleted successfully"
                res.send(objectToSend);
            }
        })

    }catch(ex){
        console.log("Error-->routes-->ruleComponents-->metaDefinition-->deletelookup--",ex)
        objectToSend["error"]=true
        objectToSend["data"]="Can't delete lookup at the moment.Please try again later. If problem persists, call support"
        res.send(objectToSend);
    }
})

router.get('/getLookupInputCols', (req, res) => {

    try{

        var objectToSend={}

        var query="Select lookup_type,lookup_sub_type,group_concat(input_cols) as input_cols from db_to_inputs"
                +" group by lookup_type,lookup_sub_type"

        ruleEngineCon.query(query,function(error,results){
            if(error){
                console.log("Error-->routes-->ruleComponents-->metaDefinition-->getLookupInputCols--",error)
                objectToSend["error"]=true
                objectToSend["data"]="Something bad happened.Please try again later. If problem persists, call support"
                res.send(objectToSend);
            }else{

                var temp={};

                for(var i=0;i<results.length;i++){
                   

                    if(results[i].lookup_type in temp){
                        
                        temp[results[i].lookup_type][results[i].lookup_sub_type]=results[i].input_cols.split(",")
                    }else{
                        var obj={}
                        obj[results[i].lookup_sub_type]=results[i].input_cols.split(",")
                        temp[results[i].lookup_type]=obj;
                    }

                    
                }

                objectToSend["error"]=false
                objectToSend["data"]=temp
                res.send(objectToSend);
            }
        })
    }catch(ex){
        console.log("Error-->routes-->ruleComponents-->metaDefinition-->getLookupInputCols--",ex)
        objectToSend["error"]=true
        objectToSend["data"]="Something bad happened.Please try again later. If problem persists, call support"
        res.send(objectToSend);
    }

})


router.post('/createLookup',(req,res) => {
    try{

        var objectToSend={}
        var obj=req.body;

        var query="insert into lookup_info "

        var cols=Object.keys(obj)

        var inputCols="";
        var inputVals="";

        for(var i=0;i<cols.length;i++){
            inputCols+=cols[i]
            inputVals+="'"+obj[cols[i]]+"'"

            if(i<cols.length-1){
                inputCols+=","
                inputVals+=","
            }
        }

        query+="("+inputCols+") values ("+inputVals+")"

        console.log(query)

        ruleEngineCon.query(query,function(error,results){
            if(error){
                console.log("Error-->routes-->ruleComponents-->metaDefinition-->createLookup--",error)
                objectToSend["error"]=true
                objectToSend["data"]="Can't create lookup at the moment.Please try again later. If problem persists, call support"
                res.send(objectToSend)
            }else{
                objectToSend["error"]=false
                objectToSend["data"]=results.insertId
                res.send(objectToSend)
            }
        })



    }catch(ex){
        console.log("Error-->routes-->ruleComponents-->metaDefinition-->createLookup--",ex)
        objectToSend["error"]=true
        objectToSend["data"]="Can't create lookup at the moment.Please try again later. If problem persists, call support"
        res.send(objectToSend);
    }
})



router.put('/updateLookup',(req,res) => {
    try{
        var objectToSend={}

        var obj=req.body;

        var updateCols="";
        var colValues=""

        var query="update lookup_info set "

        var temp=Object.keys(obj);

        for(var i=0;i<temp.length;i++){
            query+=temp[i]+"='"+obj[temp[i]]+"'"

            if(i<temp.length-1){
                query+=","
            }
        }

        query+=" where lookup_id='"+obj.lookup_id+"'"

        console.log(query)

        ruleEngineCon.query(query,function(error,results){
            if(error){
                console.log("Error-->routes-->ruleComponents-->metaDefinition-->updateLookup--",error)
                objectToSend["error"]=true
                objectToSend["data"]="Can't updateLookup lookup at the moment.Please try again later. If problem persists, call support"
                res.send(objectToSend);
            }else{
                objectToSend["error"]=false
                objectToSend["data"]="Lookup updated successfully"
                res.send(objectToSend);
            }
        })




    }catch(ex){
        console.log("Error-->routes-->ruleComponents-->metaDefinition-->updateLookup--",ex)
        objectToSend["error"]=true
        objectToSend["data"]="Can't updateLookup lookup at the moment.Please try again later. If problem persists, call support"
        res.send(objectToSend);
    }
})
module.exports=router;