'use strict';

var app = angular.module('tribbleApp', ['ui.router']);

/********************************************************************
* CONFIGURATION
*********************************************************************/
app.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('home', {
    url: '',
    controller: 'HomeCtrl as home',
    templateUrl: 'templates/home.html'
  });

  $stateProvider.state('project', {
    url: '/project/:slug',
    controller: 'ProjectCtrl as project',
    templateUrl: 'templates/project.html'
  });

  $urlRouterProvider.otherwise('');
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

app.controller('ProjectCtrl',
  ['$scope', '$filter', '$stateParams', 'projectSrv',
  function($scope, $filter, $stateParams, projectSrv) {

    var slug = $stateParams.slug;
    var demoFunction = $filter('slugToCamel')(slug);

    projectSrv.getProjects(function(data) {
      $scope.projects = data;
      $scope.project = data.filter(function(obj) {
        return obj.slug === slug;
      })[0];
      window[demoFunction + 'Demo']();
    });
}]);


/********************************************************************
* FILTERS
*********************************************************************/
app.filter('slugToCamel', function() {
  return function(input) {
    return input.replace(/-(.)?/g, function(match) {
      return match[1].toUpperCase();
    });
  };
});
