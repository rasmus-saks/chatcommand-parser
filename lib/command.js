(function () {
  var Argument = require("./argument");

  function Command(name) {
    this._name = name;
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

  Command.prototype.parse = function (text, prefix) {
    if (text.indexOf(prefix + this._name) !== 0) return null;
    text = text.slice((prefix + this._name).length).trim();
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

  module.exports = Command;
})();