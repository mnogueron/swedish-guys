(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .controller('BlogSpaceController', BlogSpaceController);

    BlogSpaceController.$inject = ['$scope', '$state', '$stateParams', '$locale', 'EntriesAccess', 'BoundingDates'];

    function BlogSpaceController ($scope, $state, $stateParam, $locale, EntriesAccess, BoundingDates) {

        var vm = this;
        vm.blogName = $stateParam.blogName;

        //check if blogName is good and return 404 otherwise
        if(vm.blogName != 'anna' && vm.blogName != 'jules' && vm.blogName != 'matthieu'
            && vm.blogName != 'maxime' && vm.blogName != 'reatha'){
            $state.transitionTo("error");
        }

        // get entries
        vm.entries = EntriesAccess.query({owner:vm.blogName, nb: 5, offset: 0}, function(){
            console.log(vm.entries);
        });

        $scope.treeOptions = {
            nodeChildren: "children",
            dirSelectable: true,
            injectClasses: {
                ul: "a1",
                li: "a2",
                liSelected: "a7",
                iExpanded: "a3",
                iCollapsed: "a4",
                iLeaf: "a5",
                label: "a6",
                labelSelected: "a8"
            }
        };
        $scope.dataForTheTree = [];

        vm.dates = BoundingDates.query({owner:vm.blogName}, function(){
            console.log(vm.dates);
            for(var i = 0; i < vm.dates.length; i++){
                var months = [];
                for(var j = 0; j < vm.dates[i].month.length; j++) {
                    months.push({"content": $locale.DATETIME_FORMATS.MONTH[vm.dates[i].month[j]-1], "children": []});
                }
                $scope.dataForTheTree.push({"content" : vm.dates[i].year, "children": months});
            }
        })
    }
})();
