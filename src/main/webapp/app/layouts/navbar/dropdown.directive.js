(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .directive('materializeDropdown', materializeDropdown);

    function materializeDropdown() {
        var directive = {
            restrict: 'A',
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, element, attrs) {
            scope.$evalAsync(function () {
                // code that runs after conditional content
                // with ng-if has been added to DOM, if the ng-if
                // is enabled
                angular.element(element).find(".dropdown-button").dropdown();
            });
        }
    }
})();
