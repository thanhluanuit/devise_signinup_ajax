Rails.application.routes.draw do  
  devise_for :users, :controllers => {registrations: 'registrations', sessions: 'sessions'}
end
