'use strict';

var app = angular.module('tribbleApp', ['ui.router']);

/********************************************************************
* CONFIGURATION
*********************************************************************/
app.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('home', {
    url: '/',
    controller: 'HomeCtrl as home',
    templateUrl: 'templates/home.html'
  });

  $stateProvider.state('project', {
    url: '/project/:slug',
    controller: 'ProjectCtrl as project',
    templateUrl: 'templates/project.html'
  });

  $urlRouterProvider.otherwise('/');
}]);


/********************************************************************
* SERVICES
*********************************************************************/
app.service('projectSrv', ['$http', function ($http) {
  this.projects = $http.get('app/data/projects.json', {cache: true})
    .then(function(res) {
      return res.data;
    });

  this.getProjects = function(cb) {
    this.projects.then(function(data) {
      cb(data);
    });
  };
}]);


/********************************************************************
* CONTROLLERS
*********************************************************************/
app.controller('HomeCtrl', ['$scope', 'projectSrv',
  function($scope, projectSrv) {
    projectSrv.getProjects(function(data) {
      $scope.projects = data;
    });
}]);

app.controller('ProjectCtrl', ['$scope', '$stateParams', 'projectSrv',
  function($scope, $stateParams, projectSrv) {
    var slug = $stateParams.slug;
    projectSrv.getProjects(function(data) {
      $scope.projects = data;
      $scope.project = data.filter(function(obj) {
        return obj.slug === slug;
      })[0];
    });
}]);
