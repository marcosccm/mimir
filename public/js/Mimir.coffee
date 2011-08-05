window.Book = class Book extends Backbone.Model
  initialize: (attributes) ->
    @set(status: "On Queue")

  reading: ->
    @set(status: "Now Reading")

  read: ->
    @set(status: "Read")

  belongsToSubject: (description) =>
    @get('subject') && @get('subject').get('description') == description

  clear: =>
    @destroy()

window.Subject = class Subject extends Backbone.Model


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

window.Subjects =  class Subjects extends Backbone.Collection
  model: Subject
  url: "/subjects"

  findOrCreate: (description) =>
    return null if description == "" 
    return @findByDescription(description) || @addSubject(description)

  findByDescription: (description) => 
    @find (sub) -> sub.get("description") == description

  addSubject: (description) =>
    subject = new Subject(description: description) 
    @add(subject)
    subject

window.subjects = new Subjects

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
    @model.bind "filter", @show

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

  show: =>
    $(@el).show()

window.SubjectView = class SubjectView extends Backbone.View
  tagName: "li"
  className: "subjects"

  events:
    "click span" : "filterEvent"

  initialize: =>
    @template = _.template $("#subject-template").html()
    @model.bind "change", @render

  render: =>
    rendered = @template(@model.toJSON())
    $(@el).html(rendered)
    this

  filterEvent: =>
    @model.collection.trigger("filter", @model.get('description'))

window.ReadingList = class ReadingList extends Backbone.View
  tagName: "section"

  events:
    "click #add-book" : "addBook"

  initialize: =>
    @template = _.template $("#reading-list-template").html()
    @collection.bind "reset", @render
    @collection.bind "add", @render
    subjects.bind "filter", @filterReadings
   
  render: =>
    $(@el).html(@template({}))
    @collection.each (book) ->
      view = new BookView(model: book, collection:  @collection)
      @$('.reading-list').append(view.render().el)
    this

  addBook: =>
    subject = subjects.findOrCreate($("#subject").val())
    book = new Book(title: $("#book-title").val(), subject: subject)
    @collection.add(book)

  filterReadings: (subject) =>
    @$('li').hide()
    @collection.filter (model) -> 
      model.trigger('filter') if model.belongsToSubject(subject)

window.SubjectsList = class SubjectsList extends Backbone.View
  tagName: "section"

  initialize: =>
    @template = _.template $("#subject-list-template").html()
    @collection.bind "reset", @render
    @collection.bind "add", @render

  render: =>
    $(@el).html(@template({}))
    @collection.each (subject) ->
      view = new SubjectView(model: subject, collection:  @collection)
      @$('.subjects-list').append(view.render().el)
    this

  filterReadings: (description) =>
    readings.filterV
    alert(description)

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
    @subjects = new SubjectsList(collection: window.subjects)

  home:=>
    $("#container").html(@view.render().el)
    $("#container").append(@stats.render().el)
    $("#container").append(@subjects.render().el)

