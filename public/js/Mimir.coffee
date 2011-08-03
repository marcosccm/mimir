window.Book = class Book extends Backbone.Model

window.BookView = class BookView extends Backbone.View
  initialize: ->
    @template = _.template $("#book-template").html()

  render: ->
    rendered = @template(@model.toJSON())
    $(@el).html(rendered)
    this
   
