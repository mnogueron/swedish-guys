(function() {
    'use strict';
    angular
        .module('swedishguysApp')
        .factory('LastPictures', LastPictures);

    LastPictures.$inject = ['$resource'];

    function LastPictures ($resource) {
        return $resource('api/pictures/last/:nb');
    }
})();
