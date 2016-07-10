angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,Categories) {
    $scope.root=root;
    $scope.loading=true;
    Categories.getAll().then(function(response){
        $scope.loading=false;
        $scope.categories=response.data;
    },function(){console.log('something went wrong');});
    
})
.controller('CategoryDetailCtrl',function($scope,$stateParams,Categories){
    $scope.root=root;
    $scope.loading=true;
    Categories.get($stateParams.categoryId).then(function(response){
        $scope.loading=false;
        $scope.category=response.data;
    },function(){console.log('something went wrong')});
})
.controller('ClaimDetailCtrl',function($scope,$stateParams,Claims){
    $scope.root=root;
    $scope.loading=true;
    Claims.get($stateParams.claimId).then(function(response){
        $scope.loading=false;
        $scope.claim=response.data;
    },function(){console.log('something went wrong')});
})
.controller('MediaCtrl',function($scope,$stateParams,Claims){
    $scope.root=root;
    Claims.get($stateParams.claimId).then(function(response){
        $scope.claim=response.data;
    },function(){console.log('something went wrong')});
})
.controller('MapCtrl', function($scope,$stateParams,Claims) {
    $scope.root=root;
   
    Claims.get($stateParams.claimId).then(function(response){
        $scope.claim=response.data;
         var location={
                       longitude:response.data.location.longtitude,
                       latitude:response.data.location.latitude,
                       description:response.data.location.description,
                       address:response.data.location.description
                       };
     
     var latLng = new google.maps.LatLng(location.latitude, location.longitude);
     var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    $scope.location=location; 
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
 
  var marker = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      position: latLng
  });      
 
});    
    },function(){console.log('something went wrong')});
   
 
  
})

