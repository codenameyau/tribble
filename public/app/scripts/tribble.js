'use strict';

var app = angular.module('tribbleApp', ['ui.router']);

/********************************************************************
* CONFIGURATION
*********************************************************************/
app.config(['$stateProvider', function($stateProvider) {

  $stateProvider.state('home', {
    url: '/',
    controller: 'HomeCtrl as home',
    templateUrl: 'templates/home.html'
  });

}]);


/********************************************************************
* SERVICES
*********************************************************************/
app.service('projects', ['$http', function ($http) {
  this.getProjects = function() {
    return $http.get('app/data/projects.json').then(function(res) {
      return res.data;
    });
  };
}]);


/********************************************************************
* CONTROLLERS
*********************************************************************/
app.controller('HomeCtrl', ['$scope', 'projects',
  function($scope, projects) {

    // Bind projects list to scope.
    projects.getProjects().then(function(data) {
      $scope.projects = data;
    });

}]);
