(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('welcome', {
            parent: 'app',
            url: '/',
            data: {
                authorities: []
            },
            views: {
                'navbar@': {
                    templateUrl: 'app/layouts/navbar-website/navbar-website.html',
                    controller: 'NavbarWebsiteController',
                    controllerAs: 'vm'
                },
                'content@': {
                    templateUrl: 'app/welcome/welcome.html',
                    controller: 'WelcomeController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                    $translatePartialLoader.addPart('welcome');
                    return $translate.refresh();
                }]
            }
        });
    }
})();
