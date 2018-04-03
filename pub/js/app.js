var app = angular.module("themeswitcher", ['webicon']);

app.directive("navbar", function() {
  return {
    restrict: "E",
    templateUrl: "templates/navbar.html"
  }
});

app.directive("preview", function() {
  return {
    restrict: "E",
    templateUrl: "templates/preview.html"
  }
})

app.controller("ThemeSwitcherController", ['$scope', '$http', function($scope, $http) {
  //Get sso info
  $scope.name = "";
  $scope.profile = "";
  var imgStr = "https://profiles.csh.rit.edu/image/"
  $http.get("http://themeswitcher.csh.rit.edu/who").success(function (response) {
    $scope.uid = response.uid;
    $scope.profile = imgStr.concat(response.uid);
    $scope.name = response.name;
  }).error(function (error) { 
    console.error("Error getting sso");
    $scope.profile = imgStr.concat("test");
    $scope.name = "Test";
    $scope.uid = "test";
  });
  
  $scope.themes = [];
  $http.get("data/themes.json").success(function(response) {
    $scope.themes = response;
  });

  $scope.cdn = "https://s3.csh.rit.edu/csh-material-bootstrap/4.0.0/dist/csh-material-bootstrap.min.css";
  $scope.cssFunc = function (link) {
    $scope.cdn = "https://s3.csh.rit.edu/" + link + "/4.0.0/dist/" + link + ".min.css";
    $http.get("http://themeswitcher.csh.rit.edu/api/" + $scope.uid + "/" + link);
  };

}]);
