var chai = require("chai");
var parser = require("../lib/parser");
var expect = chai.expect;

describe('Parser', function () {
  var p = new parser.Parser();
  p.addCommand("test");
  it("should match commands without arguments", function () {
    var p = new parser.Parser();
    p.addCommand("test");
    expect(p.match("!test")).to.deep.equal({command: "test", args: {}});
  });
  it("should match commands with one argument", function() {
    var p = new parser.Parser();
    p.addCommand("test").addArgument(parser.argument.word("word"));
    expect(p.match("!test")).to.be.null;
    expect(p.match("!test hello")).to.deep.equal({command: "test", args: {word: "hello"}})
  });
  it("should match commands with multiple arguments", function() {
    var p = new parser.Parser();
    p.addCommand("test");
    p["test"].addArgument(parser.argument.word("word"));
    p["test"].addArgument(parser.argument.int("int"));
    p["test"].addArgument(parser.argument.list("list", "one", "two", "three"));
    p["test"].addArgument(parser.argument.all("all"));
    expect(p.match("!test hello 2")).to.be.null;
    expect(p.match("!test hello 2 one")).to.be.null;
    expect(p.match("!test hello 2 one everything else")).to.deep.equal({
      command: "test",
      args: {
        word: "hello",
        int: "2",
        list: "one",
        all: "everything else"
      }
    });
  });
  it("should not match omitted optional arguments", function() {
    var p = new parser.Parser();
    p.addCommand("test");
    p["test"].addArgument(parser.argument.int("int")).setRequired(false);
    p["test"].addArgument(parser.argument.word("word")).setRequired(false);
    expect(p.match("!test hello")).to.deep.equal({
      command: "test",
      args: {
        word: "hello",
        int: null
      }
    });
    expect(p.match("!test")).to.deep.equal({
      command: "test",
      args: {
        word: null,
        int: null
      }
    });
    expect(p.match("!test 10")).to.deep.equal({
      command: "test",
      args: {
        word: null,
        int: "10"
      }
    });
  });
});