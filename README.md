# Chatcommand Parser
A package to parse commands in text chats (IRC, Slack, ...)

# Installation
```
npm install chatcommand-parser
```

# Usage
## Creating commands
```javascript
var parser = require("chatcommand-parser");

var p = new parser.Parser("!"); //You can optionally pass a prefix string to prefix every command with, defaults to "!"
p.addCommand("test");
p.addCommand("test2");
p.addCommand("test3");

//Add arguments
p["test2"].addArgument(parser.argument.int("integer"));
p["test2"].addArgument("testarg"); // Defaults to the 'word' type argument - gets everything up to a space

p["test3"].addArgument(parser.argument.list("lst", "one", "two", "three");
p["test3"].addArgument(parser.argument.all("all")).setRequired(false);

//Reference the arguments with p["test3"]["lst"] for example
```
## Parsing commands
```javascript
var parsed = p.parse(text);
if (!parsed) return; //Returns null if no matching command found
if (parsed.command == "test") { //If, for example, text == "!test"
  //Matched the 'test' command
}
if (parsed.command == "test2") { //text == "!test2 2 test"
  //Get the argument values
  console.log(parsed.args.integer); //Prints '2'
  console.log(parsed.args.testarg); //Prints 'test'
}
```