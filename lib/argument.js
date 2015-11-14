(function () {
  function Argument(name, regex) {
    this._name = name;
    this._regex = regex || /.+?\b/;
    this._required = true;
  }

  Argument.prototype.match = function (text) {
    var res = this._regex.exec(text);
    if (!res) return null;
    return res[0];
  };

  Argument.prototype.setRequired = function(required) {
    this._required = required;
    return this;
  };

  Argument.prototype.isRequired = function() {
    return this._required;
  };

  Argument.prototype.getName = function () {
    return this._name;
  };

  module.exports = Argument;
})();