// Facebook Login for the Web with the JavaScript SDK
// More details: https://developers.facebook.com/docs/facebook-login/login-flow-for-web/v2.3

window.fbAsyncInit = function() {
  FB.init({
    appId      : 'appId',
    cookie     : true,  // enable cookies to allow the server to access the session                        
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.2' // use version 2.2
  });
};

// Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// This function is called when someone click button connect to Fb
function connectToFacebook() {
  FB.login(function(response) {
    statusChangeCallback(response);
  },{scope: 'public_profile, email'});
}

/** 
  Status of response:
    + connected: Logged into your app and Facebook.
    + not_authorized: The person is logged into Facebook, but not your app.
    + other: The person is not logged into Facebook, so we're not sure if
**/
function statusChangeCallback(response) {  
  if (response.status === 'connected'){
    // Get info of user (response) when connect success
    FB.api('/me', function(response) {
      signUpByFacebook(response);      
    });
  
  } else if (response.status === 'not_authorized') {    
    // Status: document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';

  } else {
    // Status: document.getElementById('status').innerHTML = 'Please log ' + 'into Facebook.';
  }
}

/**
  If user exist in system, user will be auto sign in.
  Else fill user information to form sign up.
**/
function signUpByFacebook(response){
  $.ajax({        
    url: "/users/sign_in",
    method: "POST",
    data: {
      email : response.email,
      fb_user_id : response.id
    },
    dataType: 'json'
  })
  .done(function(data){
    if (data.success){
      window.location.reload();
    }
    else{
      SignInUp.appendInfoToForm(response);
    }    
  });
}