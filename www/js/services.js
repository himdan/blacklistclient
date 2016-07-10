angular.module('starter.services', [])
 .factory('Authen', function() {
  var LOCAL_TOKEN_KEY = '';
  var username = '';
  var isAuthenticated = false;
  var role = '';
  var authToken;
  var apikey='';    
  
  

  var storeUserCredentials=function (token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
     useCredentials(token);
  };

  var useCredentials=function (token) {
    username = token.split('.')[0];
    isAuthenticated = true;
    authToken = token;

    //role = USER_ROLES.public
    apikey=token.split('.')[1];
    // Set the token as header for your requests!
    //$http.defaults.headers.common['X-Auth-Token'] = token.split('.')[1];
  };

  var destroyUserCredentials=function () {
    authToken = undefined;
    username = '';
    apikey=''  ;
    isAuthenticated = false;
    //$http.defaults.headers.common['X-Auth-Token'] = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
      //alert('cridential destroyed');
  };

 

  

  var isAuthorized = function(authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
  };



  return {
    loadUserCredential:function () {
    token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
       // alert(apikey);
    }
  },  
    handleLogin: function(name, apikey) {
     storeUserCredentials(name + '.'+apikey);
        
     
  },
    logout: function() {
    destroyUserCredentials();
  },
    
    username: function() {return username;},
    isAuthenticated: function(){ return isAuthenticated; },
    apikey: function() {return apikey;}
  };
})


.factory('Categories',function($http){
    var req={
        method: 'GET',
        url:'',
        headers:{
            'Accept':'Application/json'
        }
    };
    return{
        getAll:function(){
            req.url=root+'/mobile/categories.json';
            return $http(req);
        },
        get:function(categoryId){
            req.url=root+'/mobile/categories/'+categoryId+'.json';
            return $http(req);
        }
    };
}).factory('Claims',function($http){
    var req={
        method: 'GET',
        url:'',
        headers:{
            'Accept':'Application/json'
        }
    };
    return{
        getAll:function(){
            req.url=root+'/mobile/claims.json';
            return $http(req);
        },
        get:function(claimId){
            req.url=root+'/mobile/claims/'+claimId+'.json';
            return $http(req);
        }
    };
}).factory('MyClaims',function($http){
    var req={
        method: 'POST',
        url:'',
        data:'',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept':'Application/json'
        }
    };
    return{
        getAll:function(apikey){
            req.url=root+'/mobile/claims.json';
            req.data='apikey='+apikey;
            return $http(req);
        },
        add:function(claim){
            req.url=root+'/mobile/news/claims.json';
            req.data='apikey='+claim.apikey+'&title='+claim.title
                              +'&description='+claim.description
                              +'&category='+claim.category;
            return $http(req);
        },
        update:function(claim){
            req.url=root+'/mobile/updates/claims.json';
            req.data='apikey='+claim.apikey+'&title='+claim.title
                              +'&description='+claim.description
                              +'&category='+claim.category
                              +'&id='+claim.id;
            return $http(req);
        }
    };
}).factory('Account',function($http){
    var req={
        method: 'POST',
        url:'',
        data:'',
        
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept':'Application/json',
             
        }
    };
    return{
        login:function(user){
            req.url=root+'/mobile/login';
            req.data='username='+user.name+'&password='+user.password;
            return $http(req);
        },
        register:function(user){
            req.url=root+'/mobile/register';
            req.data='username='+user.name+'&email='+user.email+'&password='+user.password;
            return $http(req);
        },
        logout:function(token){
            req.url=root+'/mobile/logout/'+token;
            return $http(req);
        }
    };
}).factory('ServiceLocation',function($http){
    var req={
        method: 'POST',
        url:'',
        data:'',
        
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept':'Application/json',
             
        }
    };
    return{
        Send:function(location){
            req.url=root+'/mobile/locations/'+location.claim+'.json';
            req.data='latitude='+location.latitude
                     +'&longitude='+location.longitude
                     +'&address='+location.address
                     +'&description='+location.description
                     +'&apikey='+location.ApiKey;
            return $http(req);
        }
    };
}).factory('Camera', function($q) {

   return {
      getPicture: function(options) {
         var q = $q.defer();

         navigator.camera.getPicture(function(result) {
            q.resolve(result);
         }, function(err) {
            q.reject(err);
         }, options);

         return q.promise;
      }
   }

}).factory('GeoService', function($ionicPlatform, $cordovaGeolocation) {

  var positionOptions = {timeout: 1, enableHighAccuracy: true};

  return {
    getPosition: function() {
      return $ionicPlatform.ready()
        .then(function() {
          return $cordovaGeolocation.getCurrentPosition(positionOptions);
        })
    }
  };

});
