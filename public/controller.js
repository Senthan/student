var student = angular.module('student', []);
student.controller('UserController', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from controller");

	var refresh = function() {
		console.log("I got the data I requestreted");
		$http.get('/user').success(function(response) {
			console.log("I got the data I requested");
			$scope.user = response;
			$scope.key = '';
			$scope.value = '';
    	});
	}
	
	refresh();
  
	$scope.add = function() {
	  console.log("key", $scope.key);
	  var obj = {label: $scope.key, value : $scope.value};

	  $http.post('/user', obj).success(function(response) {
		console.log(response);
	  });
	};

}]);﻿