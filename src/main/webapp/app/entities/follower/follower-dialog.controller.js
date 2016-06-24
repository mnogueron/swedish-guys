(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .controller('FollowerDialogController', FollowerDialogController);

    FollowerDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Follower', 'Blog'];

    function FollowerDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Follower, Blog) {
        var vm = this;
        vm.follower = entity;
        vm.blogs = Blog.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        var onSaveSuccess = function (result) {
            $scope.$emit('swedishguysApp:followerUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.follower.id !== null) {
                Follower.update(vm.follower, onSaveSuccess, onSaveError);
            } else {
                Follower.save(vm.follower, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
