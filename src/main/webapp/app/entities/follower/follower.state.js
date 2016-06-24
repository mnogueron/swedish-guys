(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('follower', {
            parent: 'entity',
            url: '/follower',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'swedishguysApp.follower.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/follower/followers.html',
                    controller: 'FollowerController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('follower');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('follower-detail', {
            parent: 'entity',
            url: '/follower/{id}',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'swedishguysApp.follower.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/follower/follower-detail.html',
                    controller: 'FollowerDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('follower');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Follower', function($stateParams, Follower) {
                    return Follower.get({id : $stateParams.id});
                }]
            }
        })
        .state('follower.new', {
            parent: 'follower',
            url: '/new',
            data: {
                authorities: ['ROLE_ADMIN']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/follower/follower-dialog.html',
                    controller: 'FollowerDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                email: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('follower', null, { reload: true });
                }, function() {
                    $state.go('follower');
                });
            }]
        })
        .state('follower.edit', {
            parent: 'follower',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_ADMIN']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/follower/follower-dialog.html',
                    controller: 'FollowerDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Follower', function(Follower) {
                            return Follower.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('follower', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('follower.delete', {
            parent: 'follower',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_ADMIN']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/follower/follower-delete-dialog.html',
                    controller: 'FollowerDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Follower', function(Follower) {
                            return Follower.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('follower', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
