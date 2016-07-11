(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('blogspace', {
            parent: 'app',
            url: '/blogspace/{blogName}/{page}',
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
                    templateUrl: 'app/blog/blog.html',
                    controller: 'BlogSpaceController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                    $translatePartialLoader.addPart('ui.blog');
                    return $translate.refresh();
                }]
            }
        });
    }
})();
