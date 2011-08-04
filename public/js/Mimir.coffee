window.Book = class Book extends Backbone.Model

window.Books = class Books extends Backbone.Collection
  model: Book
  url: "/books"

window.readings = new Books()

window.BookView = class BookView extends Backbone.View
  tagName: "li"
  className: "book"

  initialize: =>
    @template = _.template $("#book-template").html()
    @model.bind "change", @render

  render: =>
    rendered = @template(@model.toJSON())
    $(@el).html(rendered)
    this

window.ReadingList = class ReadingList extends Backbone.View
  initialize: =>
    @template = _.template $("#reading-list-template").html()
    @collection.bind "reset", @render

  render: =>
    $(@el).html(@template())
    @collection.each (book) ->
      view = new BookView(model: book, collection:  @collection)
      @$('.reading-list').append(view.render().el)
    this

window.BooksRouter = class BooksRouter extends Backbone.Router
  routes:
    '' : 'home'

  initialize: =>
    @view = new ReadingList(collection: window.readings)

  home:=>
    $("#container").html(@view.render().el)

