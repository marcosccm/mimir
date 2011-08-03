require "sinatra"

class Mimir < Sinatra::Base
  get "/" do
    "Hello World"
  end
end
