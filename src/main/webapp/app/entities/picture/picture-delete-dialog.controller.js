(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .controller('PictureDeleteController',PictureDeleteController);

    PictureDeleteController.$inject = ['$uibModalInstance', 'entity', 'Picture'];

    function PictureDeleteController($uibModalInstance, entity, Picture) {
        var vm = this;
        vm.picture = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            Picture.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
