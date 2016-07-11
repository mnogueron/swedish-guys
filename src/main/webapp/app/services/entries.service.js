(function() {
    'use strict';
    angular
        .module('swedishguysApp')
        .factory('LastEntries', LastEntries)
        .factory('BoundingDates', BoundingDates)
        .factory('EntriesAccess', EntriesAccess)
        .factory('EntriesNumber', EntriesNumber)
        .factory('EntriesAccessByDate', EntriesAccessByDate);

    LastEntries.$inject = ['$resource', 'DateUtils'];

    function LastEntries ($resource, DateUtils) {
        return $resource('api/entries/last');
    }

    BoundingDates.$inject = ['$resource'];

    function BoundingDates($resource) {
        return $resource('api/entries/dates/:owner');
    }

    EntriesAccess.$inject = ['$resource'];

    function EntriesAccess($resource) {
        return $resource('api/entries/:owner/:nb/:offset');
    }

    EntriesAccessByDate.$inject = ['$resource'];

    function EntriesAccessByDate($resource) {
        return $resource('api/entries/:owner/:date');
    }

    EntriesNumber.$inject = ['$resource'];

    function EntriesNumber($resource) {
        return $resource('api/entries/number/:owner');
    }
})();
