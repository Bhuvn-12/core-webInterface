var express = require('express');
var router = express.Router();
var conSystemData = require('../../../connections/mysqlsystemdata.js');
var conUserData = require('../../../connections/mysqllegalentity.js');
var hiveconnection = require('../../../connections/hiveconnection.js');
var asyncjs = require('async');


hiveDb=hiveconnection.hivecon;
jdbcconnerr=hiveconnection.connerr

var resultsetlvl2;
var resultsetlvl3;




router.post('/level1', function (req, res) {
  
    var input=req.body;
    console.log("********************************************* Level1 "+input);
    var sqlquery = "";
   var value={};
    var objectToSend={};
    if (jdbcconnerr == 1) {
        console.log("Error routes-->reports-->control-->trial_balance-->level1--Error in jdbc connection");
        objectToSend["error"]=true;
        objectToSend["data"]="Can't connect with datastore at the moment"
        res.end(JSON.stringify(objectToSend))
    } else {
        var params = input;
        gaap_cd = "";
        var gaapArr = params.gaap_cd;
        for (var i = 0; i < gaapArr.length; i++) {
            if (i == 0) {
                gaap_cd = "'" + gaapArr[i] + "'";
            } else {
                gaap_cd = gaap_cd + ",'" + gaapArr[i] + "'";
            }
        }
        var keys = [];
        sqlquery = "SELECT lvl4_cd,lvl1_desc, lvl2_desc,lvl3_desc,lvl4_desc,balance from svayam_data.bal_instrument_ledger s left join (select* from svayam_data.ref_chart_of_acc where org_unit_cd='" + params.org_unit_cd + "'  ) ref_chart_of_acc on(s.acct_num=leaf_cd )  where (s.book_cd in (" + gaap_cd + ") and s.tgt_curr_cd='" + params.tgt_curr_cd + "' and s.tgt_curr_type_cd='" + params.tgt_curr_type_cd + "' and s.acct_dt='" + params.acct_dt + "' and s.org_unit_cd='" + params.org_unit_cd + "' and s.processing_date='" + params.ppd + "' ";


        sqlquery = sqlquery + ") order by lvl4_cd "
        console.log("final Query----->" + sqlquery);
        hiveDb.reserve(function (err, connObj) {
            if (connObj) {
                console.log("Using connection: " + connObj.uuid);
                var conn = connObj.conn;
                // Query the database.
                asyncjs.series([
                    function (callback) {
                        // Select statement example.
                        conn.createStatement(function (err, statement) {
                            if (err) {
                                callback(err);
                            } else {
                                statement.executeQuery(sqlquery, function (err, resultset) {
                                    if (err) {
                                        callback(err)
                                    } else {
                                        // Convert the result set to an object array.
                                        var count = 0;
                                        resultset.toObjectIter(function (err, rs) {
                                            if (err) return callback(err);
                                            var firstrow = rs.rows.next();
                                            if (firstrow.done) {
                                                value['error']=true;
                                                value['data']="No Data found";
                                                res.send( value);
                                            } else {
                                                var rowIter = rs.rows;
                                                var rows = [];
                                                var row = firstrow;
                                                while (!row.done) {
                                                    rows.push(row.value);
                                                    // console.log(rows[count])
                                                    count++;
                                                    row = rowIter.next();
                                                }
                                                rs.rows = rows;
                                                value['error']=false;
                                                value['data']=rs.rows;
						console.log(value['data'][0]);
                                                res.send( value);
                                               
                                            }
                                            return callback(null, rs);
                                        });
                                    }
                                });
                            }
                        })
                    },
                ], function (err, results) {
                    // Release the connection back to the pool.
                    hiveDb.release(connObj, function (err) {
                        if (err) {
                            console.log(err.message);
                        } else {
                            console.log("conn released")
                        }
                    })
                });
            }
        });
    }
})






