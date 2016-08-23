(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .controller('WelcomeController', WelcomeController);

    WelcomeController.$inject = ['$scope', '$location', '$state', 'LastEntries', 'LastPictures'];

    function WelcomeController ($scope, $location, $state, LastEntries, LastPictures) {

        var vm = this;
        vm.profiles = [];
        vm.entries = [];
        vm.pictures = [];
        vm.loadSlider = false;
        vm.loadSliderPictures = false;

        vm.profiles = [
            {
                image: "content/images/anna.jpg",
                name: "Anna",
                destination: '/blogspace/anna',
                age: "25 ans",
                detail: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nisi mauris, lobortis pellentesque est quis, vehicula vestibulum felis.Sed ornare tortor nec blandit sodales. Morbi fringilla vulputate aliquam. Etiam semper tristique tortor, eget cursus mi. Sed pulvinar tristique dapibus. Duis velit ex, commodo id ornare quis, ornare et felis. Nam."
            },
            {
                image: "content/images/jules.jpg",
                name: "Jules",
                destination: '/blogspace/jules',
                age: "22 ans",
                detail: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nisi mauris, lobortis pellentesque est quis, vehicula vestibulum felis.Sed ornare tortor nec blandit sodales. Morbi fringilla vulputate aliquam. Etiam semper tristique tortor, eget cursus mi. Sed pulvinar tristique dapibus. Duis velit ex, commodo id ornare quis, ornare et felis. Nam."
            },
            {
                image: "content/images/matthieu.jpg",
                name: "Matthieu",
                destination: '/blogspace/matthieu',
                age: "22 ans",
                detail: "Féru de treks et de randonnées, c'est après avoir fait un rapide passage par Malmö et Göteborg lors d'un roadtrip en Norvège, que la Suède s'est imposée comme destination évidente d'échange ! Bienvenue dans les contrées aux paysages sauvages, là où le soleil se couche pendant 6 mois et reste les yeux ouverts le reste du temps. La course à la découverte est lancée ! Välkommen i Sevrige! :)"
            },
            {
                image: "content/images/maxime.jpg",
                name: "Maxime",
                destination: '/blogspace/maxime',
                age: "22 ans",
                detail: "Je voyage depuis tout jeune avec mes parents, c'est donc logiquement que je profite de l'occasion qui m'est offerte d'étudier un semestre à l'étranger ! J'espère que le partage de mon expérience vous encouragera à venir visiter le pays des Élans, des Kanelbullar et d'IKEA ;)"
            },
            {
                image: "content/images/reatha.jpg",
                name: "Reatha",
                destination: '/blogspace/reatha',
                age: "22 ans",
                detail: "\"Wanderlust (noun): a strong, innate desire to rove or travel about.\" Je pars à la découverte de la Scandinavie pour 8 mois alors... À moi l'aventure Erasmus !"
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

        angular.element(document).ready(function() {
            angular.element($(".slider")).first().css("height", "400px");
        });

        $scope.go = function ( path ) {
            console.log(path);
            $location.path( path );
        };
    }
})();
