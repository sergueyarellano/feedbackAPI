'use strict';
(function() {

  angular.module('FeedApp',[ 'ngRoute' ])

    .controller('loginController', [ '$location', function() {

      // bind this to vm (view-model)
      var vm = this;

      vm.doLogin = function() {
          location.assign('/home');
      };
    }])

    .controller('navbarController', function() {

      // bind this to vm (view-model)
      var vm = this;

      vm.doLogout = function() {
          console.log('dd');
      };
    })

    .controller('ShowFormsController', [ '$http',  function($http) {
      // bind this to vm (view-model)
      var vm = this;
      return $http.get('api/forms')
        .then(function(response) {
            console.log(response);
            vm.formularios = response.data;
        });
    }])

    .controller('CreateFormController', [ '$http', function($http) {

      var vm = this;
      vm.fdata = {};
      vm.create = function() {
        // body...
        var data = {};
        data.opiName = vm.fdata.name;
        data.text = vm.fdata.q0 + ',' + vm.fdata.q1 + ',' + vm.fdata.q2;
        data.randomness = vm.fdata.aleatoriedad;
        return $http.post('api/forms', data)
          .then(function(response) {
              $('.modal-body').find('p').text(response.data.message);
              $('#myModal').modal('show');
              $('#form1').get(0).reset();
            })
          .catch(function(response) {
            $('.modal-body').find('p').text(response.data.message);
            console.log(response.data.message);
            });
      };
    }])

    .controller('ShowOpinionesController', [ '$http',  function($http) {
      // bind this to vm (view-model)
      var vm = this;

      return $http.get('api/records')
        .then(function(response) {
          vm.records = response.data;
        });

    }])

    .config([ '$routeProvider', '$locationProvider',function($routeProvider, $locationProvider) {
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
          .when('/showOpiniones', {
            templateUrl: 'app/views/list.opiniones.tpl.html',
            controller: 'ShowOpinionesController',
            controllerAs: 'soc'
          })
          .otherwise({
            templateUrl: 'app/views/404.tpl.html'
          });

          $locationProvider.html5Mode(true);
    }]);

})();
