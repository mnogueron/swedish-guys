(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .controller('BlogSpaceController', BlogSpaceController);

    BlogSpaceController.$inject = ['$scope', '$state', '$sce', '$stateParams', '$locale', 'POSTS_NUMBER', 'EntriesAccess', 'EntriesAccessByDate', 'BoundingDates', 'EntriesNumber', 'FollowerByEmail', 'PublicFollower'];

    function BlogSpaceController ($scope, $state, $sce, $stateParam, $locale, POSTS_NUMBER, EntriesAccess, EntriesAccessByDate, BoundingDates, EntriesNumber, FollowerByEmail, PublicFollower) {

        var vm = this;
        vm.blogName = $stateParam.blogName;
        vm.page = ($stateParam.page == "" || $stateParam.page < 1)?1:$stateParam.page;
        vm.displayPagination = false;

        //check if blogName is good and return 404 otherwise
        if(vm.blogName != 'anna' && vm.blogName != 'jules' && vm.blogName != 'matthieu'
            && vm.blogName != 'maxime' && vm.blogName != 'reatha'){
            $state.transitionTo("error");
        }

        vm.checked = {
            anna: vm.blogName == 'anna',
            jules: vm.blogName == 'jules',
            matthieu: vm.blogName == 'matthieu',
            maxime: vm.blogName == 'maxime',
            reatha: vm.blogName == 'reatha'
        }

        switch (vm.blogName){
            case "anna":
                vm.image = "content/images/anna.jpg";
                vm.name = "Anna";
                vm.age = "25 ans";
                vm.detail = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nisi mauris, lobortis pellentesque est quis, vehicula vestibulum felis.Sed ornare tortor nec blandit sodales. Morbi fringilla vulputate aliquam. Etiam semper tristique tortor, eget cursus mi. Sed pulvinar tristique dapibus. Duis velit ex, commodo id ornare quis, ornare et felis. Nam."
                break;
            case "jules":
                vm.image = "content/images/jules.jpg";
                vm.name = "Jules";
                vm.age = "22 ans";
                vm.detail = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nisi mauris, lobortis pellentesque est quis, vehicula vestibulum felis.Sed ornare tortor nec blandit sodales. Morbi fringilla vulputate aliquam. Etiam semper tristique tortor, eget cursus mi. Sed pulvinar tristique dapibus. Duis velit ex, commodo id ornare quis, ornare et felis. Nam."
                break;
            case "matthieu":
                vm.image = "content/images/matthieu.jpg";
                vm.name = "Matthieu";
                vm.age = "22 ans";
                vm.detail = "Féru de treks et de randonnées, c'est après avoir fait un rapide passage par Malmö et Göteborg lors d'un roadtrip en Norvège, que la Suède s'est imposée comme destination évidente d'échange ! Bienvenue dans les contrées aux paysages sauvages, là où le soleil se couche pendant 6 mois et reste les yeux ouverts le reste du temps. La course à la découverte est lancée ! Välkommen i Sevrige! :)"
                break;
            case "maxime":
                vm.image = "content/images/maxime.jpg";
                vm.name = "Maxime";
                vm.age = "22 ans";
                vm.detail = "Je voyage depuis tout jeune avec mes parents, c'est donc logiquement que je profite de l'occasion qui m'est offerte d'étudier un semestre à l'étranger ! J'espère que le partage de mon expérience vous encouragera à venir visiter le pays des Élans, des Kanelbullar et d'IKEA ;)"
                break;
            case "reatha":
                vm.image = "content/images/reatha.jpg";
                vm.name = "Reatha";
                vm.age = "22 ans";
                vm.detail = "\"Wanderlust (noun): a strong, innate desire to rove or travel about.\" Je pars à la découverte de la Scandinavie pour 8 mois alors... À moi l'aventure Erasmus !"
                break;
            default:
                break;
        }

        if(isNaN(vm.page)){
            var reg = new RegExp(/^\d{2}-\d{4}$/);
            if(reg.test(vm.page)){
                vm.entries = EntriesAccessByDate.query({owner:vm.blogName, date: vm.page}, function(){
                    console.log(vm.entries);
                    vm.entries.forEach(function(element, index, array){
                        array[index].content = $sce.trustAsHtml(element.content);
                    })
                });
            }
        }
        else{

            // get number of entries
            vm.entriesNumber = EntriesNumber.get({owner:vm.blogName}, function(){
                vm.entriesNumber = vm.entriesNumber.number;
                console.log(vm.entriesNumber);
                vm.pageNumber = Math.ceil(vm.entriesNumber / POSTS_NUMBER);
                vm.displayPagination = vm.entriesNumber > POSTS_NUMBER;

                if(vm.page > vm.pageNumber){
                    vm.page = 1;
                }

                // get entries
                vm.entries = EntriesAccess.query({owner:vm.blogName, nb: POSTS_NUMBER, offset: POSTS_NUMBER*(vm.page-1)}, function(){
                    console.log(vm.entries);
                    /*vm.entries.forEach(function(element, index, array){
                        array[index].content = $sce.trustAsHtml(element.content);
                    })*/
                });
            });
        }


        $scope.treeOptions = {
            nodeChildren: "children",
            dirSelectable: false,
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

        $scope.monthToInt = function(month){
            return $locale.DATETIME_FORMATS.MONTH.indexOf(month) + 1;
        };

        $scope.changePage = function(page){
            $state.go("blogspace", ({blogName: vm.blogName, page: page}));
        };

        $scope.isDefaultChecked = function(owner){
            console.log(owner);
        };

        $scope.showSelected = function(node, parent){
            console.log(node, parent);
            if(parent != null){
                var month = $scope.monthToInt(node.content);
                month = ("0" + month).substr(-2);
                var date = month +"-" + parent.content;
                $scope.changePage(date);
            }
        };

        var onSaveSuccess = function (result) {
            Materialize.toast('Vous avez été correctement inscrit au service de notification.', 4000);
            $scope.$emit('swedishguysApp:followerUpdate', result);
            vm.isSaving = false;
            $state.go('blogspace', {blogName: vm.blogName, page: vm.page});
        };

        var onSaveError = function () {
            Materialize.toast("Une erreur s'est produite et vous n'avez pas été correctement inscrit au service de notification.", 4000);
            vm.isSaving = false;
            $state.go('blogspace', {blogName: vm.blogName, page: vm.page});
        };

        vm.saveFollower = function () {

            console.log("test");
            vm.isSaving = true;

            vm.follower = FollowerByEmail.get({email: vm.email}, function(){
                console.log(vm.follower);
                vm.follower.subscriptions = [];
                if(vm.checked.anna){
                    vm.follower.subscriptions.push('anna');
                }
                if(vm.checked.jules){
                    vm.follower.subscriptions.push('jules');
                }
                if(vm.checked.matthieu){
                    vm.follower.subscriptions.push('matthieu');
                }
                if(vm.checked.maxime){
                    vm.follower.subscriptions.push('maxime');
                }
                if(vm.checked.reatha){
                    vm.follower.subscriptions.push('reatha');
                }
                PublicFollower.update(vm.follower, onSaveSuccess, onSaveError);
                /*if (vm.follower.id !== null) {
                    Follower.update(vm.follower, onSaveSuccess, onSaveError);
                } else {
                    Follower.save(vm.follower, onSaveSuccess, onSaveError);
                }*/
            }, function(error){
                if(error.status == '404'){
                    console.log(error);
                    vm.follower.email = vm.email;
                    vm.follower.subscriptions = [];
                    if(vm.checked.anna){
                        vm.follower.subscriptions.push('anna');
                    }
                    if(vm.checked.jules){
                        vm.follower.subscriptions.push('jules');
                    }
                    if(vm.checked.matthieu){
                        vm.follower.subscriptions.push('matthieu');
                    }
                    if(vm.checked.maxime){
                        vm.follower.subscriptions.push('maxime');
                    }
                    if(vm.checked.reatha){
                        vm.follower.subscriptions.push('reatha');
                    }
                    PublicFollower.save(vm.follower, onSaveSuccess, onSaveError);
                }
            });
        };

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
