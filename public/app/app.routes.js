(function () {
  'use strict';
  angular.module('app.routes', ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
          .when('/', {
            templateUrl: 'app/views/pages/login.tpl.html',
            controller: 'mainController',
            controllerAs: 'main'
          })
          .when('/home', {
            templateUrl: 'app/views/pages/home.tpl.html'
          })
          .when('/createForm', {
            templateUrl: 'app/views/pages/create.form.tpl.html',
            controller: 'CreateFormController',
            controllerAs: 'createform'
          })
          .when('/showForms', {
            templateUrl: 'app/views/pages/list.forms.tpl.html',
            controller: 'ShowFormsController',
            controllerAs: 'showforms'
          })
          .otherwise({
            redirectTo: 'app/views/pages/404.tpl.html'
          });

          $locationProvider.html5Mode(true);
    });
})();
