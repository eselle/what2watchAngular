app.controller("mainController", function($scope, $sce, $http, $modal, MyMovies, $filter){
	
	$scope.moviesToLoadMore = 10;
    $scope.totalDisplayed = 10;

    $scope.init = function() {
    $scope.movies = [];
	$scope.moviesPag = [];
	
    $scope.filterText = null;
    $scope.availableGenres = [];
    $scope.genreFilter = null;
	
	$scope.myList = [];
	$scope.myList= MyMovies.syncChanges($scope.myList);
				
    $scope.orderFields = ["Title", "Published Date"];
	$scope.orderDirections = ["Descending", "Ascending"];
	$scope.orderField = "Published Date"; //Default order field
	$scope.orderReverse = true;

	var url = "http://api.trakt.tv/movies/trending.json/d1bf799697574a42331b8806da445649" + "?callback=JSON_CALLBACK";

    $http.jsonp(url)
        .success(function(data){

            //As we are getting our data from an external source, we need to format the data so we can use it to our desired effect
            //Adds each movie to the movies array
            angular.forEach(data, function(value, index){

                var urlPoster = value.poster;
			    var urlThumbnail = urlPoster.substr(0, urlPoster.indexOf(".jpg"))+"-138.jpg";
			    value.poster = urlThumbnail;
			    
            	$scope.movies.push(value);

					//Loop through each genre for this movie
                    angular.forEach(value.genres, function(genre, index){
                        //Only add to the availableGenres array if it doesn't already exist
                        var exists = false;
                        angular.forEach($scope.availableGenres, function(avGenre, index){
                            if (avGenre == genre) {
                                exists = true;
                            }
                        });
                        if (exists === false && genre!="") {
                            $scope.availableGenres.push(genre);
                        }
                    });
            });
        });
    };

    $scope.loadNew = function(deferredObj) {
		$scope.totalDisplayed += $scope.moviesToLoadMore;
        return deferredObj.resolve();
    }

	$scope.setGenreFilter = function(genre) {
	    $scope.genreFilter = genre;
	}

	$scope.trustSrc = function(src) {
		return $sce.trustAsResourceUrl(src);
	  }

    $scope.watchTrailer = function(urlTrailer){
		
		var urlEmbed = urlTrailer.substr(0, urlTrailer.indexOf("/watch"))+
		"/embed/"+urlTrailer.substr(urlTrailer.indexOf("?v=")+3)+"?autoplay=1";
		$scope.urlEmbed = urlEmbed;
		
        var modalInstance = $modal.open({
			  templateUrl: 'trailerModal',
			  controller: ModalInstanceCtrl,
			  resolve: {
					trailer: function () {
						return $sce.trustAsResourceUrl($scope.urlEmbed);
					}
				}
			});
			
		modalInstance.result.then(function () {
			}, function () {
			});
		  };
	
	

	$scope.customOrder = function(movie) {
    switch ($scope.orderField) {
        case "Title":
            return movie.title;
            break;
        case "Published Date":
            return movie.released;
            break;
    }
    };

    //Check if a movie is added to My List movies
    $scope.movieIsAdded = function(movie){
		var found = $filter('filter')($scope.myList, {title: movie.title}, true);
		 if (found.length) {
			console.log("true");
			 return true;
		 } else {
			console.log("false");
			return false;
		 }
       // return false;//MyMovies.existsMovie(movie);
    }

    //Add movie to My List movies
    $scope.addMovieToList = function(movie){
        MyMovies.addMovie(movie);
    }

});



var ModalInstanceCtrl = function ($scope, $modalInstance, trailer) {
  $scope.trailer = trailer;
};