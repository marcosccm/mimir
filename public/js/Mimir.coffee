window.Book = class Book extends Backbone.Model
  initialize: ->
    @set(status: "On Queue")

  reading: ->
    @set(status: "Now Reading")

  read: ->
    @set(status: "Read")

  clear: =>
    @destroy()

window.Books = class Books extends Backbone.Collection
  model: Book
  url: "/books"

  pending: ->
    @filter (book) -> book.get("status") == "On Queue"

  reading: ->
    @filter (book) -> book.get("status") == "Now Reading"

  read: ->
    @filter (book) -> book.get("status") == "Read"

window.readings = new Books()

window.BookView = class BookView extends Backbone.View
  tagName: "li"
  className: "book"

  events:
    "click button[data-action='remove']" : "removeItem"
    "click button[data-action='reading']" : "bookReading"
    "click button[data-action='read']" : "bookRead"

  initialize: =>
    @template = _.template $("#book-template").html()
    @model.bind "change", @render

  render: =>
    rendered = @template(@model.toJSON())
    $(@el).html(rendered)
    this

  removeItem: =>
    @model.clear()
    $(@el).remove()

  bookReading: =>
    @model.reading()

  bookRead: =>
    @model.read()

window.ReadingList = class ReadingList extends Backbone.View
  tagName: "section"

  events:
    "blur #book-title" : "addBook"

  initialize: =>
    @template = _.template $("#reading-list-template").html()
    @collection.bind "reset", @render
    @collection.bind "add", @render
   
  render: =>
    $(@el).html(@template({}))
    @collection.each (book) ->
      view = new BookView(model: book, collection:  @collection)
      @$('.reading-list').append(view.render().el)
    this

  addBook: =>
    book = new Book(title: $("#book-title").val())
    @collection.add(book)

window.StatsView = class StatsView extends Backbone.View
  tagName: "span"

  initialize: =>
    @template = _.template $("#stats").html()
    @collection.bind "all", @render

  render: =>
    $(@el).html(@template(@stats()))
    this

  stats: =>
    {
      pending: @collection.pending().length
      reading: @collection.reading().length
      read: @collection.read().length
    }
    

window.BooksRouter = class BooksRouter extends Backbone.Router
  routes:
    '' : 'home'

  initialize: =>
    @view = new ReadingList(collection: window.readings)
    @stats = new StatsView(collection: window.readings)

  home:=>
    $("#container").html(@view.render().el)
    $("#container").append(@stats.render().el)

