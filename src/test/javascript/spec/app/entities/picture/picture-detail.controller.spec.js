'use strict';

describe('Controller Tests', function() {

    describe('Picture Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockPicture, MockTag, MockBlog, MockUser;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockPicture = jasmine.createSpy('MockPicture');
            MockTag = jasmine.createSpy('MockTag');
            MockBlog = jasmine.createSpy('MockBlog');
            MockUser = jasmine.createSpy('MockUser');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'Picture': MockPicture,
                'Tag': MockTag,
                'Blog': MockBlog,
                'User': MockUser
            };
            createController = function() {
                $injector.get('$controller')("PictureDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'swedishguysApp:pictureUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
