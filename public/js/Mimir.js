(function() {
  var Book, BookView, Books, BooksRouter, ReadingList, StatsView;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
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
      this.clear = __bind(this.clear, this);
      Book.__super__.constructor.apply(this, arguments);
    }
    Book.prototype.clear = function() {
      return this.destroy();
    };
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
      this.removeItem = __bind(this.removeItem, this);
      this.render = __bind(this.render, this);
      this.initialize = __bind(this.initialize, this);
      BookView.__super__.constructor.apply(this, arguments);
    }
    BookView.prototype.tagName = "li";
    BookView.prototype.className = "book";
    BookView.prototype.events = {
      "click button": "removeItem"
    };
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
    BookView.prototype.removeItem = function() {
      this.model.clear();
      return $(this.el).remove();
    };
    return BookView;
  })();
  window.ReadingList = ReadingList = (function() {
    __extends(ReadingList, Backbone.View);
    function ReadingList() {
      this.addBook = __bind(this.addBook, this);
      this.render = __bind(this.render, this);
      this.initialize = __bind(this.initialize, this);
      ReadingList.__super__.constructor.apply(this, arguments);
    }
    ReadingList.prototype.tagName = "section";
    ReadingList.prototype.events = {
      "blur #book-title": "addBook"
    };
    ReadingList.prototype.initialize = function() {
      this.template = _.template($("#reading-list-template").html());
      this.collection.bind("reset", this.render);
      return this.collection.bind("add", this.render);
    };
    ReadingList.prototype.render = function() {
      $(this.el).html(this.template({}));
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
    ReadingList.prototype.addBook = function() {
      var book;
      book = new Book({
        title: $("#book-title").val()
      });
      return this.collection.add(book);
    };
    return ReadingList;
  })();
  window.StatsView = StatsView = (function() {
    __extends(StatsView, Backbone.View);
    function StatsView() {
      this.render = __bind(this.render, this);
      this.initialize = __bind(this.initialize, this);
      StatsView.__super__.constructor.apply(this, arguments);
    }
    StatsView.prototype.tagName = "span";
    StatsView.prototype.initialize = function() {
      this.template = _.template($("#stats").html());
      return this.collection.bind("all", this.render);
    };
    StatsView.prototype.render = function() {
      $(this.el).html(this.template({
        total: this.collection.length
      }));
      return this;
    };
    return StatsView;
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
      this.view = new ReadingList({
        collection: window.readings
      });
      return this.stats = new StatsView({
        collection: window.readings
      });
    };
    BooksRouter.prototype.home = function() {
      $("#container").html(this.view.render().el);
      return $("#container").append(this.stats.render().el);
    };
    return BooksRouter;
  })();
}).call(this);
