(function() {
    'use strict';
    angular
        .module('swedishguysApp')
        .factory('Follower', Follower)
        .factory('FollowerByEmail', FollowerByEmail)
        .factory('PublicFollower', PublicFollower)
        .factory('DeleteFollowerByEmail', DeleteFollowerByEmail);

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

    FollowerByEmail.$inject = ['$resource'];

    function FollowerByEmail ($resource) {
        var resourceUrl =  'api/followers/findByEmail/:email';

        return $resource(resourceUrl, {}, {
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            }
        });
    }

    PublicFollower.$inject = ['$resource'];

    function PublicFollower ($resource) {
        var resourceUrl =  'api/followers/public/:id';

        return $resource(resourceUrl, {}, {
            'update': { method:'PUT' }
        });
    }

    DeleteFollowerByEmail.$inject = ['$resource'];

    function DeleteFollowerByEmail ($resource) {
        var resourceUrl =  'api/followers/deleteByEmail/:email';

        return $resource(resourceUrl);
    }

})();
