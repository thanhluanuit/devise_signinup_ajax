var SignInUp = {
  init: function(){
    var self = this;

    self.modal_signup = $("#signup_modal");
    self.modal_signin = $("#signin_modal");
    self.validator();
    self.clearForm(self.modal_signup);
    self.clearForm(self.modal_signin);
    self.callbackSubmit(self.modal_signup);
    self.callbackSubmit(self.modal_signin);    
  },

  /* Validate form sign in/up in client */
  validator: function(){    
    var formSignUp = $(document).find("#sign_up_user");
    var formSignIn = $(document).find("#sign_in_user");

    $(formSignUp).validate({      
      rules: {
        "user[firstname]": {
          required: true            
        },
        
        "user[lastname]": {
          required: true
        }, 
        
        "user[username]": {
          required: true,
          minlength: 3,
          regex: /^[A-Za-z0-9]{3,100}$/
        },

        "user[email]": {
          required: true,
          regex: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
        },
        
        "user[password]": {
          required: true,
          minlength: 8
        },
        
        "user[password_confirmation]": {
          equalTo: "#user_password"
        }
      }
      , messages: {
        "user[firstname]": {
          required: "Can't be blank"          
        }
        
        ,"user[lastname]": {
          required: "Can't be blank"
        }

        ,"user[username]": {
          required: "Can't be blank",
          minlength: "Username must be at least 3 characters.",
          regex: "Username contain only letters and numbers."
        }
        
        ,"user[email]": {
          required: "No spam, we promise"
          , regex: "Please correct the email address"          
        }
        
        ,"user[password]": {
          minlength: "Password must be at least 8 characters."
        }

        ,"user[password_confirmation]": {
          equalTo: "Password don't match."
        }
      }
      , errorPlacement: function(error, element) {
          error.appendTo( element.parent(".form-group").children(".show-error") );
      }      
    });
    
    $(formSignIn).validate({      
      rules: {        
        "user[email]": {
          required: true,
          regex: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
        },
        
        "user[password]": {
          required: true,
          minlength: 8
        }
      }
      , messages: {                
        "user[email]": {          
          regex: "Please correct the email address"          
        }
        
        ,"user[password]": {
          minlength: "Password must be at least 8 characters."
        }
      }
      , errorPlacement: function(error, element) {
          error.appendTo( element.parent(".form-group").children(".show-error") );
      }      
    });

  },

  /* Reset form */
  clearForm: function(modal){
    var self = this;

    $(modal).on('hidden.bs.modal', function (e) {
      var form = $(this).find("form");
      var validator = form.validate();
      form[0].reset();
      validator.resetForm();
      form.find(".form-group").removeClass("has-error");
      $(modal).find(".errors ul li").remove();
    })
  },

  /* Show errors when sign in */
  errorsSignIn: function(data, modal){
    var ul = $(modal).find(".errors ul");
    $(ul).find("li").remove();
    $(ul).append("<li> " + data.message + "</li>");        
  },

  /* Show errors when sign up */
  errorsSignUp: function(data, modal){
    var self = this;
    var idItem = "";
    var exMessage = "";
    var message = data.message;
    var itemsError = Object.keys(message);
    var ul = $(modal).find(".errors ul");
    
    $(ul).find("li").remove();

    for(var index in itemsError){
      idItem = "#user_" + itemsError[index];
      $(modal).find("form").find(idItem).closest(".form-group").addClass("has-error");

      if (itemsError[index] == "username"){
        exMessage = "<p>" + "Use another one Ex: " + self.recommendUsername($(modal).find("form").find(idItem).val()) + "</p>";
        $(ul).append("<li> " + self.titleize(itemsError[index]) + " " + message[itemsError[index]][0] + exMessage + "</li>");
      }
      else{
        $(ul).append("<li> " + self.titleize(itemsError[index]) + " " + message[itemsError[index]][0] + "</li>");
      }
    }
  },

  /* Excute errors from server */
  errorsFromServer: function(data, modal){
    if(data.cause == "invalid"){
      this.errorsSignIn(data, modal);
    }
    else{
      this.errorsSignUp(data, modal);
    }
  },

  titleize: function(string){
    var firsStr = string[0];
    return string.replace(firsStr, firsStr.toUpperCase());
  },

  recommendUsername: function(username){
    return username + this.getRandomNumber();
  },

  /* Generate a random number, between 10-1000 */
  getRandomNumber:function() {
    var number = Math.floor(Math.random() * 100) + 10; /* Between 10-1000 */
    return number.toString();
  },

  /**
    - Append data to form, data is 'repsonse'
    - 'response':  
        first_name: "Nguyễn"
        gender: "male"
        id: "4567231164593672"
        last_name: "Luân"  
        middle_name: "Thành"
        name: "Nguyễn Thành Luân"
        ...
  **/
  appendInfoToForm: function(response){
    var formSignUp = $(document).find("#sign_up_user");
    var middle_name = "";
    
    if(typeof response.middle_name == "undefined"){
      middle_name = response.last_name;
    }
    else{
      middle_name = response.middle_name + " " + response.last_name
    }

    formSignUp.find("#user_facebook_uid").val(response.id);
    formSignUp.find("#user_firstname").val(response.first_name);
    formSignUp.find("#user_lastname").val(middle_name);
    formSignUp.find("#user_email").val(response.email);

    ModalSignInUp.openModal(ModalSignInUp.modal_signup);
  },

  /* Event submit form by ajax */ 
  callbackSubmit: function(modal){
    var self = this;

    $(modal).find("form").bind("ajax:success", function(e, response, status, xhr){    
      if(response.success){      
        window.location.reload();        
      }else{        
        self.errorsFromServer(response.data, modal);
      }
    });
  }
}

var ModalSignInUp = {
  init: function(){
    var self = this;

    self.modal_signup = $("#signup_modal");
    self.modal_signin = $("#signin_modal");
    self.initModal();
    self.eventOpenModal(self.modal_signin);
  },

  initModal: function(){
    var self = this;

    $(self.modal_signup).on('show.bs.modal', function (e) {
      self.closeModal(self.modal_signin);
    });

    $(self.modal_signin).on('show.bs.modal', function (e) {
      self.closeModal(self.modal_signup);
    });
  },

  openModal: function(modal){
    $(modal).modal('show');    
  },

  closeModal: function(modal){
    $(modal).modal('hide');
  },

  eventOpenModal: function(modal){
    var self = this;
    $(document).delegate(".modal_signin", "click", function(){
      self.openModal(modal);
    });    
  }
}

$(document).ready(function(){  
  SignInUp.init();
  ModalSignInUp.init();
});