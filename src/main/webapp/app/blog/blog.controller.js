(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .controller('BlogSpaceController', BlogSpaceController);

    BlogSpaceController.$inject = ['$scope', '$state', '$sce', '$stateParams', '$locale', 'EntriesAccess', 'BoundingDates'];

    function BlogSpaceController ($scope, $state, $sce, $stateParam, $locale, EntriesAccess, BoundingDates) {

        var vm = this;
        vm.blogName = $stateParam.blogName;

        //check if blogName is good and return 404 otherwise
        if(vm.blogName != 'anna' && vm.blogName != 'jules' && vm.blogName != 'matthieu'
            && vm.blogName != 'maxime' && vm.blogName != 'reatha'){
            $state.transitionTo("error");
        }

        switch (vm.blogName){
            case "anna":
                vm.image = "content/images/anna.jpg";
                vm.name = "Anna";
                vm.detail = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nisi mauris, lobortis pellentesque est quis, vehicula vestibulum felis.Sed ornare tortor nec blandit sodales. Morbi fringilla vulputate aliquam. Etiam semper tristique tortor, eget cursus mi. Sed pulvinar tristique dapibus. Duis velit ex, commodo id ornare quis, ornare et felis. Nam."
                break;
            case "jules":
                vm.image = "content/images/jules.jpg";
                vm.name = "Jules";
                vm.detail = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nisi mauris, lobortis pellentesque est quis, vehicula vestibulum felis.Sed ornare tortor nec blandit sodales. Morbi fringilla vulputate aliquam. Etiam semper tristique tortor, eget cursus mi. Sed pulvinar tristique dapibus. Duis velit ex, commodo id ornare quis, ornare et felis. Nam."
                break;
            case "matthieu":
                vm.image = "content/images/matthieu.jpg";
                vm.name = "Matthieu";
                vm.detail = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nisi mauris, lobortis pellentesque est quis, vehicula vestibulum felis.Sed ornare tortor nec blandit sodales. Morbi fringilla vulputate aliquam. Etiam semper tristique tortor, eget cursus mi. Sed pulvinar tristique dapibus. Duis velit ex, commodo id ornare quis, ornare et felis. Nam."
                break;
            case "maxime":
                vm.image = "content/images/maxime.jpg";
                vm.name = "Maxime";
                vm.detail = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nisi mauris, lobortis pellentesque est quis, vehicula vestibulum felis.Sed ornare tortor nec blandit sodales. Morbi fringilla vulputate aliquam. Etiam semper tristique tortor, eget cursus mi. Sed pulvinar tristique dapibus. Duis velit ex, commodo id ornare quis, ornare et felis. Nam."
                break;
            case "reatha":
                vm.image = "content/images/reatha.jpg";
                vm.name = "Reatha";
                vm.detail = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nisi mauris, lobortis pellentesque est quis, vehicula vestibulum felis.Sed ornare tortor nec blandit sodales. Morbi fringilla vulputate aliquam. Etiam semper tristique tortor, eget cursus mi. Sed pulvinar tristique dapibus. Duis velit ex, commodo id ornare quis, ornare et felis. Nam."
                break;
            default:
                break;
        }

        // get entries
        vm.entries = EntriesAccess.query({owner:vm.blogName, nb: 5, offset: 0}, function(){
            console.log(vm.entries);
            vm.entries.forEach(function(element, index, array){
                array[index].content = $sce.trustAsHtml(element.content);
            })
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
        });


    }
})();
