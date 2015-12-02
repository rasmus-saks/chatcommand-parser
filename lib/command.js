(function () {
  var Argument = require("./argument");

  function Command(name, prefix) {
    this._name = name;
    this._prefix = prefix;
    this._arguments = [];
  }

  Command.prototype.addArgument = function (argument) {
    var arg = typeof argument === 'string' ? new Argument(argument) : argument;
    this._arguments.push(arg);
    this[arg.getName()] = arg;
    return arg;
  };

  Command.prototype.removeArgument = function (name) {
    if (!this[name]) return;
    var arg = this[name];
    delete this[name];
    var index = this._arguments.indexOf(arg);
    this._arguments.splice(index, 1);
  };

  Command.prototype.getName = function () {
    return this._name;
  };

  Command.prototype.parse = function (text) {
    if (text.indexOf(this._prefix + this._name) !== 0) return null;
    text = text.slice((this._prefix + this._name).length).trim();
    var argvalues = {};
    for (var i = 0; i < this._arguments.length; i++) {
      var arg = this._arguments[i];
      var m = arg.parse(text);
      if (!m && arg.isRequired()) {
        return null;
      }
      if (m) {
        text = text.slice(m.length).trim();
      }
      argvalues[arg.getName()] = m;
    }
    return argvalues;
  };

  Command.prototype.getUsage = function () {
    var usage = this._prefix + this._name;
    var args = [];
    for (var i = 0; i < this._arguments.length; i++) {
      var arg = this._arguments[i];
      if (arg.isRequired()) {
        args.push("[" + arg.getName() + "]");
      } else {
        args.push("(" + arg.getName() + ")");
      }
    }
    if (args.length > 0)
      usage += " " + args.join(" ");
    return usage;
  };

  module.exports = Command;
})();