Rails.application.routes.draw do
  get "registrations/new"
  get "registrations/create"
  resource :registration, only: [ :new, :create ]
  resource :session
  resources :passwords, param: :token
  root "chats#index"
  resources :chats, only: [ :index, :create, :show ], param: :uuid
end
