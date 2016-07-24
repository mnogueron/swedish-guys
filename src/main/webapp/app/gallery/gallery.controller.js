(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .controller('GalleryController', GalleryController);

    GalleryController.$inject = ['$scope', '$location', '$state', 'LastEntries', 'LastPictures'];

    function GalleryController ($scope, $location, $state, LastEntries, LastPictures) {

        var vm = this;

        vm.pictures = LastPictures.query({nb: 5}, function(){
            if(vm.pictures.length > 0) {
                vm.loadSliderPictures = true;
            }
            console.log(vm.pictures);
        });
        
        $scope.go = function ( path ) {
            console.log(path);
            $location.path( path );
        };
    }
})();
