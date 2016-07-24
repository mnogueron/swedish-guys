(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('gallery', {
            parent: 'app',
            url: '/gallery/{page}',
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
                    templateUrl: 'app/gallery/gallery.html',
                    controller: 'GalleryController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                    $translatePartialLoader.addPart('gallery');
                    return $translate.refresh();
                }]
            }
        });
    }
})();
