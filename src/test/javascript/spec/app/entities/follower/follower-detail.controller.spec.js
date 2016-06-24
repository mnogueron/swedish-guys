'use strict';

describe('Controller Tests', function() {

    describe('Follower Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockFollower, MockBlog;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockFollower = jasmine.createSpy('MockFollower');
            MockBlog = jasmine.createSpy('MockBlog');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'Follower': MockFollower,
                'Blog': MockBlog
            };
            createController = function() {
                $injector.get('$controller')("FollowerDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'swedishguysApp:followerUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
