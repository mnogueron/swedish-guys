(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .controller('PictureDialogController', PictureDialogController);

    PictureDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Picture', 'User', 'Tag', 'Blog'];

    function PictureDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Picture, User, Tag, Blog) {
        var vm = this;
        vm.picture = entity;
        vm.users = User.query();
        vm.tags = Tag.query();
        vm.blogs = Blog.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        var onSaveSuccess = function (result) {
            $scope.$emit('swedishguysApp:pictureUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            vm.picture.date = new Date();
            if (vm.picture.id !== null) {
                Picture.update(vm.picture, onSaveSuccess, onSaveError);
            } else {
                Picture.save(vm.picture, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
