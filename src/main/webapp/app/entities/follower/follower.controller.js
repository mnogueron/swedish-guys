(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .controller('FollowerController', FollowerController);

    FollowerController.$inject = ['$scope', '$state', 'Follower'];

    function FollowerController ($scope, $state, Follower) {
        var vm = this;
        vm.followers = [];
        vm.loadAll = function() {
            Follower.query(function(result) {
                vm.followers = result;
            });
        };

        vm.loadAll();
        
    }
})();
