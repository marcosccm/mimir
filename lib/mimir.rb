require "json"
require "sinatra"

class Mimir < Sinatra::Base
  get "/" do
    File.readlines("public/index.html")
  end

  get "/books" do
   [
      { :title => "Refactoring" },
      { :title => "The Pragmatic Programmer" },
      { :title => "Eloquent Ruby" }
   ].to_json 
  end
end
