var PAGE_SIZE 	= 24,
	CACHE_DIR 	= "cache/msg/",
    fs 			= require('fs'),
	appConfig 	= JSON.parse(fs.readFileSync('./app.json')),
	mysql 		= require ("mysql");

 

module.exports.openDb = function (connectionpool, callback) {
    connectionpool.getConnection(function(err, connection) {
        console.log (" connected");
        if (err) {
            console.error('CONNECTION error: ', err);
		    connection.release ();
            return callback (err);
        }  
		callback(connection);
    }); 
};

module.exports.connectDb = function () {
    console.log ("mysql createPool");
	return mysql.createPool(appConfig.dataPool);
};

module.exports.queryData = function (connection, query, callback, release, pagenum) {
    var response;    
    connection.query(query, function(err, rows, fields) {
        if (err) {
            console.error(err); 
            return{
                result: 'error',
                err:    err.code
            };
        }
      
        callback({
            result: 'success', 
            fields: fields,
            json:   !pagenum ? rows : rows.splice( (pagenum - 1) * PAGE_SIZE, PAGE_SIZE  ),
            length: rows.length
        }); 
        
        if (release) {
        	console.log ("releasing connection", query);
        	connection.release(); 
        } 
     });	 
};

 

module.exports.config = appConfig; 

