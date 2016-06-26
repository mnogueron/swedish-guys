(function() {
    'use strict';

    angular
        .module('swedishguysApp', [
            'ngStorage',
            'tmh.dynamicLocale',
            'pascalprecht.translate',
            'ngResource',
            'ngCookies',
            'ngAria',
            'ngSanitize',
            'ui.materialize',
            'froala',
            'treeControl',
            'ngCacheBuster',
            'ngFileUpload',
            'ui.bootstrap',
            'ui.bootstrap.datetimepicker',
            'ui.router',
            'infinite-scroll',
            // jhipster-needle-angularjs-add-module JHipster will add new module here
            'angular-loading-bar'
        ])
        .run(run);

    run.$inject = ['stateHandler', 'translationHandler', '$sanitize', '$compileProvider'];

    function run(stateHandler, translationHandler, $sanitize, $compileProvider) {
        stateHandler.initialize();
        translationHandler.initialize();
        console.log($sanitize);
        console.log($compileProvider);
    }
})();
