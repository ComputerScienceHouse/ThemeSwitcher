var app = angular.module("themeswitcher", ['webicon']);

app.directive("navbar", function() {
  return {
    restrict: "E",
    templateUrl: "templates/navbar.html"
  }
});

app.controller("ThemeSwitcherController", ['$scope', '$http', function($scope, $http) {

  $scope.themes = [];
  $http.get("./data/themes.json").success(function(response) {
    $scope.themes = response;
  });

}]);
