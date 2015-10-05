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
      vm.getForms = function () {
        // body...
        return $http.get('api/forms')
          .then(function(response){
              console.log(response);
              vm.formularios = response.data;
            })

      }

    }])

    .controller('CreateFormController', ['$http', function($http) {

      var vm = this;
      vm.fdata = {};
      vm.create = function () {
        // body...
        var data = {};
        data.opiName = vm.fdata.name;
        data.text = vm.fdata.q1 + ',' + vm.fdata.q2;
        return $http.post('api/forms', data)
          .then(function(response){
              console.log(response);
              $('.modal-text').text = response.data.message;
              $('#myModal').modal('show');
              $('#form1').get(0).reset();
            })
          .catch(function(data, status) {
            console.error('API error', response.status, response.data);
            })
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
