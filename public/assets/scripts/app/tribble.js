'use strict';

var app = angular.module('tribbleApp', []);

app.controller('CardCtrl', ['$scope', function($scope) {
  $scope.hi = 'how are you';
}]);
