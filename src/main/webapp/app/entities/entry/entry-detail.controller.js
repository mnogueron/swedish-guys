(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .controller('EntryDetailController', EntryDetailController);

    EntryDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'DataUtils', 'entity', 'Entry', 'Blog', 'Tag'];

    function EntryDetailController($scope, $rootScope, $stateParams, DataUtils, entity, Entry, Blog, Tag) {
        var vm = this;
        vm.entry = entity;
        
        var unsubscribe = $rootScope.$on('swedishguysApp:entryUpdate', function(event, result) {
            vm.entry = result;
        });
        $scope.$on('$destroy', unsubscribe);

        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;
    }
})();