.controller('LoginCtrl', function($scope, $state, $ionicPopup, Account,Authen) {
  $scope.user = {name:'',password:''};
  $scope.root=root;
  Authen.loadUserCredential();
  if(Authen.username()){
      $state.go('tab.myclaims', {}, {reload: true });
  }    
  $scope.send = function(user) {
    Account.login(user).then(function(response) {
        Authen.handleLogin(user.name,response.data.ApiKey);
        $state.go('tab.myclaims', {}, {reload: true });
    }, function(response) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
    });
  };
})
.controller('MyClaimsCtrl',function($scope, $state, $ionicPopup, Authen,MyClaims){
    $scope.root=root;
    Authen.loadUserCredential();
    $scope.username = Authen.username();
    $scope.apikey=Authen.apikey();
    $scope.myclaims=[];

  $scope.setCurrentUsername = function(name) {
    $scope.username = name;
  };
   $scope.logout=function(){
        Authen.logout();
        $state.go('tab.login', {}, {reload: true });
    };  
   // alert('this is your apikey: \n'+Authen.apikey());
  MyClaims.getAll(Authen.apikey()).then(function(response){
     
      $scope.myclaims=response.data;
  },function(err){
     console.log('something went wrong:%o',err); 
  });    
}).controller('NewClaimCtrl',function($scope,$state,Categories,Authen,MyClaims,$ionicPopup){
    $scope.root=root;
    Authen.loadUserCredential();
    var claim={title:'',description:'',category:'',apikey:Authen.apikey()};
    $scope.username=Authen.username();
    $scope.apikey=Authen.apikey();
    $scope.claim=claim;
    Categories.getAll().then(function(response){
        $scope.categories=response.data;
    },function(err){
        console.log('something went wrong:%o',err);
    });
    $scope.send=function(claim){
        //alert('claim Api key: '+claim.apikey+'\ncategory:'+claim.category+'\ntitle: '+claim.title+'\ndescription: '+claim.description);
        MyClaims.add(claim).then(function(response){
            var alertPopup = $ionicPopup.alert({
      title: 'New Claim Added!',
      template: 'You have added  an New claim'
    });
            //$state.go('tab.myclaims', {}, {reload: true});
            $state.go('tab.claim-show', {claimId: response.data.id}, {reload: true});
        },function(err){
            console.log('something went wrong:%o',err);
        });
    }
    $scope.logout=function(){
        Authen.logout();
        $state.go('tab.login');
    }; 
    
})
.controller('ShowClaimCtrl',function($scope,$state,$stateParams,Claims,Authen){
    $scope.root=root;
    Authen.loadUserCredential();
    $scope.username=Authen.username();
    $scope.apikey=Authen.apikey();
    Claims.get($stateParams.claimId).then(function(response){
        $scope.claim=response.data;
    },function(err){console.log('something went wrong: %o',err)});
     $scope.logout=function(){
        Authen.logout();
        $state.go('tab.login');
    }; 
})
.controller('EditClaimCtrl',function($scope,$state,$stateParams,Claims,MyClaims,Categories,$ionicPopup,Authen){
    Authen.loadUserCredential();
    $scope.claim={id:'',title:'',description:'',category:'',apikey:''};
    $scope.claim.apikey=Authen.apikey();
    $scope.username = Authen.username();
    $scope.apikey=Authen.apikey();
    $scope.root=root;
    $scope.selected='selected';
    
    Categories.getAll().then(function(response){
        $scope.categories=response.data;
    },function(err){
        console.log('something went wrong:%o',err);
    });
    Claims.get($stateParams.claimId).then(function(response){
        $scope.claim.id=response.data.id;
        $scope.claim.title=response.data.title;
        $scope.claim.description=response.data.description
        $scope.claim.category=response.data.category.id;
        
    },function(err){console.log('something went wrong: %o',err)});
    $scope.edit=function(claim){
        //console.log('claim object:',claim);
        MyClaims.update(claim).then(function(response){
             var alertPopup = $ionicPopup.alert({
      title: 'this Claim is updated!',
      template: 'You have updated this claim'
    });
            $state.go('tab.claim-show', {claimId: $stateParams.claimId}, {reload: true});
        },function(err){
            console.log('something went wrong %o',err);
        });
    };
})
 .controller('MyMapCtrl', function($scope, $state,$stateParams,Authen,GeoService,ServiceLocation,$ionicPopup) {
  Authen.loadUserCredential(); 
  var location={
         longitude:'',
         latitude:'',
         address:'',
         description:'',
         claim:$stateParams.claimId,
         ApiKey:''};   
    location.ApiKey=Authen.apikey();
    $scope.location=location;
  $scope.shareLocation=function(){
    GeoService.getPosition().then(function(position){
    $scope.location.latitude=position.coords.latitude;
    $scope.location.longitude=position.coords.longitude;
    $scope.show=true;    
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
 
  var marker = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      position: latLng
  });      
 
});  
 
  }, function(error){
   // alert("Could not get location");  
    console.log("Could not get location:%o",error);
  });
  };
  
  $scope.send=function(location){
      //alert('longitude:'+location.longitude+'\nlatitude:'+location.latitude+'\ndescripion:'+location.description+'\naddress:'+location.address+'\nclaim:'+location.claim+'\nApiKey:'+location.ApiKey);
      ServiceLocation.Send(location).then(function(response){
          var alertPopup = $ionicPopup.alert({
        title: 'new Location created',
        template: 'new location had been created'
      });
         $state.go('tab.claim-show', {claimId: $stateParams.claimId}, {reload: true});
      },function(err){
          console.log('something went wrong :%o',err);
      });
  };    
})
.controller('CameraCtrl', function($scope, Camera, $timeout,$state, $cordovaFileTransfer,$stateParams,$ionicPopup,Authen) {
    Authen.loadUserCredential();
    $scope.username=Authen.username(); 
    $scope.apikey=Authen.apikey(); 
    $scope.medium={file:'',alternative:''};  
    $scope.takePicture = function () {
      var options = {
         quality : 75,
         targetWidth: 600,
         targetHeight: 600,
         sourceType: 1
      };

      Camera.getPicture(options).then(function(imageData) {
         $scope.picture = imageData;
         $scope.medium.file=imageData;
         //alert(imageData);
      }, function(err) {
         // alert('something went wrong');
         console.log('something went wrong %o',err);
      });
		
   };
     $scope.getPicture = function () {
	
      var options = {
         quality : 75,
         targetWidth: 600,
         targetHeight: 600,
         sourceType: 0
      };

      Camera.getPicture(options).then(function(imageData) {
         $scope.picture = imageData;
         $scope.medium.file=imageData;
      }, function(err) {
        //alert('something went wrong');
         console.log('something went wrong %o',err);
      });
   };  
    // define 
    
  $scope.send=function(medium){
    // alert('file:'+medium.file+'\nalerternative:'+medium.alternative);
    var server=root+'/mobile/media/'+$stateParams.claimId+'.json';
    var filePath=medium.file;
    var options = {
    fileKey: "File",
    httpMethod: "POST", 
    params: {'alternative':medium.alternative,'apikey':Authen.apikey()},         
    chunkedMode: false,
     };     
     $cordovaFileTransfer.upload(server, filePath, options)
      .then(function(result) {
        // Success!
          var alertPopup = $ionicPopup.alert({
      title: 'picture uploaded',
      template: 'You have uploaded a new picture'
    });
         $state.go('tab.myclaims', {}, {reload: true});
      }, function(err) {
        //alert('something went wrong:%o',err);
         console.log('something went wrong %o',err);
      }, function (progress) {
        // constant progress updates
      });

  };
    $scope.logout=function(){
        Authen.logout();
        $state.go('tab.login');
    }; 
     
})

.controller('AccountCtrl', function($scope,Account,Authen,$state,$window) {
   
  Authen.loadUserCredential();
  if(Authen.isAuthenticated()){
      $state.go('tab.myclaims', {}, {reload: true});
  }else{
      //$state.go($state.current, {}, {reload: true});
  }       
  $scope.user={
       'name':'',
       'email':'',
       'gender':'',        
       'password':'',
       'password2':'',
       'agree':''
         };    
  $scope.register=function(user){
      Account.register(user).then(function(response){
          Authen.handleLogin(user.name,response.data.ApiKey);
           $state.go('tab.myclaims', {}, {reload: true});
      },function(err){
          $scope.status='Your Email or username Already exist';
          console.log('something went wrong %o',err);
      });
  };    
});
