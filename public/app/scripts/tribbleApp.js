'use strict';

var app = angular.module('tribbleApp', ['ui.router']);

/********************************************************************
* CONFIGURATION
*********************************************************************/
app.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('home', {
    url: '',
    views: {
      'description': {
        controller: 'DescriptionCtrl as description',
        templateUrl: 'templates/description.html',
      },
      'container': {
        controller: 'HomeCtrl as home',
        templateUrl: 'templates/home.html'
      }
    },
  });

  $stateProvider.state('project', {
    url: '/project/:slug',
    views: {
      'description': {
        controller: 'DescriptionCtrl as description',
        templateUrl: 'templates/description.html',
      },
      'container': {
        controller: 'ProjectCtrl as project',
        templateUrl: 'templates/project.html'
      }
    }
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

  this.getProject = function(projects, slug) {
    for (var i=0; i<projects.length; i++) {
      if (projects[i].slug === slug) {
        return projects[i];
      }
    }
  };
}]);


/********************************************************************
* CONTROLLERS
*********************************************************************/
app.controller('DescriptionCtrl', ['$scope', '$stateParams', 'projectSrv',
  function($scope, $stateParams, projectSrv) {
    $scope.slug = $stateParams.slug;
    if ($scope.slug) {
      projectSrv.getProjects(function(data) {
        $scope.projects = data;
        $scope.project = projectSrv.getProject($scope.projects, $scope.slug);
      });
    }
}]);

app.controller('HomeCtrl', ['$scope', 'projectSrv',
  function($scope, projectSrv) {
    projectSrv.getProjects(function(data) {
      var repository = 'https://github.com/codenameyau/tribble/';
      var source = 'blob/master/public/projects/demo/';
      $scope.github = repository + source;
      $scope.projects = data;
    });
}]);

app.controller('ProjectCtrl', ['$scope', '$filter', '$stateParams',
  function($scope, $filter, $stateParams) {
    $scope.slug = $stateParams.slug;
    var demoFunction = $filter('slugToCamel')($scope.slug) + 'Demo';
    window[demoFunction]();
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
