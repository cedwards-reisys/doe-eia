'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendApp
 */
angular.module('app').service('ApiInterfaceService', ['$http', '$q', '$log', function ($http, $q, $log) {
    //list of APIs we're using
    var APIs = {
        "us2009Sample": "/assets/data/2009.json",
    };

    this.APIs = APIs;

    /**
     * common function to perform an API CALL
     * 
     * @param String ApiName
     * @param String ApiSuffix
     * @param Object JSON oParams
     * @returns {$q@call;defer.promise}
     */
    this.call = function(ApiName, ApiSuffix, oParams) {
        var deferred = $q.defer();

        $http.get(APIs[ApiName] + ApiSuffix, {params: oParams})
        .success(function(data) { 
            deferred.resolve(data);
        }).error(function(msg, code) {
            deferred.reject(msg);
            $log.error(msg, code);
        });

        return deferred.promise;
    };

    /**
     * common function to perform multiple API CALLS
     * 
     * @param Array object aApiParams
     * @returns {$q@call;defer.promise}
     */
    this.calls = function(aApiParams) {
        var deferred = $q.defer();
        var urlCalls = [];

        angular.forEach(aApiParams, function(oApiParam){
            urlCalls.push($http.get(APIs[oApiParam.name], {params:oApiParam.oParams}));
        });

        $q.all(urlCalls)
        .then(
            function(results) {
                deferred.resolve(results);
            },
            function(errors) {
                deferred.reject(errors);
                $log.error(errors);
            },
            function(updates) {
                deferred.update(updates);
            }
        );

        return deferred.promise;
    };
}]);
