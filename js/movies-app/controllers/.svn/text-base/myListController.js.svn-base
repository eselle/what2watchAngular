app.controller("myListController", function($scope, MyMovies){

	$scope.myMovies = MyMovies.getMyMovies();

	$scope.addMovie = function(movie){
		MyMovies.addMovie(movie);
	}

	$scope.removeMovie = function(movieId){
		MyMovies.removeMovie(movieId);
	}

});