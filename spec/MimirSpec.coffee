booksData = [
  { title: "Refactoring", status: "On Queue" },
  { title: "Pragmatic Programmer", status: "Now Reading" },
  { title: "Eloquent Ruby", status: "Read" },
]

describe "Book", ->
  beforeEach ->
    @book = new Book

  it "initialize with an On Queue status", ->
    expect(@book.get('status')).toEqual("On Queue") 

  describe "reading", ->
    it "change status to Now Reading", ->
      @book.reading()
      expect(@book.get('status')).toEqual("Now Reading") 

  describe "read", ->
    it "change status to Read", ->
      @book.read()
      expect(@book.get('status')).toEqual("Read") 

  describe "belongsToSubject", ->
    it "returns true when book has an subject with the recieved description", ->
      sub = new Subject(description: "OO")
      @book = new Book(subject: sub)
      expect(@book.belongsToSubject("OO")).toBeTruthy()

    it "returns false otherwise", ->
      expect(@book.belongsToSubject("Crazy Stuff")).toBeFalsy()

  describe "hasStatus", ->
    it "returns true when book has that status", ->
      @book.reading()
      expect(@book.hasStatus('reading')).toBeTruthy()

    it "returns false otherwise", ->
      expect(@book.hasStatus('blargh')).toBeFalsy()


describe "Books", ->
  beforeEach ->
    @books = new Books(booksData)

  describe "withStatus", ->
    it "filter books by status", ->
      expect(@books.withStatus('reading').length).toEqual(1)

describe "Subjects", ->
  beforeEach ->
    @subjects = new Subjects

  describe "addSubject", ->
    it "adds a subject", ->
      @subjects.addSubject("Agile")
      expect(@subjects.models.length).toEqual(1)

  describe "findByDescription", ->
    it "locates a subject by description", ->
      sub = new Subject(description: "Agile")
      @subjects.add(sub)
      expect(@subjects.findByDescription('Agile')).toBe(sub)

  describe "findOrCreate", ->
    it "returns a subject when there is one with the recieved description", ->
      @subjects.addSubject("Agile")
      expect(@subjects.findOrCreate("Agile")).toBeTruthy()
      expect(@subjects.models.length).toEqual(1)

    it "creates a subject when there is none with the recieved description", ->
      expect(@subjects.findOrCreate("Agile")).toBeTruthy()
      expect(@subjects.models.length).toEqual(1)

    it "do not duplicate subjects", ->
      @subjects.findOrCreate("Agile")
      @subjects.findOrCreate("Agile")
      @subjects.findOrCreate("Agile")
      expect(@subjects.models.length).toEqual(1)
