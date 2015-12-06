  angular
    .module('app')
    .controller('ChartController', ['FilterFactory', '$scope', function(FilterFactory, $scope) {
        var vm = this;
        $scope.isMapShown = false;

        console.log(FilterFactory.getFilters());

        vm.user = {
          title: 'Admin',
          email: 'contact@flatlogic.com',
          firstName: '',
          lastName: '' ,
          company: 'FlatLogic Inc.' ,
          address: 'Fabritsiusa str, 4' ,
          city: 'Minsk' ,
          state: '' ,
          biography: 'We are young and ambitious full service design and technology company. ' +
          'Our focus is JavaScript development and User Interface design.',
          postalCode : '220007'
        };
  }]);

