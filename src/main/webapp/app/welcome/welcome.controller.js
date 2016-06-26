(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .controller('WelcomeController', WelcomeController);

    WelcomeController.$inject = ['$scope', '$location', '$state', 'LastEntries', 'LastPictures'];

    function WelcomeController ($scope, $location, $state, LastEntries, LastPictures) {
        angular.element(document).ready(function() {
            angular.element($(".slider")).first().css("height", "400px");
        });

        $scope.go = function ( path ) {
            console.log(path);
            $location.path( path );
        };

        var vm = this;
        vm.loadSlider = false;
        vm.loadSliderPictures = false;

        vm.profiles = [
            {
                image: "content/images/anna.jpg",
                name: "Anna",
                destination: '/blogspace/anna',
                detail: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nisi mauris, lobortis pellentesque est quis, vehicula vestibulum felis.Sed ornare tortor nec blandit sodales. Morbi fringilla vulputate aliquam. Etiam semper tristique tortor, eget cursus mi. Sed pulvinar tristique dapibus. Duis velit ex, commodo id ornare quis, ornare et felis. Nam."
            },
            {
                image: "content/images/jules.jpg",
                name: "Jules",
                destination: '/blogspace/jules',
                detail: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nisi mauris, lobortis pellentesque est quis, vehicula vestibulum felis.Sed ornare tortor nec blandit sodales. Morbi fringilla vulputate aliquam. Etiam semper tristique tortor, eget cursus mi. Sed pulvinar tristique dapibus. Duis velit ex, commodo id ornare quis, ornare et felis. Nam."
            },
            {
                image: "content/images/matthieu.jpg",
                name: "Matthieu",
                destination: '/blogspace/matthieu',
                detail: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nisi mauris, lobortis pellentesque est quis, vehicula vestibulum felis.Sed ornare tortor nec blandit sodales. Morbi fringilla vulputate aliquam. Etiam semper tristique tortor, eget cursus mi. Sed pulvinar tristique dapibus. Duis velit ex, commodo id ornare quis, ornare et felis. Nam."
            },
            {
                image: "content/images/maxime.jpg",
                name: "Maxime",
                destination: '/blogspace/maxime',
                detail: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nisi mauris, lobortis pellentesque est quis, vehicula vestibulum felis.Sed ornare tortor nec blandit sodales. Morbi fringilla vulputate aliquam. Etiam semper tristique tortor, eget cursus mi. Sed pulvinar tristique dapibus. Duis velit ex, commodo id ornare quis, ornare et felis. Nam."
            },
            {
                image: "content/images/reatha.jpg",
                name: "Reatha",
                destination: '/blogspace/reatha',
                detail: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nisi mauris, lobortis pellentesque est quis, vehicula vestibulum felis.Sed ornare tortor nec blandit sodales. Morbi fringilla vulputate aliquam. Etiam semper tristique tortor, eget cursus mi. Sed pulvinar tristique dapibus. Duis velit ex, commodo id ornare quis, ornare et felis. Nam."
            }
        ];

        vm.entries = LastEntries.query(function(){
            if(vm.entries.length > 0) {
                vm.loadSlider = true;
            }
            console.log(vm.entries);
        });

        vm.pictures = LastPictures.query({nb: 5}, function(){
            if(vm.pictures.length > 0) {
                vm.loadSliderPictures = true;
            }
            console.log(vm.pictures);
        });
    }
})();
