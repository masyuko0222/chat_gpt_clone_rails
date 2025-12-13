Rails.application.routes.draw do
  get "registrations/new"
  get "registrations/create"
  resource :registration, only: [ :new, :create ]
  resource :session
  resources :passwords, param: :token
  get "chats/index"
  get "up" => "rails/health#show", as: :rails_health_check
  root "chats#index"
  resources :chats, only: [ :index, :create ]
end
