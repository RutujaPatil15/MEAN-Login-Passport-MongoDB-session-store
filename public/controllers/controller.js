angular.module('Myapp.controller', [])

.controller('signupCtrl',function($mdToast,$filter,$timeout,$scope,$rootScope,API,$window,$location){
   $scope.submit=function(frm){
    if (frm.$valid) {
        API.signup({
            username:$scope.username,
            email:$scope.email,
            password:$scope.password
        }).then(function(data) {
               if(data.data===true)
                {
                    var type="success";
                    $mdToast.show(
                     $mdToast.simple()
                      .content("successfully added")
                      .hideDelay(2000)
                      .position('bottom right')
                      .theme(type + "-toast"));
                     $location.path('/');
                }
                 else
                {
                    var type="error";
                    $mdToast.show(
                      $mdToast.simple()
                      .content("error-email is already registered.")
                      .hideDelay(2000)
                      .position('bottom right')
                      .theme(type + "-toast"));
                }
              },
                function (data, status, headers, config) {
                  alert('server error timeout');
      })
}
}

})
.controller('loginCtrl', function($mdToast,$filter,$timeout,$scope,$rootScope,API,$window,$location) {
 API.isuserloggedin({withCredentials :true}).then(function(response) {
      $location.path('/home');
  }, function(err) {
  });

  $scope.loginform=function(frm){
    if (frm.$valid) {
      API.login({email:$scope.email,password:$scope.password},{withCredentials :true}).then(function(data) {
          var type="success";
          $mdToast.show(
            $mdToast.simple()
            .content("Login successfully")
            .hideDelay(2000)
            .position('bottom right')
            .theme(type + "-toast")
           );
           $location.path('/home');

    }, function(err) {
          var type="error";
          $mdToast.show(
            $mdToast.simple()
            .content("enter valid email or password")
            .hideDelay(2000)
            .position('bottom right')
            .theme(type + "-toast")
          );
    });
  };
}
})
.controller('homeCtrl',function($http,$scope,$location,$rootScope,API,$mdToast){
  API.isuserloggedin({withCredentials :true}).then(function(response) {
       }, function(err) {
         $location.path('/');
     });

 $scope.logout=function(){
       $http.get('/logout').then(function(response) {
           $location.path('/');
       }, function(err) {

       });
    };

 })
