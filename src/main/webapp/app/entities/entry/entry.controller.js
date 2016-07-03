(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .controller('EntryController', EntryController);

    EntryController.$inject = ['$scope', '$location', '$state', 'Principal', 'DataUtils', 'Entry', 'Blog', 'Tag'];

    function EntryController ($scope, $location, $state, Principal, DataUtils, Entry, Blog, Tag) {
        var vm = this;
        vm.entries = [];
        vm.openFile = DataUtils.openFile;
        vm.byteSize = DataUtils.byteSize;
        vm.loadAll = function() {
            Entry.query(function(result) {
                Principal.hasAuthority("ROLE_ADMIN").then(function(value){
                    if(value){
                        vm.entries = result;
                    }
                    else{
                        Principal.identity().then(function(account) {
                            vm.account = account;
                            vm.entries = result;
                            vm.entries = vm.entries.filter(function(element){
                                return element.blog.user.login == account.login;
                            });
                        });
                    }
                });
            });
        };

        vm.loadAll();

        var currentTime = new Date();
        $scope.currentTime = currentTime;
        $scope.month = ['Januar', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        $scope.monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $scope.weekdaysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        $scope.weekdaysLetter = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        $scope.disable = [false, 1, 7];
        $scope.today = 'Today';
        $scope.clear = 'Clear';
        $scope.close = 'Close';
        var days = 15;
        $scope.minDate = (new Date($scope.currentTime.getTime() - ( 1000 * 60 * 60 *24 * days ))).toISOString();
        $scope.maxDate = (new Date($scope.currentTime.getTime() + ( 1000 * 60 * 60 *24 * days ))).toISOString();
        $scope.onStart = function () {
            console.log('onStart');
        };
        $scope.onRender = function () {
            console.log('onRender');
        };
        $scope.onOpen = function () {
            console.log('onOpen');
        };
        $scope.onClose = function () {
            console.log('onClose');
        };
        $scope.onSet = function () {
            console.log('onSet');
        };
        $scope.onStop = function () {
            console.log('onStop');
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('swedishguysApp:entryUpdate', result);
            angular.element($('#entry-modal')).first().closeModal();
            vm.loadAll();
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            vm.entry.date = new Date();
            if (vm.entry.id !== null) {
                Entry.update(vm.entry, onSaveSuccess, onSaveError);
            } else {
                Entry.save(vm.entry, onSaveSuccess, onSaveError);
            }
        };

        vm.openNewEntry = function(){
            $location.path('#/newEntry');
        };

        vm.openEntryModal = function(){
            vm.entry = {
                title: null,
                content: null,
                date: null,
                picture: null,
                id: null
            };
            vm.blogs = Blog.query();
            vm.tags = Tag.query();
            angular.element($('#entry-modal')).first().openModal();
        }

        vm.clear = function() {
            angular.element($('#entry-modal')).first().closeModal();
        };

        vm.openFile = DataUtils.openFile;
        vm.byteSize = DataUtils.byteSize;
    }
})();
