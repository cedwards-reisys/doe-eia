'use strict';

/**
 * @ngdoc function
 * @name app.Factory:FilterFactory
 * @description
 * 
 */
angular.module('app').factory('DataFactory', [ function (){
    var aData = {};

    return {
        setData: function(_aData) {
            aData = _aData;
        },
        getData: function() {
            return aData;
        }
    };
}]);
