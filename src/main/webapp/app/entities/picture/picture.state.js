(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('picture', {
            parent: 'entity',
            url: '/picture',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'swedishguysApp.picture.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/picture/pictures.html',
                    controller: 'PictureController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('picture');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('picture-detail', {
            parent: 'entity',
            url: '/picture/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'swedishguysApp.picture.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/picture/picture-detail.html',
                    controller: 'PictureDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('picture');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Picture', function($stateParams, Picture) {
                    return Picture.get({id : $stateParams.id});
                }]
            }
        })
        .state('picture.new', {
            parent: 'picture',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/picture/picture-dialog.html',
                    controller: 'PictureDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                url: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('picture', null, { reload: true });
                }, function() {
                    $state.go('picture');
                });
            }]
        })
        .state('picture.edit', {
            parent: 'picture',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/picture/picture-dialog.html',
                    controller: 'PictureDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Picture', function(Picture) {
                            return Picture.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('picture', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('picture.delete', {
            parent: 'picture',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/picture/picture-delete-dialog.html',
                    controller: 'PictureDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Picture', function(Picture) {
                            return Picture.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('picture', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
