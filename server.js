/*
 * MEANjs API server (v.0.0.1)
 * 
 * Instatiate API routes dynamically
 */

var utility = require ('./util.js'), 
    connect = utility.connectDb(),
	portnum = utility.config.hostPort,
	modeldb = utility.config.modelDir,
	postman = require ('body-parser'),  
    express = require ('express'),
	filesys = require ('fs'),
	program = express ();

function enroute(word, verb) {
	var route  = verb.route, action = verb.action; 
    console.log (':: adding route -> %s:%s', word, route);
	program[word](route, function(request, response) {   
		action (request, response, connect); 
	});		
}
	
program.use (express.static (__dirname + '/public')); 
program.use (postman.json({limit: '50mb'})); // POST support
program.use (postman.urlencoded({ limit: '50mb', extended : true }));

filesys.readdir(modeldb, function (err, files) { 
	for (var model, file, i = 0; file = files[i]; i++) {
		model = require(modeldb + file);
		for (var word in model.verbs) { 
			enroute (word, model.verbs[word]);	
		}
	}    
});  

program.listen(portnum, function () { 
    console.log('It is on (at http://localhost:%s)!', portnum);
});	