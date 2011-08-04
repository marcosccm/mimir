(function() {
  var Book, BookView, Books, BooksRouter, ReadingList;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  window.Book = Book = (function() {
    __extends(Book, Backbone.Model);
    function Book() {
      Book.__super__.constructor.apply(this, arguments);
    }
    return Book;
  })();
  window.Books = Books = (function() {
    __extends(Books, Backbone.Collection);
    function Books() {
      Books.__super__.constructor.apply(this, arguments);
    }
    Books.prototype.model = Book;
    Books.prototype.url = "/books";
    return Books;
  })();
  window.readings = new Books();
  window.BookView = BookView = (function() {
    __extends(BookView, Backbone.View);
    function BookView() {
      this.render = __bind(this.render, this);
      this.initialize = __bind(this.initialize, this);
      BookView.__super__.constructor.apply(this, arguments);
    }
    BookView.prototype.tagName = "li";
    BookView.prototype.className = "book";
    BookView.prototype.initialize = function() {
      this.template = _.template($("#book-template").html());
      return this.model.bind("change", this.render);
    };
    BookView.prototype.render = function() {
      var rendered;
      rendered = this.template(this.model.toJSON());
      $(this.el).html(rendered);
      return this;
    };
    return BookView;
  })();
  window.ReadingList = ReadingList = (function() {
    __extends(ReadingList, Backbone.View);
    function ReadingList() {
      this.render = __bind(this.render, this);
      this.initialize = __bind(this.initialize, this);
      ReadingList.__super__.constructor.apply(this, arguments);
    }
    ReadingList.prototype.initialize = function() {
      this.template = _.template($("#reading-list-template").html());
      return this.collection.bind("reset", this.render);
    };
    ReadingList.prototype.render = function() {
      $(this.el).html(this.template());
      this.collection.each(function(book) {
        var view;
        view = new BookView({
          model: book,
          collection: this.collection
        });
        return this.$('.reading-list').append(view.render().el);
      });
      return this;
    };
    return ReadingList;
  })();
  window.BooksRouter = BooksRouter = (function() {
    __extends(BooksRouter, Backbone.Router);
    function BooksRouter() {
      this.home = __bind(this.home, this);
      this.initialize = __bind(this.initialize, this);
      BooksRouter.__super__.constructor.apply(this, arguments);
    }
    BooksRouter.prototype.routes = {
      '': 'home'
    };
    BooksRouter.prototype.initialize = function() {
      return this.view = new ReadingList({
        collection: window.readings
      });
    };
    BooksRouter.prototype.home = function() {
      return $("#container").html(this.view.render().el);
    };
    return BooksRouter;
  })();
}).call(this);
