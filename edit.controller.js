'use strict';
angular.module('Admin')
    .controller('EditUserController',
    function ($scope,$upload, $timeout,$rootScope,$http,$routeParams,$location,$modal){
        $http.get('/api/check_user').success(function (check) {
            $scope.check =check;
            if($scope.check.status == false){
                $location.path('/login');
            }else{
                if(check.user.user_group ==2){
                    $location.path('/designer');
                }
                if(check.user.user_group ==1){
                    $location.path('/');
                }
                if(check.user.user_group == 99) {
                    $scope.Editloader = false;
                    $scope.user = [];
                    $scope.roles = [
                        {name: 'Admin'},
                        {name: 'User'},
                        {name: 'Designer'}
                    ];
                    $http.post('/api/get_user', {
                        "user_id": $routeParams.id
                    }).success(function (data) {
                        $scope.user = [];
                        $scope.user = data;
                        if(Object.keys($scope.user).length == 0){
                            $scope.Editloader = true;
                            $scope.user = [];
                            $scope.messages = " ";
                            $scope.messages ="User not found";
                            $scope.state = 3;
                            $scope.location = '';
                            $modal.open({
                                templateUrl: 'modules/home/views/modalConfirming.html',
                                controller: 'ModalInstanceCtrl',
                                resolve: {
                                    messages: function () {
                                        return $scope.messages;
                                    },
                                    state: function () {
                                        return $scope.state;
                                    },
                                    location: function () {
                                        return $scope.location;
                                    }
                                }
                            });
                        }
                        if(Object.keys($scope.user).length != 0){
                            $scope.Editloader = false;
                        if ($scope.user.user_group == 2) {
                            $scope.myrole = $scope.roles[2];
                            $scope.designer = false;
                        }
                        if ($scope.user.user_group == 99) {
                            $scope.myrole = $scope.roles[0];
                            $scope.designer = true;
                        }
                        if ($scope.user.user_group == 1) {
                            $scope.myrole = $scope.roles[1];
                            $scope.designer = true;
                        }}
                    });
                    $scope.change = function () {
                        if ($scope.myrole.name == "Designer") {
                            $scope.designer = false;
                        }
                        else {
                            $scope.designer = true;
                        }
                    };
                    var user_group = '';
                    $scope.edit = function () {
                        $scope.Editloader = true;
                        if ($scope.myrole.name == "Designer") {
                            user_group = '2';
                            $scope.user.email_designer = $scope.user.email;
                        }
                        if ($scope.myrole.name == "Admin") {
                            user_group = '99';
                        }
                        if ($scope.myrole.name == "User") {
                            user_group = '1';
                        }
                        $http.post('/api/edit_user ', {
                            "user_id": $routeParams.id,
                            "first_name": $scope.user.first_name,
                            "last_name": $scope.user.last_name,
                            "email": $scope.user.email,
                            "email_designer": $scope.user.email_designer,
                            "password": $scope.user.password,
                            "user_group": user_group
                        }).success(function (data) {
                            if (data.status == false) {
                                $scope.error = angular.fromJson(data.errors);
                                $scope.Editloader = false;
                            }
                            if (data.status == true) {
                                $scope.Editloader = true;
                                $scope.messages = " ";
                                $scope.messages ="User profile updated successfully";
                                $scope.state = 3;
                                $scope.location = '';
                                $modal.open({
                                    templateUrl: 'modules/home/views/modalConfirming.html',
                                    controller: 'ModalInstanceCtrl',
                                    resolve: {
                                        messages: function () {
                                            return $scope.messages;
                                        },
                                        state: function () {
                                            return $scope.state;
                                        },
                                        location: function () {
                                            return $scope.location;
                                        }
                                    }
                                });
                            }
                        });
                    };
                }
            }
        })
    });