$ ->
  window.readings.fetch()
  window.subjects.fetch()
  window.App = new BooksRouter
  Backbone.history.start(pushState: true)
