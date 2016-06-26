(function() {
    'use strict';
    angular
        .module('swedishguysApp')
        .factory('Picture', Picture);

    Picture.$inject = ['$resource', 'DateUtils'];

    function Picture ($resource, DateUtils) {
        var resourceUrl =  'api/pictures/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                        data.date = DateUtils.convertDateTimeFromServer(data.date);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
