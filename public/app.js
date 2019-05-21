angular.module('Myapp', ['ngMaterial','ngMessages','ngRoute','ngAnimate','ngAria','Myapp.services','Myapp.controller'])

.config(function($routeProvider){ $routeProvider
    .when('/', {
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
    })
    .when('/signup', {
      templateUrl: 'templates/signup.html',
      controller: 'signupCtrl'
    })
    .when('/home', {
      templateUrl: 'templates/home.html',
      controller: 'homeCtrl'
    })
    .otherwise({
           redirectTo:'/'
      })
  });
