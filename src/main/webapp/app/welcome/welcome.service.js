(function() {
    'use strict';
    angular
        .module('swedishguysApp')
        .factory('Home', Home);

    Home.$inject = ['$resource', 'DateUtils'];

    function Home ($resource, DateUtils) {
        return $resource('api/entries/last/all/:nb/0');
    }
})();
