(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .controller('BlogSpaceController', BlogSpaceController);

    BlogSpaceController.$inject = ['$scope', '$state', '$stateParams', 'BlogSpace'];

    function BlogSpaceController ($scope, $state, $stateParam, BlogSpace) {

        var vm = this;
        vm.blogName = $stateParam.blogName;

        //check if blogName is good and return 404 otherwise
        if(vm.blogName != 'anna' && vm.blogName != 'jules' && vm.blogName != 'matthieu'
            && vm.blogName != 'maxime' && vm.blogName != 'reatha'){
            $state.transitionTo("error");
        }

        // get entries
        vm.entries = BlogSpace.query({owner:vm.blogName, nb: 5, offset: 0}, function(){
            console.log(vm.entries);
        })
    }
})();
