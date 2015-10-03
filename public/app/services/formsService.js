(function () {
  'use strict';
  angular.module('formService', [])

    .factory('Formulario', function($http) {

      // create a new object
      var formularioFactory = {};

      // get a single form
      formularioFactory.get = function(id) {
        return $http.get('/api/form/' + id);
      };

      // get all forms
      formularioFactory.all = function() {
        return $http.get('/api/form');
      };

      return formularioFactory;
    });
})();
