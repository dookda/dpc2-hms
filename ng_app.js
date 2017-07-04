angular.module('app', ['ngRoute','app.service','app.controller'])

.config(function($routeProvider) {
  $routeProvider

  .when('/map', {
    templateUrl : 'map.html',
    controller  : 'mapController'
  })
  .when('/report', {
    templateUrl : 'report.html',
    controller  : 'reportController'
  })
  .when('/chart', {
    templateUrl : 'chart.html',
    controller  : 'chartController'
  })

  .when('/form', {
    templateUrl : 'form.html',
    controller  : 'formController'
  })

  .when('/formdoc', {
    templateUrl : 'formdoc.html',
    controller  : 'formdocController'
  })

  .when('/chem', {
    templateUrl : 'chem.html',
    controller  : 'chemController'
  })

  .otherwise({redirectTo: '/map'});
})