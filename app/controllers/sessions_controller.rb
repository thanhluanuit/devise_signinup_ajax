class SessionsController < Devise::SessionsController
  respond_to :json
  
  def create
    session['user_auth'] = params[:user]    
    resource = warden.authenticate!(:scope => resource_name, :recall => "#{controller_path}#failure")
    set_flash_message(:notice, :signed_in) if is_flashing_format?
    sign_in(resource_name, resource)
    message = I18n.t 'devise.sessions.signed_in'
    flash[:notice] = message
    
    yield resource if block_given?
    
    if request.xhr?
     return render :json => {:success => true, :login => true, :data =>  {:message => message}} 
    else
      respond_with resource, location: after_sign_in_path_for(resource)
    end
  end

  def failure
    user = User.where(email: session['user_auth'][:email]).first rescue nil
    message = I18n.t 'devise.failure.invalid', authentication_keys: "email"
    
    if !user || user.active_for_authentication?
      flash[:error] = message unless request.xhr?
    else
      flash[:error] = user.inactive_message unless request.xhr?
      message = user.inactive_message    
    end
    respond_to do |format|
      format.json {render :json => {:success => false, :data => {:message => message, :cause => 'invalid'} } }
      format.html {redirect_to '/users/sign_in'}
    end
  end
end