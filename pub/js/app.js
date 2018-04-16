// Initialise angular
var app = angular.module("themeswitcher", ['webicon']);

// Pull the templates
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

  // Pull uid and name from the api
  // Sets the theme and gets profile image
  var uid = "test";
  var imgStr = "https://profiles.csh.rit.edu/image/";
  $scope.cdn = "/api/get";
  $http.get("/local").success(function (response) {
    $scope.profile = imgStr.concat(response.uid);
    $scope.name = response.name;
    $scope.gitRev = response.rev;
  }).error(function (error) { 
    $scope.profile = imgStr.concat("test");
    $scope.name = "Test";
    $scope.gitRev = "GitHub";
  });

  // Enumerates the themes dropdown
  $scope.themes = [];
  $http.get("data/themes.json").success(function(response) {
    $scope.themes = response;
  });

  // Sets the theme selection via the api and hotswaps the page css
  $scope.cssFunc = function (link) {
    $http.get("/api/set/" + link);
    var cdn = "";
    for(var theme in $scope.themes) {
      if($scope.themes[theme].shortName == link)
        cdn = $scope.themes[theme].cdn;
    }
    if(cdn == "") cdn = $scope.themes[0].cdn;
    $scope.cdn = cdn;
  };

}]);
