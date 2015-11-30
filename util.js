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


function exists (type, id) { 
	if (!(id && id.length && id > 0)) return false;
	return fs.existsSync(CACHE_DIR + type + "-" + id + ".msg");
} 

function save (type, id, data) { 
	fs.writeFile(CACHE_DIR + type + "-" + id + ".msg", data, function(err) {
	    if(err) {
	        return console.log(err);
	    } 
	    console.log(id, "The file was saved!");
	});
}
 
function open (type, id, callback) { 
	fs.readFile(CACHE_DIR + type + "-" + id + ".msg", 'utf8', function (err, data) {
		callback (data);
	});
}

module.exports.config = appConfig;
module.exports.exists = exists;
module.exports.save = save;
module.exports.open = open; 
module.exports.NOT_FOUND_ICON = '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';




