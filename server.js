var express = require('express');
var serveStatic = require('serve-static');

var app = express();

app.use(serveStatic('src', {'index': ['index.html']}));
app.listen(3000);
console.log('listening on http://localhost:3000');