(function () {
  'use strict';

  angular.module('FeedApp', ['ngRoute'])

    .controller('loginController', ['$location', function($location) {

      // bind this to vm (view-model)
      var vm = this;

      vm.doLogin = function() {
          //$location.path('/home');
          location.assign('/home');

      };


    }])

    .controller('ShowFormsController', ['$http',  function($http) {
      // bind this to vm (view-model)
      var vm = this;
      vm.getFormularios = function () {
        // body...
        $http.get('api/forms');
      }

      vm.formularios = [
            { name: 'opi_traspaso_efectivo_tarjeta_push_1', url: 'http://www.bbva.es' },
            { name: 'opi_seguros_auto_pull_1', url: 'http://www.bbva.es' },
            { name: 'opi_anticipo_nomina_push_1', url: 'http://www.bbva.es' }
      ];

    }])

    .controller('CreateFormController', ['$http', function($http) {

      var vm = this;
      vm.fdata = {};
      vm.create = function () {
        // body...
        var data = {};
        data.opiName = vm.fdata.name;
        data.qtext = vm.fdata.q1 + ',' + vm.fdata.q2;
        $http.post('api/steps', {params: data});
      }



    }])

    .config(['$routeProvider', '$locationProvider',function($routeProvider, $locationProvider) {
        $routeProvider
          .when('/home', {
            templateUrl: 'app/views/informe.tpl.html'
          })
          .when('/createForm', {
            templateUrl: 'app/views/create.form.tpl.html',
            controller: 'CreateFormController',
            controllerAs: 'cfc'
          })
          .when('/showForms', {
            templateUrl: 'app/views/list.forms.tpl.html',
            controller: 'ShowFormsController',
            controllerAs: 'sfc'
          })
          .otherwise({
            templateUrl: 'app/views/404.tpl.html'
          });

          $locationProvider.html5Mode(true);
    }]);

})();
