  (function () {
  angular
       .module('app')
       .controller('MainController', [
          'navService', '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$state', '$mdToast', '$scope', 'FilterFactory', 'ApiInterfaceService', 'usSpinnerService', '$rootScope',
          MainController]);

    function MainController(navService, $mdSidenav, $mdBottomSheet, $log, $q, $state, $mdToast, $scope, FilterFactory, ApiInterfaceService, usSpinnerService, $rootScope) {
    var vm = this;
    $scope.mapData = {};
    $scope.isMapShown = false;

    //IMPORTANT For navigating around the menus
    $rootScope.$on('$stateChangeSuccess', 
    function(event, toState, toParams, fromState, fromParams){ 
        //return to MAP menu. execute
        if(toState.name === 'home.dashboard') {
            //show spin
            usSpinnerService.spin('spinner');

            $scope.isMapShown = false;
            setTimeout(function(){$scope.loadMAPData();}, 1000);
        }
    });

    //show spin
    usSpinnerService.spin('spinner');

    //Default values
    // In your controller
    $scope.slider = {
      min: 1,
      max: 26,
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
            console.log(data);

            //MAP
            mapData = {
                "AZ": {
                    "fillKey": "Republican",
                    "electoralVotes": 5
                },
                "CO": {
                    "fillKey": "Light Democrat",
                    "electoralVotes": 5
                },
                "DE": {
                    "fillKey": "Democrate",
                    "electoralVotes": 32
                },
                "FL": {
                    "fillKey": "UNDECIDED",
                    "electoralVotes": 29
                },
                "GA": {
                    "fillKey": "Republican",
                    "electoralVotes": 32
                },
                "HI": {
                    "fillKey": "Democrat",
                    "electoralVotes": 32
                },
                "ID": {
                    "fillKey": "Republican",
                    "electoralVotes": 32
                },
                "IL": {
                    "fillKey": "Democrat",
                    "electoralVotes": 32
                },
                "IN": {
                    "fillKey": "Republican",
                    "electoralVotes": 11
                },
                "IA": {
                    "fillKey": "Light Democrat",
                    "electoralVotes": 11
                },
                "KS": {
                    "fillKey": "Republican",
                    "electoralVotes": 32
                },
                "KY": {
                    "fillKey": "Republican",
                    "electoralVotes": 32
                },
                "LA": {
                    "fillKey": "Republican",
                    "electoralVotes": 32
                },
                "MD": {
                    "fillKey": "Democrat",
                    "electoralVotes": 32
                },
                "ME": {
                    "fillKey": "Democrat",
                    "electoralVotes": 32
                },
                "MA": {
                    "fillKey": "Democrat",
                    "electoralVotes": 32
                },
                "MN": {
                    "fillKey": "Democrat",
                    "electoralVotes": 32
                },
                "MI": {
                    "fillKey": "Democrat",
                    "electoralVotes": 32
                },
                "MS": {
                    "fillKey": "Republican",
                    "electoralVotes": 32
                },
                "MO": {
                    "fillKey": "Republican",
                    "electoralVotes": 13
                },
                "MT": {
                    "fillKey": "Republican",
                    "electoralVotes": 32
                },
                "NC": {
                    "fillKey": "Light Republican",
                    "electoralVotes": 32
                },
                "NE": {
                    "fillKey": "Republican",
                    "electoralVotes": 32
                },
                "NV": {
                    "fillKey": "Heavy Democrat",
                    "electoralVotes": 32
                },
                "NH": {
                    "fillKey": "Light Democrat",
                    "electoralVotes": 32
                },
                "NJ": {
                    "fillKey": "Democrat",
                    "electoralVotes": 32
                },
                "NY": {
                    "fillKey": "Democrat",
                    "electoralVotes": 32
                },
                "ND": {
                    "fillKey": "Republican",
                    "electoralVotes": 32
                },
                "NM": {
                    "fillKey": "Democrat",
                    "electoralVotes": 32
                },
                "OH": {
                    "fillKey": "UNDECIDED",
                    "electoralVotes": 32
                },
                "OK": {
                    "fillKey": "Republican",
                    "electoralVotes": 32
                },
                "OR": {
                    "fillKey": "Democrat",
                    "electoralVotes": 32
                },
                "PA": {
                    "fillKey": "Democrat",
                    "electoralVotes": 32
                },
                "RI": {
                    "fillKey": "Democrat",
                    "electoralVotes": 32
                },
                "SC": {
                    "fillKey": "Republican",
                    "electoralVotes": 32
                },
                "SD": {
                    "fillKey": "Republican",
                    "electoralVotes": 32
                },
                "TN": {
                    "fillKey": "Republican",
                    "electoralVotes": 32
                },
                "TX": {
                    "fillKey": "Republican",
                    "electoralVotes": 32
                },
                "UT": {
                    "fillKey": "Republican",
                    "electoralVotes": 32
                },
                "WI": {
                    "fillKey": "Democrat",
                    "electoralVotes": 32
                },
                "VA": {
                    "fillKey": "Light Democrat",
                    "electoralVotes": 32
                },
                "VT": {
                    "fillKey": "Democrat",
                    "electoralVotes": 32
                },
                "WA": {
                    "fillKey": "Democrat",
                    "electoralVotes": 32
                },
                "WV": {
                    "fillKey": "Republican",
                    "electoralVotes": 32
                },
                "WY": {
                    "fillKey": "Republican",
                    "electoralVotes": 32
                },
                "CA": {
                    "fillKey": "Democrat",
                    "electoralVotes": 32
                },
                "CT": {
                    "fillKey": "Democrat",
                    "electoralVotes": 32
                },
                "AK": {
                    "fillKey": "Republican",
                    "electoralVotes": 32
                },
                "AR": {
                    "fillKey": "Republican",
                    "electoralVotes": 32
                },
                "AL": {
                    "fillKey": "Republican",
                    "electoralVotes": 32
                }
            };

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
                "UNDECIDED": '#a389dc',
                "Republican": '#FF5C33',
                "Democrat": '#fad980',
                "defaultFill": '#f1f1f1'
            },
            "data": mapData,
            "done": function(datamap) {
                datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                    //load fema news by state
    //                    $scope.loadFemaNewsByState(geography.properties.name);
                });

                datamap.svg.call(d3.behavior.zoom().scaleExtent([1, 5]).on("zoom", redraw));

                function redraw() {
                    datamap.svg.selectAll("g").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                }

    //            datamap.svg.selectAll(".datamaps-subunit")
    //            .style("fill", function(d, i){
    //                console.
    //                //return d.y > 50 ? "red":"blue";
    //            });
            }
        });

        //draw a legend for this map
        map.labels();
        map.legend();

        //set flag
        $scope.isMapShown = true;
    };

    setTimeout(function(){$scope.loadMAPData();}, 1000);
  };

})();