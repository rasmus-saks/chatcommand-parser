(function () {
  var Command = require("./command");
  var Argument = require("./argument");

  var argumentTypes = {
    word: arg(/.+?\b/),
    int: arg(/(\+|-)?\d+/),
    list: function (name) {
      return new Argument(name, new RegExp(Array.prototype.slice.call(arguments, 1).join("|")));
    },
    all: arg(/.+/)
  };

  function Parser(commands, prefix) {
    this._prefix = prefix || "!";
    this._commands = [];
    for (var cmd in commands) {
      if (!commands.hasOwnProperty(cmd)) continue;
      var args = commands[cmd];
      this.addCommand(cmd);
      for (var argName in args) {
        if (!args.hasOwnProperty(argName)) continue;
        var params = args[argName];
        var argtype = params[0];
        var required = true;
        if (argtype.indexOf("?") !== -1) {
          required = false;
          argtype = argtype.replace("?", "");
        }
        this[cmd]
          .addArgument(argumentTypes[argtype].apply(this, [argName].concat(params.slice(1))))
          .setRequired(required);
      }
    }
  }

  function arg(regex) {
    return function (name) {
      return new Argument(name, regex);
    }
  }

  Parser.prototype.addCommand = function (name) {
    var cmd = new Command(name, this._prefix);
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

  Parser.prototype.parse = function (text) {
    if (this._commands.length == 0) return null;
    for (var i = 0; i < this._commands.length; i++) {
      var cmd = this._commands[i];
      var m = cmd.parse(text.trim(), this._prefix);
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
    argument: argumentTypes
  };
})();