(function() {
    'use strict';
    angular
        .module('swedishguysApp')
        .factory('LastPictures', LastPictures)
        .factory('PicturesAccess', PicturesAccess)
        .factory('PicturesNumber', PicturesNumber);

    LastPictures.$inject = ['$resource'];

    function LastPictures ($resource) {
        return $resource('api/pictures/last/:nb');
    }

    PicturesAccess.$inject = ['$resource'];

    function PicturesAccess($resource) {
        return $resource('api/pictures/:nb/:offset');
    }

    PicturesNumber.$inject = ['$resource'];

    function PicturesNumber($resource) {
        return $resource('api/pictures/number');
    }
})();
