(function() {
  $(function() {
    window.readings.fetch();
    window.subjects.fetch();
    window.App = new BooksRouter;
    return Backbone.history.start({
      pushState: true
    });
  });
}).call(this);
