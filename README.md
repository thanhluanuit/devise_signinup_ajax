##Sign In/Up Users With Ajax Using Devise - Sign In/Up by Connect to Facebook

####This application requires:

  - Ruby 2.1.2
  - Rails 4.1.4
  - Bootstrap 3.0+
  - jQuery Validation 1.13.1

####Usage

  1. Configure Devise To Accept JSON
    
    config/initializers/devise.rb:  
    ```ruby
    config.http_authenticatable_on_xhr = false  
    config.navigational_formats = ['*/*', :html, :json]
    ```
  2. Create Session Controller and Register Controller
    
    + app/controllers/sessions_controller.rb  
    + app/controllers/registrations_controller.rb 

  3. Add Devise Mappings To Your Application Helper
    
    app/helpers/application_helper.rb
    ```ruby
    module ApplicationHelper
      def resource
        @resource ||= User.new
      end

      def resource_name
        :user
      end
     
      def devise_mapping
        @devise_mapping ||= Devise.mappings[:user]
      end
    end
    ```
    
  4. Add sign in and sign up form to 2 modal (signin_modal & signup_modal)
    
    + app/views/devise/registrations/_signin_modal.html.haml  
    + app/views/devise/registrations/_signup_modal.html.haml  

  5. Config Routes
    
    config/routes.rb  
    ```ruby
    devise_for :users, :controllers => {registrations: 'registrations', sessions: 'sessions'}
    ```

  6.Add javaScripts when submit by ajax
    
    app/assets/javascripts/devise.js  
    ```javascript
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
    ```
    
  7.Validate form in client:
    
    + app/assets/javascripts/validates.js  
    + app/assets/javascripts/custom_validates.js  
    + app/assets/javascripts/devise.js => SignInUp.validator();  

  8. Connect to Facebook, get info and sign in/up
    
    app/assets/javascripts/connect_facebook.js
