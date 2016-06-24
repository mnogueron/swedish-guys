(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .controller('FollowerDeleteController',FollowerDeleteController);

    FollowerDeleteController.$inject = ['$uibModalInstance', 'entity', 'Follower'];

    function FollowerDeleteController($uibModalInstance, entity, Follower) {
        var vm = this;
        vm.follower = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            Follower.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
