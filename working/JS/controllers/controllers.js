angular.module('newapplication') 
    .controller('mainCtrl', ["$scope", "$location", "$routeParams" ,
    	function ($scope, $location, $routeParams ) {   
    	 
    	 	$scope.coolstuff = [
    	 		{ name : 'AngularJS'},
    	 		{ name : 'Bootstrap'},
    	 		{ name : 'MySQL'},
    	 		{ name : 'Express'}
    	 	];
			    
	}]) ;
	
	