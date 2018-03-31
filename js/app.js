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

  $scope.themes = [];
  $http.get("./data/themes.json").success(function(response) {
    $scope.themes = response;
  });

  $scope.cdn = "https://s3.csh.rit.edu/csh-material-bootstrap/4.0.0/dist/csh-material-bootstrap.min.css";
  $scope.cssFunc = function (link) {
    $scope.cdn = link;
  };

  //Get sso info
  $scope.name = "";
  $scope.profile = "";
  var imgStr = "https://profiles.csh.rit.edu/image/"
  $http.get("https://members.csh.rit.edu/sso/redirect?info=json").success(function (response) {
    $scope.profile = imgStr.concat(response.id_token.preferred_username);
    $scope.name = response.userinfo.given_name + " " + response.userinfo.family_name;
  }).error(function (error) { 
    console.error("Error getting sso");
    $scope.profile = imgStr.concat("test");
    $scope.name = "Test";
  });

}]);
