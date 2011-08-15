window.Book = class Book extends Backbone.Model
  defaults:
    subject: "Computer Science"

  bookStatus:
    pending:  "On Queue"
    reading: "Now Reading"
    read:    "Read"

  initialize: (attributes) ->
    @id = attributes["_id"]
    @set(status: @bookStatus.pending) unless attributes.status

  reading: ->
    @set(status: @bookStatus.reading)

  read: ->
    @set(status: @bookStatus.read)

  belongsToSubject: (description) =>
    @get('subject') == description

  hasStatus: (status)->
    @get('status') == @bookStatus[status]

window.Subject = class Subject extends Backbone.Model

window.Books = class Books extends Backbone.Collection
  model: Book
  url: "/books"

  initialize: =>
    @bind("change:status", @sort)

  withStatus: (status) ->
    @filter (book) -> book.hasStatus(status)
 
  comparator: (book) ->
    book.get("status")


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
    @model.bind "change", @saveModel
    @model.bind "remove", @destroy
    @model.bind "filter", @show

  render: =>
    rendered = @template(@model.toJSON())
    $(@el).html(rendered)
    this

  removeItem: =>
    @model.destroy()

  bookReading: =>
    @model.reading()

  bookRead: =>
    @model.read()

  saveModel: =>
    @model.save()

  show: =>
    $(@el).show()

window.SubjectView = class SubjectView extends Backbone.View
  tagName: "li"
  className: "subject"

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

window.ReadingListView = class ReadingListView extends Backbone.View
  tagName: "section"
  className: "reading-list"

  events:
    "click #add-book" : "addBook"
    "click #open-add-book" : "openAddBook"

  initialize: =>
    @subjects = @options.subjects
    @template = _.template $("#reading-list-template").html()
    @collection.bind "reset", @render
    @collection.bind "add", @render
    @subjects.bind "filter", @filterReadings
   
  render: =>
    $(@el).html(@template({}))
    @collection.each (book) ->
      view = new BookView(model: book, collection:  @collection)
      @$('.readings').append(view.render().el)
    this

  openAddBook: =>
    @$("#book-form").toggle("fast")

  addBook: =>
    subject = subjects.findOrCreate($("#subject").val())
    book = new Book(title: $("#book-title").val(), subject: $("#subject").val())
    @collection.add(book)
    book.save()
    @openAddBook()

  filterReadings: (subject) =>
    if subject == "all" 
      @$('li').show()
    else
      @$('li').hide()
      @collection.filter (model) -> 
       model.trigger('filter') if model.belongsToSubject(subject)


window.SubjectsListView = class SubjectsListView extends Backbone.View
  tagName: "section"
  className: "subjects-list"

  events:
    "click #all" : "filterNone"

  initialize: =>
    @template = _.template $("#subject-list-template").html()
    @collection.bind "reset", @render
    @collection.bind "add", @render

  render: =>
    $(@el).html(@template({}))
    @collection.each (subject) ->
      view = new SubjectView(model: subject, collection:  @collection)
      @$('.subjects').append(view.render().el)
    this

  filterNone: =>
    @collection.trigger("filter","all")

window.StatsView = class StatsView extends Backbone.View
  tagName: "section"
  className: "stats-list"

  initialize: =>
    @template = _.template $("#stats").html()
    @collection.bind "all", @render

  render: =>
    $(@el).html(@template(@stats()))
    this

  stats: =>
    {
      pending: @collection.withStatus('pending').length
      reading: @collection.withStatus('reading').length
      read: @collection.withStatus('read').length
    }

window.BooksRouter = class BooksRouter extends Backbone.Router
  routes:
    '' : 'home'

  initialize: =>
    @view = new ReadingListView(collection: window.readings, subjects: window.subjects)
    @stats = new StatsView(collection: window.readings)
    @subjects = new SubjectsListView(collection: window.subjects)

  home:=>
    $("#container").html(@view.render().el)
    $("#container").append(@stats.render().el)
    $("#container").append(@subjects.render().el)
