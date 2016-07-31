(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('unsubscribe', {
            parent: 'app',
            url: '/unsubscribe',
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
                    templateUrl: 'app/unsubscribe/unsubscribe.html',
                    controller: 'UnsubscribeController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                    $translatePartialLoader.addPart('unsubscribe');
                    return $translate.refresh();
                }]
            }
        });
    }
})();
