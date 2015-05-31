'use strict';

var app = angular.module('tribbleApp', ['ui.router']);

app.config(['$stateProvider', function($stateProvider) {

  $stateProvider.state('home', {
    url: '/',
    controller: 'HomeCtrl as home',
    templateUrl: 'templates/home.html'
  });

  $stateProvider.state('about', {
    url: '/about',
    controller: 'AboutCtrl as about',
    templateUrl: 'templates/about.html'
  });

}]);
