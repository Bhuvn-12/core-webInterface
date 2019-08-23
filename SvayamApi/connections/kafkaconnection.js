var kafka = require('kafka-node')
var propObj=require('../config_con.js');
//kafka connection 


HighLevelProducer = kafka.HighLevelProducer;
client = new  kafka.Client(propObj.kafkaHost);
producer = new HighLevelProducer(client);
//check prduce is ready or not
producer.on('ready', function () {
    console.log('Producer is ready');
});
producer.on('error', function (err) {
    console.log('Producer is in error state');
    console.log(err);
})
module.exports=producer;