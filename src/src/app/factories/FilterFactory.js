'use strict';

/**
 * @ngdoc function
 * @name app.Factory:FilterFactory
 * @description
 * 
 */
angular.module('app').factory('FilterFactory', [ function (){
    var filters = {};

    return {
        setFilters: function(oFilter) {
            filters = oFilter;
        },
        getFilters: function() {
            return filters;
        }
    };
}]);
