window.Book = class Book extends Backbone.Model
  clear: =>
    @destroy()

window.Books = class Books extends Backbone.Collection
  model: Book
  url: "/books"

window.readings = new Books()

window.BookView = class BookView extends Backbone.View
  tagName: "li"
  className: "book"

  events:
    "click button" : "removeItem"

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

window.ReadingList = class ReadingList extends Backbone.View
  tagName: "section"

  events:
    "blur #book-title" : "addBook"

  initialize: =>
    @template = _.template $("#reading-list-template").html()
    @statsTemplate = _.template $("#stats").html()
    @collection.bind "reset", @render
    @collection.bind "add", @render
    @collection.bind "all", @renderStats
   
  render: =>
    $(@el).html(@template({}))
    @collection.each (book) ->
      view = new BookView(model: book, collection:  @collection)
      @$('.reading-list').append(view.render().el)
    this

  renderStats: =>
    @$('#book-stats').html(@statsTemplate(total: @collection.length))

  addBook: =>
    book = new Book(title: $("#book-title").val())
    @collection.add(book)

window.BooksRouter = class BooksRouter extends Backbone.Router
  routes:
    '' : 'home'

  initialize: =>
    @view = new ReadingList(collection: window.readings)

  home:=>
    $("#container").html(@view.render().el)