//*************************************************************************************************************************** */
// level2 column data request
//****************************************************************************************************************************/
router.post('/level2', function (req, res) {
   var input= req.body
   var value={};
    console.log(input)
    if (jdbcconnerr == 1) {
        res.send(JSON.stringify("Error in connction with Hive"))
    } else {

        var params_columnlist = input.columns;
        var params = input.params;
        var tempcols = params_columnlist.split(",");
        var column_name = '';
        for (var i = 0; i < tempcols.length; i++) {
            if (i == 0) {
                column_name = column_name + "s." + tempcols[i];
            } else if (i < 3) {
                column_name = column_name + ",s." + tempcols[i];
            } else {
                column_name = column_name + ",arr." + tempcols[i];
            }
        }
        gaap_cd = "";
        var gaapArr = params.gaap_cd;
        for (var i = 0; i < gaapArr.length; i++) {
            if (i == 0) {
                gaap_cd = "'" + gaapArr[i] + "'";
            } else {
                gaap_cd = gaap_cd + ",'" + gaapArr[i] + "'";
            }
        }
        var sqlquery = "SELECT " + column_name + ",balance from svayam_data.bal_instrument_ledger s left join svayam_data.sal arr on(s.arr_num=arr.arr_num and s.arr_src_cd=arr.arr_src_cd and s.arr_suf=arr.arr_suf and s.org_unit_cd=arr.org_unit_cd ) where (s.book_cd in (" + gaap_cd + ") and s.tgt_curr_cd='" + params.tgt_curr_cd + "' and s.tgt_curr_type_cd='" + params.tgt_curr_type_cd + "' and s.acct_dt='" + params.acct_dt + "' and s.acct_num='" + params.acct_num + "' and s.org_unit_cd='" + params.org_unit_cd + "' and s.processing_date='" + params.ppd + "' "
        
        
        sqlquery = sqlquery + ")";
        console.log("final Query----->"+sqlquery);
        hiveDb.reserve(function (err, connObj) {
            if (connObj) {
                console.log("Using connection: " + connObj.uuid);
                var conn = connObj.conn;
                // Query the database.
                asyncjs.series([
                    function (callback) {
                        // Select statement example.
                        conn.createStatement(function (err, statement) {
                            if (err) {
                                callback(err);
                            } else {
                                statement.executeQuery(sqlquery, function (err, resultset) {
                                    if (err) {
                                        callback(err)
                                    } else {
                                        // Convert the result set to an object array.
                                        var count = 0;
                                        resultset.toObjectIter(function (err, rs) {
                                            if (err) return callback(err);
                                            var firstrow = rs.rows.next();
                                            if (firstrow.done) {
                                                value['error']="true";
                                                value['data']="No Data Found";
                                                res.send( value);
                                            } else {
                                                var rowIter = rs.rows;
                                                resultsetlvl2 = rowIter;
                                                var rows = [];
                                                var row = firstrow;
                                                while (!row.done) {
                                                    rows.push(row.value);
                                                    // console.log(rows[count])
                                                    count++;
                                                   /* if (count == 100) {
                                                        break;
                                                    }*/
                                                    row = rowIter.next();
                                                }
                                                rs.rows = rows;
                                                value['error']=false;
                                                value['data']=rs.rows;
						console.log(value['data'][0]);
                                                res.send( value);
                                            }
                                            return callback(null, rs);
                                        });
                                    }
                                });
                            }
                        })
                    },
                ], function (err, results) {
                    // Release the connection back to the pool.
                    hiveDb.release(connObj, function (err) {
                        if (err) {
                            console.log(err.message);
                        } else {
                            console.log("conn released");
                        }
                    })
                });
            }
        });
    }
})


router.post('/level3', function (req, res) {
    var input=req.body;

    console.log(input)
    var value={};
    if (jdbcconnerr == 1) {
        res.send(JSON.stringify("Error in connction with Hive"))
    } else {
        var params_columnlist = input.columns;
        var params = input.params;
        var tempcols = params_columnlist.split(",");
        var column_name = '';
        for (var i = 0; i < tempcols.length; i++) {
            if (i == 0) {
                column_name = column_name + " " + tempcols[i];
            } else {
                column_name = column_name + "," + tempcols[i];
            }
        }

        gaap_cd = "";
        var gaapArr = params.gaap_cd;
        for (var i = 0; i < gaapArr.length; i++) {
            if (i == 0) {
                gaap_cd = "'" + gaapArr[i] + "'";
            } else {
                gaap_cd = gaap_cd + ",'" + gaapArr[i] + "'";
            }

        }

        var sqlquery = "SELECT " + column_name + ",txn_amt,ROW_NUMBER() OVER() as row_num from svayam_data.sje s where (s.book_cd in (" + gaap_cd + ") and s.tgt_curr_cd='" + params.tgt_curr_cd + "' and s.tgt_curr_type_cd='" + params.tgt_curr_type_cd + "' and s.acct_dt<='" + params.acct_dt + "' and s.acct_num='" + params.acct_num + "' and s.arr_num=" + params.arr_num + " and s.arr_suf='" + params.arr_suf + "' and s.arr_src_cd='" + params.arr_src_cd + "' and s.org_unit_cd='" + params.org_unit_cd + "'  )"



        sqlquery="Select "+column_name +", txn_amt from ("+sqlquery+")t ";

        sqlquery = sqlquery + "  group by row_num,"+ column_name +", txn_amt";

        console.log("final Query-->" + sqlquery);
        hiveDb.reserve(function (err, connObj) {
            if (connObj) {
                console.log("Using connection: " + connObj.uuid);
                var conn = connObj.conn;
                // Query the database.
                asyncjs.series([
                    function (callback) {
                        // Select statement example.
                        conn.createStatement(function (err, statement) {
                            if (err) {
					console.log(err);
                                callback(err);
                            } else {
                                statement.executeQuery(sqlquery, function (err, resultset) {
                                    if (err) {
						console.log(err);
                                        callback(err)
                                    } else {
                                        // Convert the result set to an object array.
                                        var count = 0;
                                        resultset.toObjectIter(function (err, rs) {
                                            if (err) return callback(err);
                                            var firstrow = rs.rows.next()

                                            if (firstrow.done) {
                                                value['error']=true;
                                                value['data']="No Data found";
                                                res.send(value);
                                            } else {
                                                var rowIter = rs.rows;
                                                resultsetlvl3 = rowIter;
                                                var rows = [];
                                                var row = firstrow;
                                                while (!row.done) {
                                                    rows.push(row.value);
                                                    // console.log(rows[count])
                                                    count++;
                                                   /* if (count == 100) {
                                                        break;
                                                    }*/
                                                    row = rowIter.next();
                                                }
                                                rs.rows = rows;
                                                value['error']=false;
                                                value['data']=rs.rows;
						console.log(value['data'][0]);
                                                res.send(value);
                                            }
                                            return callback(null, rs);
                                        });
                                    }
                                });
                            }
                        })
                    },
                ], function (err, results) {
                    // Release the connection back to the pool.
                    hiveDb.release(connObj, function (err) {
                        if (err) {
                            console.log(err.message);
                        } else {
                            console.log("conn released")
                        }
                    })
                });
            }
        });
    }

})






module.exports = router;
