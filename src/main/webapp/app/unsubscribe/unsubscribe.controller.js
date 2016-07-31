(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .controller('UnsubscribeController', UnsubscribeController);

    UnsubscribeController.$inject = ['$scope', '$location', '$state', 'DeleteFollowerByEmail'];

    function UnsubscribeController ($scope, $location, $state, DeleteFollowerByEmail) {

        var vm = this;
        vm.removeFollower = function(){
            DeleteFollowerByEmail.delete({email: vm.email},
                function(){
                    Materialize.toast('Vous vous êtes correctement désabonné du service de notification', 4000);
                },
                function(error){
                    if(error.status == 404){
                        Materialize.toast('Cette adresse mail est inconnue', 4000);
                    }
                    else{
                        Materialize.toast('Nous n\'avons pu vous désabonner. Merci de réessayer ultérieurement.', 4000);
                    }
                }
            )
        }
    }
})();
