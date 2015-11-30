
angular.module('meanie', ['ngRoute', 'ngResource'])
    .config(['$routeProvider', function($routeProvider) {
        'use strict'; 

        var mainRoute = { 
			controller	: 'mainCtrl', 
			templateUrl	: '/views/main.phtml'  
	    }; 
          
        $routeProvider 
            .when('/', mainRoute)  
    		.otherwise({ 
    			redirectTo: '/' 
    		}); 
    }]);

angular.module('meanie')
 	.factory('File', ['$resource', function($resource) { 
	    return $resource('/api/file/:id');
	}])
 	.factory('Bookmark', ['$resource', function($resource) { 
	    return $resource('/api/bookmark');
	}]) 
 	.factory('Actor', ['$resource', function($resource) { 
	    return $resource('/api/actor/:id');
	}]) 
 	.factory('Studio', ['$resource', function($resource) { 
	    return $resource('/api/studio/:id');
	}])  ;


angular.module('meanie')
  	.filter("trustUrl", ['$sce', function ($sce) {
        return function (recordingUrl) {
            return $sce.trustAsResourceUrl(recordingUrl);
        };
    }]);   
    	    
	
String.prototype.shorter = function (limit) {
    var $limit = limit || 25;
    if (this.length <= $limit) return this.substr(0);
    $half = $limit / 2;
    return this.substr(0, $half) + ".." + this.substr (this.length - $half); 
}; 
var NOT_FOUND_ICON = "/img/0";
