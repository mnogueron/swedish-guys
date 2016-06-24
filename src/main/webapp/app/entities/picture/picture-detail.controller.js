(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .controller('PictureDetailController', PictureDetailController);

    PictureDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Picture', 'User', 'Tag', 'Blog'];

    function PictureDetailController($scope, $rootScope, $stateParams, entity, Picture, User, Tag, Blog) {
        var vm = this;
        vm.picture = entity;
        
        var unsubscribe = $rootScope.$on('swedishguysApp:pictureUpdate', function(event, result) {
            vm.picture = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
