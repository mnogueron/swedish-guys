(function() {
    'use strict';

    angular
        .module('swedishguysApp')
        .directive('compile', ['$compile', compile]);

    function compile ($compile) {
        var directive = {
            restrict: 'A',
            link: linkFunc
        };

        return directive;

        function linkFunc (scope, element, attrs) {
            console.log(scope, element, attrs);
            scope.$watch(

                function(scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.compile);
                },
                function(value) {
                     console.log(value);

                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    element.html(value);

                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(element.contents())(scope);
                }
            );
        }
    }
})();
