var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');





//start body-parser configuration
app.use(bodyParser.json()); 
    // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));


app.use(cors());
app.options('*', cors());
app.use(function (req, res, next) {
    //set headers to allow cross origin request.
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}); 




/////////////////F_add start



var srcSys_manual=require('./routes/sources/manual.js');
app.use('/sources/manual',srcSys_manual)

var srcSys_admin=require('./routes/sources/admin.js');
app.use('/sources/admin',srcSys_admin)

var srcSys_status=require('./routes/sources/status.js');
app.use('/sources/status',srcSys_status)

var settings_admin_user=require('./routes/settings/admin/user.js');
app.use('/settings/admin/user',settings_admin_user)

var home_page=require('./routes/home.js');
app.use('/home',home_page)

var login_page=require('./routes/login.js');
app.use('/login',login_page)

var sig_page=require('./routes/signup.js');
app.use(sig_page)

var profile=require('./routes/profile.js');
app.use("/profile",profile)

var ops=require('./routes/operations.js');
app.use("/operations",ops)

var organisation=require('./routes/settings/configuration/organisation.js');
app.use("/settings/configuration/organisation",organisation)

var adj_ile=require('./routes/adjustment/instrumentLedgerEntry.js');
app.use("/adjustment/instrumentLe",adj_ile)

var ref_data=require('./routes/settings/configuration/referenceData.js');
app.use("/settings/configuration/referenceData",ref_data)

var test=require('./routes/testFiles/hiveTest.js');
app.use("/test",test)

////////////////////F_add end





//Server listen method
var server = app.listen(3001, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
});



