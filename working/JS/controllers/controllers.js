angular.module('meanie') 
    .controller('mainCtrl', ["$scope", "$location", "$routeParams", "$rootScope", "File", "Bookmark", "Actor", "Studio",
    	function ($scope, $location, $routeParams, $rootScope, File, Bookmark, Actor, Studio) {   
    		var clones = ['select', 'leave', 'find', 'swap', 'edit', 'save', 'mark', 
    						'settime', 'setfind', 'dispose', 'getActor', 'getStudio'], 
    			bookPage = 1, 
    			filePage = 1, 
    			findPage = 1;
    		
    		/* private */ function createClone (clone) {
	    		console.log ('creating ' + clone + ' method');
	    		$scope['d' + clone] = function () {
	    		    console.log ('exec ' + clone + ' method');
	    			return $scope[clone];
	    		}; 
    		}
    		 
    		/* private */ function fillRow(originalRows, newRows) { 
				var clone; 
				if (clone = originalRows) { 
					for (var row, i = 0; row = newRows[i]; i++) { 
						clone.push(row);
					} 
					return clone; 
				}     
				return newRows;
			}
			
    		/* private */ function getBookmarks () {
			    Bookmark.get ({ page : bookPage }, function (response) {
			   		console.log ('Bookmark.get', bookPage, response); 
			   		$scope.bookmarks = fillRow($scope.bookmarks, response.json);
			    }); 
    		} 
    		
    		/* private */ function getVideos () {
			    File.get ({ page : filePage }, function (response) {
			   		console.log ('File.get', response);
			   	//	$scope.selected = {};
			   		$scope.records  = fillRow($scope.records, response.json);//response.json;
			    }); 
    		}
    		
    		/* private */ function getActors () {
			    Actor.get ({ }, function (response) { 
			   		$scope.actors = response.json;
			    }); 
    		}
    		
    		/* private */ function getStudios () {
			    Studio.query ({ }, function (response) { 
			   		$scope.studios = response;
			    }); 
    		}
    		
    		/* private */ function sendtoPlayer (file) { 
    			for (var f, i = 0; f = $scope.players[i]; i++);
    			console.log(i, file); 
    			// file.url = "http://sploosh/default/index/play?id=" + file.id;
    			file.url = "/video/" + file.id;
    			$scope.players[i] = file;
    			if (i == 0) {
	    			$scope.selected = file;
	    			$scope.dialogLabel = "Files from " + file.Studio;
	    			$scope.dialogRecords = file.Related;
    			}
    			$rootScope.$broadcast('playchange', $scope.players);
    		}
    		
    		/* private */ function pageLoad () {
    			for (var clone, i = 0; clone = clones[i++]; createClone(clone)) ;
    			$scope.players = [false,false,false,false]; 
    			$scope.findbar = false;
    			$scope.actorstring = $scope.photostring = "";
			    getVideos (); 
			    getBookmarks ();
			    getActors ();
			    getStudios ();
    		} 

    		/* private */ function beforeRequest () {
    			$scope.findbar = false;
    			$scope.dialogRecords = [];
    			$scope.dialogLabel = "Loading...";
    		}
    		
    		
    		$scope.save = function () {  
    			console.log('photostring', $scope.photostring);
    			console.log('actorstring', $scope.actorstring); 
    			
    			$scope.edited.photostring = $scope.photostring;
    			$scope.edited.actorstring = $scope.actorstring;
    			
    			console.log($scope.edited); 
    			File.save ($scope.edited); 
    		};
    		
    		$scope.mark = function (id, photo, time, callback) {  
    			Bookmark.save ({id:id, photo:photo, time:time }, function (ret) {
    				console.log (ret);
    				bookPage = 1;
    				$scope.bookmarks = [];
    				getBookmarks ();
    				
	    			File.get ({id : id}, function (response) { 
	    				console.log ('scope.mark', response);
	    				callback (response); 
	    			}); 
    			});
    		};
    		
    		$scope.edit = function (file) {  
    			$scope.edited = file;
    		};
    		
    		$scope.swap = function (which) {  
    			console.log(which, $scope.players[which]); 
    			var screenSrc = angular.copy($scope.players[which]),
    				screenDst = angular.copy($scope.players[0]); 
    			$scope.players[0] = screenSrc;
    			$scope.players[which] = screenDst;
    		};
    		
    		$scope.settime = function (i, time) { 
    			if($scope.players[i]) {
    				$scope.players[i].currentTime = time;
    			}
    		}; 
				
			$scope.$watch('findbar', function(newvideo, oldvideo) {
                if (newvideo) {
                	console.log (" ?? findbar is now -> ", $scope.findbar); 
                } 
            });  
	            
    		$scope.setfind = function () { 
    			console.log ("setfind is being called!");
    			$scope.findbar = true;
    		};
    		
			$scope.fileMore = function () {
				if (!$scope.records) return;
				filePage ++;
				getVideos ();
			};

			$scope.bookMore = function () {
				bookPage ++;
				getBookmarks ();
			};

    		$scope.select = function (record, time) {
    			console.log ("Selecting ", record.id, record.Mediafk);
    			File.get ({id : record.Mediafk || record.id}, function (response) {
    				response.currentTime = time;
    				sendtoPlayer (response); 
    			}); 
    		}; 
    		
    		$scope.find = function (param) { 
    			beforeRequest ();
    			File.get ({param : param, page : findPage}, function (response) {
	    			$scope.dialogLabel = "Videos like ->" + param;
	    			$scope.dialogRecords = response.json;
    			}); 
    		}; 
    		
    		$scope.leave = function (i) {
    			console.log('leave', i);
    			$scope.players[i] = null;
    			$rootScope.$broadcast('playchange', $scope.players);
    		};
    		
    		$scope.getActor = function (star) {
    			beforeRequest ();
    			Actor.get ({id : star.id}, function (actor) { 
    				console.log (actor); 
	    			$scope.dialogLabel = "Videos with " + actor.Actorname;
	    			$scope.dialogRecords = actor.Related;
    			}); 
    		};
    		
    		$scope.getStudio = function (studio) {
    			console.log (studio,'studio'); 
    			beforeRequest ();
    			Studio.get ({id : studio.key}, function (studio) { 
    				console.log (studio); 
	    			$scope.dialogLabel = "Videos from " + studio.key;
	    			$scope.dialogRecords = studio.Related;
    			}); 
    		};
    		  
    		$scope.dispose = function () {
    			console.log('dispose');
    			$scope.players = [false,false,false,false];
    			$scope.selected = false;
    			$rootScope.$broadcast('playchange', $scope.players);
    			$rootScope.$broadcast('dispose');
    		};  
    		
    		pageLoad ();        
			    
	}]) ;
	
	