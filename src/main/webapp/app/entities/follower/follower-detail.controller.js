(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .controller('FollowerDetailController', FollowerDetailController);

    FollowerDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Follower', 'Blog'];

    function FollowerDetailController($scope, $rootScope, $stateParams, entity, Follower, Blog) {
        var vm = this;
        vm.follower = entity;
        
        var unsubscribe = $rootScope.$on('swedishguysApp:followerUpdate', function(event, result) {
            vm.follower = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
