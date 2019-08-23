var mysql = require('mysql');

//start mysql connection
    var comcon = mysql.createConnection({
    host: '192.168.0.230', //mysql database host name
    user: 'rajan', //mysql database user name
    password: 'fun2learn', //mysql database password
}); 
/* var comcon= mysql.createConnection({
    host: 'localhost', //mysql database host name
    user: 'root', //mysql database user name
    password: 'root', //mysql database password
});  */
comcon.connect(function (err) {
    if (err) {
        console.log('Error in Mysql connection  :-', err);
    } else {
        console.log('You are now connected');
    }
})

module.exports=comcon;
