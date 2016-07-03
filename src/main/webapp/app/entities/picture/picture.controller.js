(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .controller('PictureController', PictureController);

    PictureController.$inject = ['$scope', '$state', 'Principal', 'Picture'];

    function PictureController ($scope, $state, Principal, Picture) {
        var vm = this;
        vm.pictures = [];
        vm.loadAll = function() {
            Picture.query(function(result) {
                Principal.hasAuthority("ROLE_ADMIN").then(function(value){
                    if(value){
                        vm.pictures = result;
                    }
                    else{
                        Principal.identity().then(function(account) {
                            vm.account = account;
                            vm.pictures = result;
                            vm.pictures = vm.pictures.filter(function(element){
                                return element.user.login == account.login;
                            });
                        });
                    }
                });
            });
        };

        vm.loadAll();

    }
})();
