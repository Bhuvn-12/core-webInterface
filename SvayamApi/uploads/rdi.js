var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');

var mysql = require('mysql');
var config={
    host: 'localhost', //mysql database host name
    user: 'root', //mysql database user name
    password: 'root', //mysql database password
    database: 'user', //mysql database name
}
var connection = mysql.createConnection(config);  

connection.connect(function (err) {
    if (err) {
        console.log('Error in Mysql connection With Metadata database :-', err);
    } else {
        console.log('You are now connected with mysql Metadata database...');
    }
})
app.use(bodyParser.json()); 
    // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));


app.use(cors());
app.options('*', cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}); 
app.get('/work', function (req, res) {
    var sqlquery = "select * from work_pending limit 3";
    connection.query(sqlquery, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send(JSON.stringify("Sql error"))
        }
        else {
            console.log(results);
            res.send(results);
        }
    });
});
app.get('/sale', function (req, res) {
    var sqlquery = "select * from sale";
    connection.query(sqlquery, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send(JSON.stringify("Sql error"))
        }
        else {
            console.log(results);
            res.send(results);
        }
    });
});
app.get('/saletoday', function (req, res) {
    var sqlquery = "select count(id) as c,sum(price) as s from sale where date=CURRENT_DATE";
    connection.query(sqlquery, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send(JSON.stringify("Sql error"))
        }
        else {
            console.log(results);
            res.send(results);
        }
    });
});
app.get('/salethismonth', function (req, res) {
    var sqlquery = "select count(id) as c,sum(price) as s from sale where month(date)=month(CURRENT_DATE)";
    connection.query(sqlquery, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send(JSON.stringify("Sql error"))
        }
        else {
            console.log(results);
            res.send(results);
        }
    });
});
app.get('/salethisyear', function (req, res) {
    var sqlquery = "select count(id) as c,sum(price) as s from sale where year(date)=year(CURRENT_DATE)";
    connection.query(sqlquery, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send(JSON.stringify("Sql error"))
        }
        else {
            console.log(results);
            res.send(results);
        }
    });
});
app.get('/saletotal', function (req, res) {
    var sqlquery = "select count(id) as c,sum(price) as s from sale";
    connection.query(sqlquery, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send(JSON.stringify("Sql error"))
        }
        else {
            console.log(results);
            res.send(results);
        }
    });
});
app.get('/totalemp', function (req, res) {
    var sqlquery = "select count(id) as c,sum(salary) as s from employee";
    connection.query(sqlquery, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send(JSON.stringify("Sql error"))
        }
        else {
            console.log(results);
            res.send(results);
        }
    });
});
app.get('/totalpurchase', function (req, res) {
    var sqlquery = "select count(id) as c,sum(price) as s from purchase";
    connection.query(sqlquery, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send(JSON.stringify("Sql error"))
        }
        else {
            console.log(results);
            res.send(results);
        }
    });
});
app.get('/stock', function (req, res) {
    var sqlquery = "select * from stock";
    connection.query(sqlquery, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send(JSON.stringify("Sql error"))
        }
        else {
            console.log(results);
            res.send(results);
        }
    });
});
app.get('/getemp', function (req, res) {
    var sqlquery = "select id,concat(fname,' ',lname) as name, dep, level,profile from employee";
    connection.query(sqlquery, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send(JSON.stringify("Sql error"))
        }
        else {
            console.log(results);
            res.send(results);
        }
    });
});
app.get('/getsalary', function (req, res) {
    var sqlquery = "select id,concat(fname,' ',lname) as name, email, status,salary,contact1,dep,level,salary,profile from employee";
    connection.query(sqlquery, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send(JSON.stringify("Sql error"))
        }
        else {
            console.log(results);
            res.send(results);
        }
    });
});
app.post('/bill', function (req, res) {
    console.log(req.body);
    var input = req.body;
    var x=input[0];

    var q="insert into sale(cust_name,item_name,item_id,price,quantity,ser_no,payment_mode,date) values('"+x.cust_name+"','"+x.item_name+"','"+"123"+"','"+x.price+"','"+x.quantity+"','"+"1235"+"','"+x.payment_mode+"','"+x.date+"')";

    for(var i=1;i<input.length;i++){
        x=input[i];
        q=q+","+"('"+x.cust_name+"','"+x.item_name+"','"+"123"+"','"+x.price+"','"+x.quantity+"','"+"1235"+"','"+x.payment_mode+"','"+x.date+"')";


    }
    console.log(q);
    connection.query(q, function (error, results) {
        if (error) {
                console.log("Error routes-->signup-->signUp--",error);
                res.end(JSON.stringify("error"))
        }else{
                
                res.end(JSON.stringify("Ok"));
        }
    });
});

app.post('/hire', function (req, res) {
    console.log(req.body);
    var x = req.body;
    

    var q="insert into employee(fname,lname,contact1,contact2,dob,joining,dep,level,profile,salary,addr1,addr2,zip,city,state,country,status,email) values('"+x.fname+"','"+x.lname+"','"+x.contact1+"','"+x.contact2+"','"+x.dob+"','"+x.joining+"','"+x.dep+"','"+x.level+"','"+x.profile+"','"+x.salary+"','"+x.address1+"','"+x.address2+"','"+x.zip+"','"+x.city+"','"+x.state+"','"+x.country+"','Active','"+x.email+"')";

    
    console.log(q);
    connection.query(q, function (error, results) {
        if (error) {
                console.log("Error routes-->signup-->signUp--",error);
                res.end(JSON.stringify("error"))
        }else{
                
                res.end(JSON.stringify("Ok"));
        }
    });
});
               
                   
var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
});



