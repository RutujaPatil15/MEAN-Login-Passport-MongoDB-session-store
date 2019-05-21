angular.module('Myapp.services', [])

.factory('API', function($rootScope, $http, $window) {
  return{
    signup:function(frm)
    {
      return $http.post('/signup',frm)
    },
     login:function(frm)
    {
      return $http.post('/login',frm)
    },
     isuserloggedin:function()
    {
      return $http.get('/isuserloggedin')
    }
}
})
