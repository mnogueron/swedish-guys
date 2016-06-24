(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .controller('BlogDeleteController',BlogDeleteController);

    BlogDeleteController.$inject = ['$uibModalInstance', 'entity', 'Blog'];

    function BlogDeleteController($uibModalInstance, entity, Blog) {
        var vm = this;
        vm.blog = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            Blog.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
