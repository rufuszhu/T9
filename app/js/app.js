'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('T9', [
  'ngRoute',
  'gameController'
  //'myApp.filters',
 //'myApp.services',
  //'myApp.directives',
  //'myApp.controllers'
]).
config(function ($routeProvider){
	$routeProvider
		.when('/',
		{
			controller: 'gameController',
			templateUrl: '/partials/singlegame.html'
		})
		.when('/splash',
		{
			controller: 'gameController',
			templateUrl: '/kb/kbview.html'
		})
		.otherwise({redirectTo: '/'});
		
});
/*
config(['$routeProvider', function($routeProvider) {
  //$routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
  //$routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  //$routeProvider.otherwise({redirectTo: '/view1'});
}]);
*/