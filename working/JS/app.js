
angular.module('newapplication', ['ngRoute', 'ngResource'])
    .config(['$routeProvider', function($routeProvider) { 

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
 