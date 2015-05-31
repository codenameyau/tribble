'use strict';

var app = angular.module('tribbleApp');

app.controller('HomeCtrl', ['$scope', function($scope) {
  $scope.hi = 'how are you';
  this.msg = 'my name is john';
}]);

app.controller('AboutCtrl', ['$scope', function($scope) {
  $scope.about = 'My nae is jon snuw';
}]);
