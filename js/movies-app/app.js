var app = angular.module('WhatToWatch' , ['ui.bootstrap','ngRoute','LocalStorageModule','firebase']);

/********************************************************/
/*                       Factories                      */
/********************************************************/
app.factory("MyMovies",['$firebase',function($firebase) {
    var ref = new Firebase("https://test-todo.firebaseio.com/myMovies");
	
    return {
	
		syncChanges: function(list) {
		
			function positionFor(list, key) {
				  for(var i = 0, len = list.length; i < len; i++) {
					if( list[i].$id === key ) {
					  return i;
					}
				  }
				  return -1;
				}
				function positionAfter(list, prevChild) {
				  if( prevChild === null ) {
					return 0;
				  }
				  else {
					var i = positionFor(list, prevChild);
					if( i === -1 ) {
					  return list.length;
					}
					else {
					  return i+1;
					}
				  }
				}
				
			 ref.on('child_added', function _add(snap, prevChild) {
				var data = snap.val();
				data.$id = snap.name(); // assumes data is always an object
				var pos = positionAfter(list, prevChild);
				list.splice(pos, 0, data);
			  });
			  
			
			 return list;	  
		},
		  
      	getMyMovies: function() {

        	return $firebase(ref);
      	},
    	addMovie: function(movie) {
	        $firebase(ref).$add(movie);
    	},
    	updateMovie: function(movie){
	      	$firebase(ref)[movie.$id] = movie;
	      	$firebase(ref).$child(movie.$id).$update(movie);
    	},
    	removeMovie: function(id){
      		$firebase(ref).$remove(id);
    	},
      	find: function(id){
      		return $firebase(ref).$child(id);
      	},
      	existsMovie: function(movie){
      		var myMovies = $firebase(ref);
      		for(movieList in myMovies){
      			if(movieList.imdb_id == movie.imdb_id){
      				return true;
      			}
      		}
      		return false;
      	}
    }
  }]);




/*********************************
	Routing App
**********************************/
app.config(function($routeProvider){
	$routeProvider
		.when('/',{
			templateUrl: 'pages/home.html',
			controller: 'mainController'
		})
		.when('/myList',{
			templateUrl: 'pages/myList.html',
			controller: 'myListController'
		})
});


/*********************************
	Custom Filters
**********************************/
app.filter('isGenre', function() {
    return function(input, genre) {
        if (typeof genre == 'undefined' || genre == null) {
            return input;
        } else {
            var genresList = [];
            for (var a = 0; a < input.length; a++){
                for (var b = 0; b < input[a].genres.length; b++){
                    if(input[a].genres[b] == genre) {
                        genresList.push(input[a]);
                    }
                }
            }
            return genresList;
        }
    };
});



/*********************************
	Custom Directives
**********************************/
// Directive for infinite-scroll list
app.directive('infiniteScroll', function($window, $q) {
  	return {
		link: function(scope, element, attrs) {
      		var offset, scrolling;
      		offset = parseInt(attrs.offset, 10) || 10;
      		scrolling = false;
      		return angular.element($window).bind('scroll', function() {
        		var deferred, _ref;
       			if (!scrolling && ((_ref = element[0].offsetParent) != null ? _ref.offsetTop : void 0) 
				+ parseInt(element[0].offsetHeight, 10) < $window.scrollY + $window.innerHeight - offset) {
          			scrolling = true;
          			deferred = $q.defer();

          			scope[attrs.infiniteScroll](deferred);
          
          			return deferred.promise.then(
          				function() {
            				return scrolling = false;
          			});
        		}
      		});
    	}
  	};
});