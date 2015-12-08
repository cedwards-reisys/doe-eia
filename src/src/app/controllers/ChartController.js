angular
    .module('app')
    .controller('ChartController', ['$location', '$scope', 'DataFactory', '$rootScope', function ($location, $scope, DataFactory, $rootScope) {
        var vm = this;
        $scope.isMapShown = false;
        var data = [];
        var dataOil = [];
        var dataGas = [];
        var stateData = [];

        $rootScope.$on('reloadChart', function (event, args) {

            $scope.loadChart();
        });

        //redirect to dashboard
        if (typeof stateData === 'undefined') {
            $location.path('/dashboard');
        }

        $scope.loadChart = function () {

            data = [];
            dataOil = [];
            dataGas = [];
            stateData = DataFactory.getData().stateData;

            angular.forEach(stateData, function (row) {
                var sumAnnGasWells = (row.sum_NAgas_prod_MCF === 0) ? 1 : row.sum_NAgas_prod_MCF;
                var sumAnnOilWells = (row.sum_oil_prod_BBL === 0) ? 1 : row.sum_oil_prod_BBL;

                dataOil.push({
                    x: row.state, y: Math.round((row.sum_oil_prod_BBL_rate_range / sumAnnOilWells) * 100)
                });
                dataGas.push({
                    x: row.state, y: Math.round((row.sum_NAgas_prod_MCF_rate_range / sumAnnGasWells) * 100)
                });
            });

            data.push({
                key: 'Gas',
                color: "#99ddff",
                values: dataGas
            });
            data.push({
                key: 'Oil',
                color: "#ff8080",
                values: dataOil
            });

            nv.addGraph(function () {
                var chart = nv.models.multiBarChart()
                        //.transitionDuration(350)
                        .reduceXTicks(false)   //If 'false', every single x-axis tick label will be rendered.
                        .rotateLabels(0)      //Angle to rotate x-axis labels.
                        .showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
                        .groupSpacing(0.1)    //Distance between each group of bars.
                        .staggerLabels(false)
                    ;

                chart.xAxis
                    .axisLabel("US States")
                    .axisLabelDistance(1)
                    .showMaxMin(false);

                chart.yAxis
                    .axisLabel("% of Annual Production")

                d3.select('#barChart svg')
                    .datum(data)
                    .transition().duration(500).call(chart);

                nv.utils.windowResize(chart.update);

                return chart;
            });
        };

        $scope.loadChart();
    }]);

