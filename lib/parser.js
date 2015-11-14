(function () {
  var Command = require("./command");
  var Argument = require("./argument");

  function Parser(prefix) {
    this._prefix = prefix || "!";
    this._commands = [];
  }

  function arg(regex) {
    return function (name) {
      return new Argument(name, regex);
    }
  }

  Parser.prototype.addCommand = function (name) {
    var cmd = new Command(name);
    this._commands.push(cmd);
    this[name] = cmd;
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < args.length; i++) {
      var arg = args[i];
      cmd.addArgument(arg);
    }
    return cmd;
  };

  Parser.prototype.removeCommand = function (name) {
    if (!this[name]) return;
    var cmd = this[name];
    delete this[name];
    var index = this._commands.indexOf(cmd);
    this._commands.splice(index, 1);
  };

  Parser.prototype.match = function (text) {
    if (this._commands.length == 0) return null;
    for (var i = 0; i < this._commands.length; i++) {
      var cmd = this._commands[i];
      var m = cmd.match(text.trim(), this._prefix);
      if (m) {
        return {
          command: cmd.getName(),
          args: m
        }
      }
    }
    return null;
  };

  module.exports = {
    Parser: Parser,
    argument: {
      word: arg(/.+?\b/),
      int: arg(/(\+|-)?\d+/),
      list: function (name) {
        return new Argument(name, new RegExp(Array.prototype.slice.call(arguments, 1).join("|")));
      },
      all: arg(/.+/)
    }
  };
})();