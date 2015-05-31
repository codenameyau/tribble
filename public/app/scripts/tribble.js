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

  $stateProvider.state('project', {
    url: '/project/:slug',
    controller: 'ProjectCtrl as project',
    templateUrl: 'templates/project.html'
  });

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
    return this.projects.then(function(data) {
      cb(data);
    });
  };

  this.getProjectsBySlug = function(slug, cb) {
    return this.projects.then(function(data) {
      cb(data.filter(function(obj) {
        return obj.slug === slug;
      }));
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
    projectSrv.getProjectsBySlug(slug, function(data) {
      $scope.projects = data;
    });
}]);
