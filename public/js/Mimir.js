(function() {
  var Book, BookView, Books, BooksRouter, ReadingListView, StatsView, Subject, SubjectView, Subjects, SubjectsListView;
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
      this.belongsToSubject = __bind(this.belongsToSubject, this);
      Book.__super__.constructor.apply(this, arguments);
    }
    Book.prototype.idAttribute = "_id";
    Book.prototype.defaults = {
      subject: "Computer Science"
    };
    Book.prototype.bookStatus = {
      pending: "On Queue",
      reading: "Now Reading",
      read: "Read"
    };
    Book.prototype.initialize = function(attributes) {
      if (!attributes.status) {
        return this.set({
          status: this.bookStatus.pending
        });
      }
    };
    Book.prototype.reading = function() {
      return this.set({
        status: this.bookStatus.reading
      });
    };
    Book.prototype.read = function() {
      return this.set({
        status: this.bookStatus.read
      });
    };
    Book.prototype.belongsToSubject = function(description) {
      return this.get('subject') === description;
    };
    Book.prototype.hasStatus = function(status) {
      return this.get('status') === this.bookStatus[status];
    };
    return Book;
  })();
  window.Subject = Subject = (function() {
    __extends(Subject, Backbone.Model);
    function Subject() {
      Subject.__super__.constructor.apply(this, arguments);
    }
    return Subject;
  })();
  window.Books = Books = (function() {
    __extends(Books, Backbone.Collection);
    function Books() {
      Books.__super__.constructor.apply(this, arguments);
    }
    Books.prototype.model = Book;
    Books.prototype.url = "/books";
    Books.prototype.initialize = function() {
      this.bind("change:status", this.sort);
      this.bind("change:status", this.saveBook);
      return this.bind("add", this.saveBook);
    };
    Books.prototype.withStatus = function(status) {
      return this.filter(function(book) {
        return book.hasStatus(status);
      });
    };
    Books.prototype.comparator = function(book) {
      return book.get("status");
    };
    Books.prototype.saveBook = function(book) {
      return book.save({
        success: function(b, response) {
          return b.id = 1;
        }
      });
    };
    return Books;
  })();
  window.readings = new Books();
  window.Subjects = Subjects = (function() {
    __extends(Subjects, Backbone.Collection);
    function Subjects() {
      this.addSubject = __bind(this.addSubject, this);
      this.findByDescription = __bind(this.findByDescription, this);
      this.findOrCreate = __bind(this.findOrCreate, this);
      Subjects.__super__.constructor.apply(this, arguments);
    }
    Subjects.prototype.model = Subject;
    Subjects.prototype.url = "/subjects";
    Subjects.prototype.findOrCreate = function(description) {
      if (description === "") {
        return null;
      }
      return this.findByDescription(description) || this.addSubject(description);
    };
    Subjects.prototype.findByDescription = function(description) {
      return this.find(function(sub) {
        return sub.get("description") === description;
      });
    };
    Subjects.prototype.addSubject = function(description) {
      var subject;
      subject = new Subject({
        description: description
      });
      this.add(subject);
      return subject;
    };
    return Subjects;
  })();
  window.subjects = new Subjects;
  window.BookView = BookView = (function() {
    __extends(BookView, Backbone.View);
    function BookView() {
      this.removeBook = __bind(this.removeBook, this);
      this.show = __bind(this.show, this);
      this.bookRead = __bind(this.bookRead, this);
      this.bookReading = __bind(this.bookReading, this);
      this.removeItem = __bind(this.removeItem, this);
      this.render = __bind(this.render, this);
      BookView.__super__.constructor.apply(this, arguments);
    }
    BookView.prototype.tagName = "li";
    BookView.prototype.className = "book";
    BookView.prototype.events = {
      "click button[data-action='remove']": "removeItem",
      "click button[data-action='reading']": "bookReading",
      "click button[data-action='read']": "bookRead"
    };
    BookView.prototype.initialize = function() {
      this.template = _.template($("#book-template").html());
      this.model.bind("change", this.render);
      this.model.bind("destroy", this.removeBook);
      return this.model.bind("filter", this.show);
    };
    BookView.prototype.render = function() {
      var rendered;
      rendered = this.template(this.model.toJSON());
      $(this.el).html(rendered);
      return this;
    };
    BookView.prototype.removeItem = function() {
      console.log('Model');
      return this.model.destroy();
    };
    BookView.prototype.bookReading = function() {
      return this.model.reading();
    };
    BookView.prototype.bookRead = function() {
      return this.model.read();
    };
    BookView.prototype.show = function() {
      return $(this.el).show();
    };
    BookView.prototype.removeBook = function() {
      return $(this.el).remove();
    };
    return BookView;
  })();
  window.SubjectView = SubjectView = (function() {
    __extends(SubjectView, Backbone.View);
    function SubjectView() {
      this.filterEvent = __bind(this.filterEvent, this);
      this.render = __bind(this.render, this);
      this.initialize = __bind(this.initialize, this);
      SubjectView.__super__.constructor.apply(this, arguments);
    }
    SubjectView.prototype.tagName = "li";
    SubjectView.prototype.className = "subject";
    SubjectView.prototype.events = {
      "click span": "filterEvent"
    };
    SubjectView.prototype.initialize = function() {
      this.template = _.template($("#subject-template").html());
      return this.model.bind("change", this.render);
    };
    SubjectView.prototype.render = function() {
      var rendered;
      rendered = this.template(this.model.toJSON());
      $(this.el).html(rendered);
      return this;
    };
    SubjectView.prototype.filterEvent = function() {
      return this.model.collection.trigger("filter", this.model.get('description'));
    };
    return SubjectView;
  })();
  window.ReadingListView = ReadingListView = (function() {
    __extends(ReadingListView, Backbone.View);
    function ReadingListView() {
      this.filterReadings = __bind(this.filterReadings, this);
      this.addBook = __bind(this.addBook, this);
      this.openAddBook = __bind(this.openAddBook, this);
      this.render = __bind(this.render, this);
      ReadingListView.__super__.constructor.apply(this, arguments);
    }
    ReadingListView.prototype.tagName = "section";
    ReadingListView.prototype.className = "reading-list";
    ReadingListView.prototype.events = {
      "click #add-book": "addBook",
      "click #open-add-book": "openAddBook"
    };
    ReadingListView.prototype.initialize = function() {
      this.subjects = this.options.subjects;
      this.template = _.template($("#reading-list-template").html());
      this.collection.bind("reset", this.render);
      this.collection.bind("add", this.render);
      return this.subjects.bind("filter", this.filterReadings);
    };
    ReadingListView.prototype.render = function() {
      $(this.el).html(this.template({}));
      this.collection.each(function(book) {
        var view;
        view = new BookView({
          model: book,
          collection: this.collection
        });
        return this.$('.readings').append(view.render().el);
      });
      return this;
    };
    ReadingListView.prototype.openAddBook = function() {
      return this.$("#book-form").toggle("fast");
    };
    ReadingListView.prototype.addBook = function() {
      var book, subject;
      subject = subjects.findOrCreate($("#subject").val());
      book = new Book({
        title: $("#book-title").val(),
        subject: $("#subject").val()
      });
      this.collection.add(book);
      return this.$("#book-form").hide("fast");
    };
    ReadingListView.prototype.filterReadings = function(subject) {
      if (subject === "all") {
        return this.$('li').show();
      } else {
        this.$('li').hide();
        return this.collection.filter(function(model) {
          if (model.belongsToSubject(subject)) {
            return model.trigger('filter');
          }
        });
      }
    };
    return ReadingListView;
  })();
  window.SubjectsListView = SubjectsListView = (function() {
    __extends(SubjectsListView, Backbone.View);
    function SubjectsListView() {
      this.filterNone = __bind(this.filterNone, this);
      this.render = __bind(this.render, this);
      this.initialize = __bind(this.initialize, this);
      SubjectsListView.__super__.constructor.apply(this, arguments);
    }
    SubjectsListView.prototype.tagName = "section";
    SubjectsListView.prototype.className = "subjects-list";
    SubjectsListView.prototype.events = {
      "click #all": "filterNone"
    };
    SubjectsListView.prototype.initialize = function() {
      this.template = _.template($("#subject-list-template").html());
      this.collection.bind("reset", this.render);
      return this.collection.bind("add", this.render);
    };
    SubjectsListView.prototype.render = function() {
      $(this.el).html(this.template({}));
      this.collection.each(function(subject) {
        var view;
        view = new SubjectView({
          model: subject,
          collection: this.collection
        });
        return this.$('.subjects').append(view.render().el);
      });
      return this;
    };
    SubjectsListView.prototype.filterNone = function() {
      return this.collection.trigger("filter", "all");
    };
    return SubjectsListView;
  })();
  window.StatsView = StatsView = (function() {
    __extends(StatsView, Backbone.View);
    function StatsView() {
      this.stats = __bind(this.stats, this);
      this.render = __bind(this.render, this);
      this.initialize = __bind(this.initialize, this);
      StatsView.__super__.constructor.apply(this, arguments);
    }
    StatsView.prototype.tagName = "section";
    StatsView.prototype.className = "stats-list";
    StatsView.prototype.initialize = function() {
      this.template = _.template($("#stats").html());
      return this.collection.bind("all", this.render);
    };
    StatsView.prototype.render = function() {
      $(this.el).html(this.template(this.stats()));
      return this;
    };
    StatsView.prototype.stats = function() {
      return {
        pending: this.collection.withStatus('pending').length,
        reading: this.collection.withStatus('reading').length,
        read: this.collection.withStatus('read').length
      };
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
      this.view = new ReadingListView({
        collection: window.readings,
        subjects: window.subjects
      });
      this.stats = new StatsView({
        collection: window.readings
      });
      return this.subjects = new SubjectsListView({
        collection: window.subjects
      });
    };
    BooksRouter.prototype.home = function() {
      $("#container").html(this.view.render().el);
      $("#container").append(this.stats.render().el);
      return $("#container").append(this.subjects.render().el);
    };
    return BooksRouter;
  })();
}).call(this);
