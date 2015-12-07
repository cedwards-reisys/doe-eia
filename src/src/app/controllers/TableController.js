(function(){

  angular
    .module('app')
    .controller('TableController', [ 
      '$scope', 'DataFactory', '$location',
      TableController
    ]);

  function TableController($scope, DataFactory, $location) {
    var vm = this;

    $scope.selected = [];

    $scope.query = {
      filter: '',
      order: 'prod_year',
      limit: 5,
      page: 1
    };

    $scope.data = DataFactory.getData().rawData;

    //redirect to dashboard
    if(typeof $scope.data === 'undefined') {
        $location.path('/dashboard');
    }

//    function success(desserts) {
//        $scope.desserts = desserts;
//      }

//    // in the future we may see a few built in alternate headers but in the mean time
//    // you can implement your own search header and do something like
//    $scope.search = function (predicate) {
//      $scope.filter = predicate;
//      $scope.deferred = $nutrition.desserts.get($scope.query, success).$promise;
//    };
//
//    $scope.onOrderChange = function (order) {
//      return $nutrition.desserts.get($scope.query, success).$promise; 
//    };
//
//    $scope.onPaginationChange = function (page, limit) {
//      return $nutrition.desserts.get($scope.query, success).$promise; 
//    };

//    $scope.onPaginationChange = function (page, limit) {
//      return $nutrition.desserts.get($scope.query, success).$promise; 
//    };

    vm.tableData = DataFactory.getData();

  }

})();
