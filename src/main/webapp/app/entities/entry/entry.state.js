(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('entry', {
            parent: 'entity',
            url: '/entry',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'swedishguysApp.entry.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/entry/entries.html',
                    controller: 'EntryController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('entry');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('entry-detail', {
            parent: 'entity',
            url: '/entry/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'swedishguysApp.entry.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/entry/entry-detail.html',
                    controller: 'EntryDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('entry');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Entry', function($stateParams, Entry) {
                    return Entry.get({id : $stateParams.id});
                }]
            }
        })
        .state('entry.new', {
            parent: 'entry',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/entry/entry-dialog.html',
                    controller: 'EntryDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                title: null,
                                content: null,
                                date: null,
                                picture: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('entry', null, { reload: true });
                }, function() {
                    $state.go('entry');
                });
            }]
        })
        .state('entry.edit', {
            parent: 'entry',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/entry/entry-dialog.html',
                    controller: 'EntryDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Entry', function(Entry) {
                            return Entry.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('entry', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('entry.delete', {
            parent: 'entry',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/entry/entry-delete-dialog.html',
                    controller: 'EntryDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Entry', function(Entry) {
                            return Entry.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('entry', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
