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
  var uid = "test";
  var imgStr = "https://profiles.csh.rit.edu/image/"
  $http.get("/who").success(function (response) {
    uid = response.uid;
    $scope.profile = imgStr.concat(response.uid);
    $scope.name = response.name;
    $scope.cdn = "/api/" + uid;
  }).error(function (error) { 
    $scope.profile = imgStr.concat("test");
    $scope.name = "Test";
    $scope.cdn = "/api/test";
  });

  $scope.themes = [];
  $http.get("data/themes.json").success(function(response) {
    $scope.themes = response;
  });

  $scope.cssFunc = function (link) {
    $http.get("/api/" + uid + "/" + link);
    $scope.cdn = "https://s3.csh.rit.edu/" + link + "/4.0.0/dist/" + link + ".min.css";
  };

}]);
