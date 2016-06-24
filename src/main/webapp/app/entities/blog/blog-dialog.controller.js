(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .controller('BlogDialogController', BlogDialogController);

    BlogDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', '$q', 'entity', 'Blog', 'User', 'Entry'];

    function BlogDialogController ($timeout, $scope, $stateParams, $uibModalInstance, $q, entity, Blog, User, Entry) {
        var vm = this;
        vm.blog = entity;
        vm.users = User.query();
        vm.entries = Entry.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        var onSaveSuccess = function (result) {
            $scope.$emit('swedishguysApp:blogUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.blog.id !== null) {
                Blog.update(vm.blog, onSaveSuccess, onSaveError);
            } else {
                Blog.save(vm.blog, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
