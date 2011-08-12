require "rubygems"
require "json"
require "couch_potato"
require "sinatra"

CouchPotato::Config.database_name = 'mimir'

class Mimir < Sinatra::Base
  get "/" do
    File.readlines("public/index.html")
  end

  get "/books" do
    CouchPotato.database.view(Book.all).to_json
  end

  post "/books" do
    data = JSON.parse(request.body.read)
    book = Book.new(data)
    CouchPotato.database.save_document book
  end

  put "/books/:id" do
    book = JSON.parse(request.body.read)
    CouchPotato.database.save_document book
  end

  delete "/books/:id" do
    book = CouchPotato.database.load(params[:id])
    CouchPotato.database.destroy_document book
  end
end

class Book 
  include CouchPotato::Persistence

  property :title
  property :status
  property :subject
  view :all, :key => :title
end
