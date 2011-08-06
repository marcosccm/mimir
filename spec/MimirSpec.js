(function() {
  var booksData;
  booksData = [
    {
      title: "Refactoring",
      status: "On Queue"
    }, {
      title: "Pragmatic Programmer",
      status: "Now Reading"
    }, {
      title: "Eloquent Ruby",
      status: "Read"
    }
  ];
  describe("Book", function() {
    beforeEach(function() {
      return this.book = new Book;
    });
    it("initialize with an On Queue status", function() {
      return expect(this.book.get('status')).toEqual("On Queue");
    });
    describe("reading", function() {
      return it("change status to Now Reading", function() {
        this.book.reading();
        return expect(this.book.get('status')).toEqual("Now Reading");
      });
    });
    describe("read", function() {
      return it("change status to Read", function() {
        this.book.read();
        return expect(this.book.get('status')).toEqual("Read");
      });
    });
    describe("belongsToSubject", function() {
      it("returns true when book has an subject with the recieved description", function() {
        var sub;
        sub = new Subject({
          description: "OO"
        });
        this.book = new Book({
          subject: sub
        });
        return expect(this.book.belongsToSubject("OO")).toBeTruthy();
      });
      return it("returns false otherwise", function() {
        return expect(this.book.belongsToSubject("Crazy Stuff")).toBeFalsy();
      });
    });
    return describe("hasStatus", function() {
      it("returns true when book has that status", function() {
        this.book.reading();
        return expect(this.book.hasStatus('reading')).toBeTruthy();
      });
      return it("returns false otherwise", function() {
        return expect(this.book.hasStatus('blargh')).toBeFalsy();
      });
    });
  });
  describe("Books", function() {
    beforeEach(function() {
      return this.books = new Books(booksData);
    });
    return describe("withStatus", function() {
      return it("filter books by status", function() {
        return expect(this.books.withStatus('reading').length).toEqual(1);
      });
    });
  });
  describe("Subjects", function() {
    beforeEach(function() {
      return this.subjects = new Subjects;
    });
    describe("addSubject", function() {
      return it("adds a subject", function() {
        this.subjects.addSubject("Agile");
        return expect(this.subjects.models.length).toEqual(1);
      });
    });
    describe("findByDescription", function() {
      return it("locates a subject by description", function() {
        var sub;
        sub = new Subject({
          description: "Agile"
        });
        this.subjects.add(sub);
        return expect(this.subjects.findByDescription('Agile')).toBe(sub);
      });
    });
    return describe("findOrCreate", function() {
      it("returns a subject when there is one with the recieved description", function() {
        this.subjects.addSubject("Agile");
        expect(this.subjects.findOrCreate("Agile")).toBeTruthy();
        return expect(this.subjects.models.length).toEqual(1);
      });
      it("creates a subject when there is none with the recieved description", function() {
        expect(this.subjects.findOrCreate("Agile")).toBeTruthy();
        return expect(this.subjects.models.length).toEqual(1);
      });
      return it("do not duplicate subjects", function() {
        this.subjects.findOrCreate("Agile");
        this.subjects.findOrCreate("Agile");
        this.subjects.findOrCreate("Agile");
        return expect(this.subjects.models.length).toEqual(1);
      });
    });
  });
}).call(this);
