(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .controller('GalleryController', GalleryController);

    GalleryController.$inject = ['$scope', '$location', '$state', '$stateParams', 'PICTURES_NUMBER', 'LastEntries', 'PicturesAccess', 'PicturesNumber'];

    function GalleryController ($scope, $location, $state, $stateParam, PICTURES_NUMBER, LastEntries, PicturesAccess, PicturesNumber) {

        var vm = this;
        vm.page = ($stateParam.page == "" || $stateParam.page < 1)?1:$stateParam.page;

        /*vm.pictures = LastPictures.query({nb: 5}, function(){
            if(vm.pictures.length > 0) {
                vm.loadSliderPictures = true;
            }
            console.log(vm.pictures);
        });*/

        $scope.go = function ( path ) {
            console.log(path);
            $location.path( path );
        };

        // get number of entries
        vm.picturesNumber = PicturesNumber.get({}, function() {
            vm.picturesNumber = vm.picturesNumber.number;
            console.log(vm.picturesNumber);
            vm.pageNumber = Math.ceil(vm.picturesNumber / PICTURES_NUMBER);
            console.log(vm.pageNumber);
            vm.displayPagination = vm.picturesNumber > PICTURES_NUMBER;

            if (vm.page > vm.pageNumber) {
                vm.page = 1;
            }

            // get pictures
            vm.pictures = PicturesAccess.query({
                nb: PICTURES_NUMBER,
                offset: PICTURES_NUMBER * (vm.page - 1)
            }, function () {
                console.log(vm.pictures);
            });
        });

        $scope.changePage = function(page){
            $state.go("gallery", ({page: page}));
        };
    }
})();
