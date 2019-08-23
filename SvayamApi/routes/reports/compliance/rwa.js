var express = require('express');
var router = express.Router();
var conSystemData = require('../../../connections/mysqlsystemdata.js');
var conUserData = require('../../../connections/mysqllegalentity.js');
var hiveconnection = require('../../../connections/hiveconnection.js');
var asyncjs = require('async');


hiveDb = hiveconnection.hivecon;
jdbcconnerr = hiveconnection.connerr

var resultsetlvl2;
var resultsetlvl3;


router.post('/capitallevel1', function (req, res) {
    var input = req.body;
    var value = {};
    console.log("&&&&&&&&&&&&&&&&&&", input)
    var sqlquery = "";

    if (jdbcconnerr == 1) {
        res.send(JSON.stringify("Error in connction with Hive"))
    } else {
        var params = input;
        console.log(params)
        gaap_cd = "";
        var gaapArr = input.gaap_cd;
        for (var i = 0; i < gaapArr.length; i++) {
            if (i == 0) {
                gaap_cd = "'" + gaapArr[i] + "'";
            } else {
                gaap_cd = gaap_cd + ",'" + gaapArr[i] + "'";
            }
        }
        var keys = [];
        sqlquery = "SELECT lr_sub_cat,lr_exposure_type,balance from svayam_data.bal_instrument_ledger s where (s.book_cd in (" + gaap_cd + ") and s.tgt_curr_cd='" + params.tgt_curr_cd + "' and s.tgt_curr_type_cd='" + params.tgt_curr_type_cd + "' and s.acct_dt='" + params.acct_dt + "' and s.org_unit_cd='" + params.org_unit_cd + "' and lr_cat='capital' and s.processing_date='" + params.ppd + "' ";

        sqlquery = sqlquery + ") "
        console.log("final Query------->" + sqlquery);
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

                                            if (err){ 
						console.log(err);
						return callback(err);
}
                                            var firstrow = rs.rows.next();

                                            if (firstrow.done) {
                                                value['error'] = true
                                                value['data'] = "No Data found";
                                                res.send(value);
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
                                                value['error'] = false
                                                value['data'] = rs.rows;
						console.log(value['data'][0]);
                                                res.send(value)
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

router.post('/risklevel1', function (req, res) {
    var value = {};
    var sqlquery = "";
    var params = req.body;
    console.log("***risk*****", params)
    if (jdbcconnerr == 1) {
        res.send(JSON.stringify("Error in connction with Hive"))
    } else {
        // var params = JSON.parse(req.params.lvl1filter);
        console.log(params)
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
        sqlquery = "SELECT lr_exposure_type,risk_weight,credit_conversion_factor,sum(balance) as balance from(SELECT lr_exposure_type,risk_weight,credit_conversion_factor,balance from svayam_data.bal_instrument_ledger s  where (s.book_cd in (" + gaap_cd + ") and s.tgt_curr_cd='" + params.tgt_curr_cd + "' and s.tgt_curr_type_cd='" + params.tgt_curr_type_cd + "' and s.acct_dt='" + params.acct_dt + "' and s.org_unit_cd='" + params.org_unit_cd + "' and lr_cat='rwa'  and s.processing_date='" + params.ppd + "' ";

        sqlquery = sqlquery + "))t group by lr_exposure_type,risk_weight,credit_conversion_factor "
        console.log("final Query---->" + sqlquery);
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
                                            if (err) {
                                                console.log(err);
                                                return callback(err);
                                            }

                                            var firstrow = rs.rows.next();
                                            console.log("\n\n\n resultset", firstrow)
                                            if (firstrow.done) {
                                                value['error'] = true
                                                value['data'] = "No Data found";
                                                res.send(value);
                                            } else {
                                                var rowIter = rs.rows;
                                                var rows = [];
                                                var row = firstrow;
                                                console.log("\n\n\n resultset", firstrow)
                                                while (!row.done) {
                                                    rows.push(row.value);
                                                    // console.log(rows[count])
                                                    count++;
                                                    row = rowIter.next();
                                                }
                                                rs.rows = rows;
                                                value['error'] = false
                                                value['data'] = rs.rows;
						console.log(value['data'][0]);
                                                res.send(value)
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

router.post('/rwalevel2', function (req, res) {
    var value = {};
   console.log('inside rwa');
    var input = req.body;
    console.log(input);
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
        var check = 0;
        var sqlquery = "SELECT " + column_name + ",1 as risk_weight,1 as credit_conversion_factor,balance from svayam_data.bal_instrument_ledger s left join svayam_data.sal arr on(s.arr_num=arr.arr_num and s.arr_src_cd=arr.arr_src_cd and s.arr_suf=arr.arr_suf and s.org_unit_cd=arr.org_unit_cd) where (s.book_cd in (" + gaap_cd + ") and s.tgt_curr_cd='" + params.tgt_curr_cd + "' and s.tgt_curr_type_cd='" + params.tgt_curr_type_cd + "' and s.acct_dt='" + params.acct_dt + "'  and s.org_unit_cd='" + params.org_unit_cd + "'  "

        if (params.lr_sub_cat != "" && params.lr_sub_cat != undefined) {
            sqlquery = sqlquery + "and lr_sub_cat='" + params.lr_sub_cat + "' ";
            check = 1;
        }
        if (params.lr_explosure_type != undefined && params.lr_explosure_type != "") {
            if (check == 1) {
                sqlquery += "and lr_exposure_type='" + params.lr_explosure_type + "' ";
            } else {
                sqlquery = "";
                sqlquery = "SELECT " + column_name + ",risk_weight,credit_conversion_factor,balance from svayam_data.bal_instrument_ledger s left join svayam_data.sal arr on(s.arr_num=arr.arr_num and s.arr_src_cd=arr.arr_src_cd and s.arr_suf=arr.arr_suf and s.org_unit_cd=arr.org_unit_cd) where (s.book_cd in (" + gaap_cd + ") and s.tgt_curr_cd='" + params.tgt_curr_cd + "' and s.tgt_curr_type_cd='" + params.tgt_curr_type_cd + "' and s.acct_dt='" + params.acct_dt + "'  and s.org_unit_cd='" + params.org_unit_cd + "' and lr_exposure_type='" + params.lr_explosure_type + "' and s.risk_weight='"+params.risk_weight+"' and s.credit_conversion_factor='"+params.credit_conversion_factor+"'  and s.processing_date='" + params.ppd + "'"

            }

        }
        if (params.acct_num != undefined && params.acct_num != "") {
            sqlquery = sqlquery + " and s.acct_num='" + params.acct_num + "' "

        }
        sqlquery = sqlquery + ")";
        console.log(sqlquery);
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
				console.log("oooo",err);
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
                                            if (err){
						console.log(err);
						return callback(err);

					}
                                            var firstrow = rs.rows.next();
                                            if (firstrow.done) {
                                                console.log('inside else');
                                                value['error'] = true
                                                value['data'] = "No Data found";
                                                res.send(value);
                                            } else {
                                                console.log('inside else');
                                                var rowIter = rs.rows;
                                                resultsetrwalvl2 = rowIter;
                                                var rows = [];
                                                var row = firstrow;
                                                while (!row.done) {
                                                    rows.push(row.value);
                                                    // console.log(rows[count])
                                                    count++;
                                                   /* if (count == 100) {
                                                        break;
                                                    } */
                                                    row = rowIter.next();
                                                }
                                                rs.rows = rows;
                                                value['error'] = false
                                                value['data'] = rs.rows;
						console.log(value['data'][0]);
                                                res.send(value)
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


router.post('/rwalevel3', function (req, res) {
    var value = {};
    var input = req.body;
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

        var sqlquery = "SELECT " + column_name + ",txn_amt from svayam_data.sje s where (s.book_cd in (" + gaap_cd + ") and s.tgt_curr_cd='" + params.tgt_curr_cd + "' and s.tgt_curr_type_cd='" + params.tgt_curr_type_cd + "' and s.acct_dt<='" + params.acct_dt + "' and s.arr_num=" + params.arr_num + " and s.arr_suf='" + params.arr_suf + "' and s.arr_src_cd='" + params.arr_src_cd + "' and s.org_unit_cd='" + params.org_unit_cd + "'  ";
        /*	if(params.lr_sub_cat!=""|| params.lr_sub_cat!=undefined){
                sqlquery=sqlquery+"and lr_sub_cat='"+params.lr_sub_cat+"' ";
            }
            if(params.lr_explosure_type!=undefined ||params.lr_explosure_type!=""){
                sqlquery=sqlquery+"and lr_exposure_type='"+params.lr_explosure_type+"' ";
            }*/
        if (params.acct_num != undefined && params.acct_num != "") {
            sqlquery = sqlquery + " and acct_num='" + params.acct_num + "' "
        }


        sqlquery = sqlquery + " ) group by " + column_name + ", txn_amt";

        console.log("my query :-" + sqlquery);
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
                                            var firstrow = rs.rows.next()

                                            if (firstrow.done) {
                                                value['error'] = true
                                                value['data'] = "No Data found";
                                                console.log(value);
                                                res.send(value);
                                            } else {
                                                var rowIter = rs.rows;
                                                resultsetrwalvl3 = rowIter;
                                                var rows = [];
                                                var row = firstrow;
                                                while (!row.done) {
                                                    rows.push(row.value);
                                                    count++;
                                                  /*  if (count == 100) {
                                                        break;
                                                    } */
                                                    row = rowIter.next();
                                                }
                                                rs.rows = rows;
                                                value['error'] = false
                                                value['data'] = rs.rows;
                                                console.log(value['data'][0]);
                                                res.send(value)
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
