(function() {
  var Book, BookView;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Book = Book = (function() {
    __extends(Book, Backbone.Model);
    function Book() {
      Book.__super__.constructor.apply(this, arguments);
    }
    return Book;
  })();
  window.BookView = BookView = (function() {
    __extends(BookView, Backbone.View);
    function BookView() {
      BookView.__super__.constructor.apply(this, arguments);
    }
    BookView.prototype.initialize = function() {
      return this.template = _.template($("#book-template").html());
    };
    BookView.prototype.render = function() {
      var rendered;
      rendered = this.template(this.model.toJSON());
      $(this.el).html(rendered);
      return this;
    };
    return BookView;
  })();
}).call(this);
