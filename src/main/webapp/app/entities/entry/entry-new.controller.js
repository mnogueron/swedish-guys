(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .controller('NewEntryController', NewEntryController);

    NewEntryController.$inject = ['$scope', '$rootScope', '$sce', '$stateParams', 'Principal', 'DataUtils', 'entity', 'Entry', 'Blog', 'Tag'];

    function NewEntryController($scope, $rootScope, $sce, $stateParams, Principal, DataUtils, entity, Entry, Blog, Tag) {
        var vm = this;
        vm.entry = entity;
        vm.blogs = Blog.query();
        vm.tags = Tag.query();
        vm.tag = "";
        vm.entry.blog = undefined;

        if($stateParams.id != null){
            vm.entry = Entry.get({id:$stateParams.id}, function(){
                for(var i = 0; i < vm.entry.tags.length; i++){
                    vm.tag += vm.entry.tags[i].label + ";";
                }
            });
        }

        getAccount();

        function getAccount() {
            Principal.identity().then(function(account) {
                vm.account = account;
                vm.isAuthenticated = Principal.isAuthenticated;
            });
        }

        $scope.$watch('vm.tag', function() {
                vm.tagsDisplay = vm.tag.split(';').filter(function(element, index, self){return element != "" && self.indexOf(element) == index;});
                vm.tagsDisplay.forEach(function(element, index, array){
                    array[index] = element.replace(/^\s+|\s+$/g, '').replace(/\s\s+/g, ' ');
                });
        });

        $scope.$watch('vm.entry.content', function() {
            console.log(vm.entry.content);
            /*vm.contentDisplayed = $sce.trustAsHtml(vm.entry.content);*/
            vm.contentDisplayed = vm.entry.content;
        });

        var onSaveError = function () {
            vm.isSaving = false;
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('swedishguysApp:entryUpdate', result);
            vm.isSaving = false;
        };

        vm.updateTags = function(){
            // add tags if they don't exists
            var promises = [];
            for(var i = 0; i<vm.tagsDisplay.length; i++){
                var found = false;
                for(var j = 0; j < vm.tags.length; j++){
                    if(vm.tags[j].label == vm.tagsDisplay[i]){
                        found = true;
                        break;
                    }
                }
                if(!found){
                    var promise = Tag.update({id:null, label:vm.tagsDisplay[i]});
                    promise.$promise.then(function(result){
                        $scope.$emit('swedishguysApp:tagUpdate', result);
                    });
                    promises.push(promise.$promise);
                }
            }
            return Promise.all(promises);
        };

        vm.save = function () {
            vm.updateTags().then(
                function(){
                    vm.tags = Tag.query();
                    vm.tags.$promise.then(function(){
                        console.log(vm.tags);
                        vm.isSaving = true;
                        vm.entry.date = new Date();
                        if(vm.entry.blog === undefined){
                            console.log(vm.blogs);
                            for(var i = 0; i < vm.blogs.length; i++){
                                if(vm.blogs[i].user.login == vm.account.login){
                                    vm.entry.blog = vm.blogs[i];
                                    break;
                                }
                            }
                        }
                        vm.entry.tags = [];
                        console.log(vm.tagsDisplay);
                        for(var i = 0; i < vm.tagsDisplay.length; i++){
                            for(var j = 0; j < vm.tags.length; j++) {
                                console.log(vm.tags[j]);
                                console.log(vm.tagsDisplay[i]);
                                if (vm.tags[j].label == vm.tagsDisplay[i]) {
                                    vm.entry.tags.push(vm.tags[j]);
                                    break;
                                }
                            }
                        }
                        console.log(vm.entry);
                        if (vm.entry.id !== null) {
                            Entry.update(vm.entry, onSaveSuccess, onSaveError);
                        } else {
                            Entry.save(vm.entry, onSaveSuccess, onSaveError);
                        }
                    });
                }
            )
        };

        vm.clear = function() {
            console.log(vm.entry);
            vm.entry = entity;
            vm.entry.title = null;
            vm.entry.content = null;
            vm.entry.picture = null;
            vm.tag = "";
            vm.entry.blog = undefined;
            console.log(vm.entry);
        };

        vm.openFile = DataUtils.openFile;
        vm.byteSize = DataUtils.byteSize;
    }
})();
