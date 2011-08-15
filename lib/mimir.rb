require "rubygems"
require "json"
require "couch_potato"
require "sinatra"

CouchPotato::Config.database_name = 'mimir'
DB = CouchPotato.database

class Mimir < Sinatra::Base
  get "/" do
    File.readlines("public/index.html")
  end

  get "/books" do
    DB.view(Book.all).to_json
  end

  get "/subjects" do
    DB.view(Book.all).map { |x| { "description" => x.subject} }.compact.to_json
  end

  post "/books" do
    data = JSON.parse(request.body.read)
    book = Book.new(data)
    DB.save_document book
  end

  put "/books/:id" do
    data = JSON.parse(request.body.read) 
    book = DB.load(data.id)
    book.status = data.status
    DB.save_document! book
  end

  delete "/books/:id" do
    book = DB.load(params[:id])
    DB.destroy_document book
  end
end

class Book 
  include CouchPotato::Persistence

  property :title
  property :status
  property :subject
  view :all, :key => :title
end
