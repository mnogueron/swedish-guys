(function() {
    'use strict';
    angular
        .module('swedishguysApp')
        .factory('Follower', Follower);

    Follower.$inject = ['$resource'];

    function Follower ($resource) {
        var resourceUrl =  'api/followers/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
