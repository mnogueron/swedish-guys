(function() {
    'use strict';
    angular
        .module('swedishguysApp')
        .factory('BlogSpace', BlogSpace);

    BlogSpace.$inject = ['$resource', 'DateUtils'];

    function BlogSpace ($resource, DateUtils) {
        return $resource('api/entries/:owner/:nb/:offset');
    }
})();
