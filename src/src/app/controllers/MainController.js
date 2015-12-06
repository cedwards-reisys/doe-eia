  (function () {
  angular
       .module('app')
       .controller('MainController', [
          'navService', '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$state', '$mdToast', '$scope', 'FilterFactory', 'ApiInterfaceService', 'usSpinnerService', '$rootScope',
          MainController]);

    function MainController(navService, $mdSidenav, $mdBottomSheet, $log, $q, $state, $mdToast, $scope, FilterFactory, ApiInterfaceService, usSpinnerService, $rootScope) {
    var vm = this;
    $scope.aMapData = {};
    $scope.aMapDataColor = {};
    $scope.isMapShown = false;
    var aMapData = {};
    var aMapDataColor = {};

    //IMPORTANT For navigating around the menus
    $rootScope.$on('$stateChangeSuccess', 
    function(event, toState, toParams, fromState, fromParams){ 
        //return to MAP menu. execute
        if(toState.name === 'home.dashboard') {
            $scope.isMapShown = false;
            setTimeout(function(){$scope.loadMAPData();}, 1000);
        }
    });

    //Default values
    // In your controller
    $scope.slider = {
      min: 6,
      max: 16,
      options: {
        floor: 1,
        ceil: 26
      }
    };

    $scope.energyYear = 2009;
    $scope.energyType = 'Gas';

    vm.menuItems = [ ];
    vm.selectItem = selectItem;
    vm.toggleItemsList = toggleItemsList;
    vm.showActions = showActions;
    vm.title = $state.current.data.title;
    vm.showSimpleToast = showSimpleToast;

    navService
      .loadAllItems()
      .then(function(menuItems) {
        vm.menuItems = [].concat(menuItems);
      });

    function toggleItemsList() {
      var pending = $mdBottomSheet.hide() || $q.when(true);

      pending.then(function(){
        $mdSidenav('left').toggle();
      });
    }

    function selectItem (item) {
      vm.title = item.name;
      vm.toggleItemsList();
      vm.showSimpleToast(vm.title);
    }

    function showActions($event) {
        $mdBottomSheet.show({
          parent: angular.element(document.getElementById('content')),
          templateUrl: 'app/views/partials/bottomSheet.html',
          controller: [ '$mdBottomSheet', SheetController],
          controllerAs: "vm",
          bindToController : true,
          targetEvent: $event
        }).then(function(clickedItem) {
          clickedItem && $log.debug( clickedItem.name + ' clicked!');
        });

        function SheetController( $mdBottomSheet ) {
          var vm = this;

          vm.actions = [
            { name: 'Share', icon: 'share', url: 'https://twitter.com/intent/tweet?text=Angular%20Material%20Dashboard%20https://github.com/flatlogic/angular-material-dashboard%20via%20@flatlogicinc' },
            { name: 'Star', icon: 'star', url: 'https://github.com/flatlogic/angular-material-dashboard/stargazers' }
          ];

          vm.performAction = function(action) {
            $mdBottomSheet.hide(action);
          };
        }
    }

    function showSimpleToast(title) {
      $mdToast.show(
        $mdToast.simple()
          .content(title)
          .hideDelay(2000)
          .position('top right')
      );
    }

    //load map
    $scope.loadMAPData = function() {
        //show spin
        usSpinnerService.spin('spinner');

        //store filters in filterFactory for BarChart controller use    
        var oFilter = {
            "energyYear": this.energyYear,
            "energyType": this.energyType,
            "energyRateClass": {
                "min": this.slider.min,
                "max": this.slider.max
            }
        };

        //set filters
        FilterFactory.setFilters(oFilter);

        //Example for 2009 YEAR
        //TODO CHANGE BY ACTIVE API
        ApiInterfaceService.call('us2009Sample', '', {}).then(
        function(data){
            aMapData = {};
            aMapDataColor = {};

            //data
            angular.forEach(data, function(object){
                var isObjectInRateClassRange = (object.rate_class >= $scope.slider.min  && object.rate_class <= $scope.slider.max) ? true : false;
                //Verify if we already have state in aMapData
                if(aMapData.hasOwnProperty(object.state)) { //exist
                    //push data into existing state
                    //Oil 
                    aMapData[object.state].sum_num_oil_wells += object.num_oil_wells;
                    aMapData[object.state].sum_oil_prod_BBL += object.oil_prod_BBL;
                    //Gas
                    aMapData[object.state].sum_num_gas_wells += object.num_gas_wells;
                    aMapData[object.state].sum_NAgas_prod_MCF += object.NAgas_prod_MCF;

                    if(isObjectInRateClassRange) {
                        //Oil 
                        aMapData[object.state].sum_num_oil_wells_rate_range += object.num_oil_wells;
                        aMapData[object.state].sum_oil_prod_BBL_rate_range += object.oil_prod_BBL;

                        //Gas
                        aMapData[object.state].sum_num_gas_wells_rate_range += object.num_gas_wells;
                        aMapData[object.state].sum_NAgas_prod_MCF_rate_range += object.NAgas_prod_MCF;
                    }
                } else { //create state with data
                    aMapData[object.state] = {
                        prod_year: object.prod_year,
                        fillKey: "colorTBD",
                        //Oil
                        sum_num_oil_wells: object.num_oil_wells,
                        sum_num_oil_wells_rate_range: (isObjectInRateClassRange) ? object.num_oil_wells : 0,
                        sum_oil_prod_BBL: object.oil_prod_BBL,
                        sum_oil_prod_BBL_rate_range: (isObjectInRateClassRange) ? object.oil_prod_BBL : 0,
                        //Gas
                        sum_num_gas_wells: object.num_gas_wells,
                        sum_num_gas_wells_rate_range: (isObjectInRateClassRange) ? object.num_gas_wells : 0,
                        sum_NAgas_prod_MCF: object.NAgas_prod_MCF,
                        sum_NAgas_prod_MCF_rate_range: (isObjectInRateClassRange) ? object.NAgas_prod_MCF : 0
                    };
                }
            });

            //set color based on % column
            angular.forEach(aMapData, function(object, state){
                var sumGasWells = (object.sum_num_gas_wells === 0) ? 1 : object.sum_num_gas_wells;
                var sumOilWells = (object.sum_num_oil_wells === 0) ? 1 : object.sum_num_oil_wells;

                //set color based on gas column
                if($scope.energyType === 'Gas') {
                    aMapDataColor[state] = d3.interpolate("#ffffcc", "#800026")(object.sum_num_gas_wells_rate_range/sumGasWells);
                } else { //set color based on Oil column
                    aMapDataColor[state] = d3.interpolate("#ffffcc", "#800026")(object.sum_num_oil_wells_rate_range/sumOilWells);
                }
            });

            console.log(aMapData);
            console.log(aMapDataColor);

            $scope.aMapData = aMapData;
            $scope.aMapDataColor = aMapDataColor;

            if(!$scope.isMapShown) {
                $scope.drawMap();
            }

            //show spin
            usSpinnerService.stop('spinner');
        },
        function(error){
            console.log(error);
        });
    };

    //draw map
    $scope.drawMap = function() {
        var map = new Datamap({
            "element": document.getElementById('mapContainer'),
            "scope": 'usa',
            "geographyConfig": {
                "highlightBorderColor": '#bada55',
                "popupTemplate": function(geography, data) {
                    var html = '<div class="hoverinfo">';
                        html += '<h4>'+geography.properties.name+'</h4>';
    //                        if(data) {
    //                            html +='<hr/>';
    //                            angular.forEach(data.data, function(row){
    //                                html +='<p><b>Disaster Name</b>: '+ row.disasterName +'<br />';
    //                                html +='<b>Disaster Type</b>: '+ row.disasterType +'<br />';
    //                                html +='<b>Disaster Date</b>: '+ row.date.start +'';
    //                                if(typeof row.date.end !== 'undefined' && row.date.end !== null) {
    //                                    html +='<br /><b>Disaster Date End</b>: '+ row.date.end;
    //                                }
    //                                html +='</p>';
    //                            });
    //                        }

                        html += '</div>';
                    return html;
                },
                highlightBorderWidth: 0.5,
                highlightFillColor: '#aeb0b5'
            },
            "fills": {
                "colorTBD": '#fad980',
                "defaultFill": '#f1f1f1'
            },
            "data": $scope.aMapData,
            "done": function(datamap) {
                datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                    //load fema news by state
    //                    $scope.loadFemaNewsByState(geography.properties.name);
                });

                datamap.svg.call(d3.behavior.zoom().scaleExtent([1, 5]).on("zoom", redraw));

                function redraw() {
                    datamap.svg.selectAll("g").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                }
            }
        });

        //set state colors
        map.updateChoropleth($scope.aMapDataColor);

        //draw a legend for this map
        map.labels();
        //map.legend();

        //set flag
        $scope.isMapShown = true;
    };

    setTimeout(function(){$scope.loadMAPData();}, 1000);
  };

})();