var app      = require('koa')()
	, logger   = require('koa-logger')
	, router   = require('koa-router')
  , send     = require('koa-send')
  , ejs      = require('koa-ejs')
  , path     = require('path')
  , parse    = require('co-busboy-extend')
  , saveTo   = require('save-to')
  , fs       = require('fs');

var TemplateEngine = function(html, options) {
    var re = /<%([^%>]+)?%>/g, reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, code = 'var r=[];\n', cursor = 0;
    var add = function(line, js) {
        js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
            (code += line != '' ? 'r.push("' + line + '");\n' : '');
        return add;
    }
    while(match = re.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
    }
    add(html.substr(cursor, html.length - cursor));
    code += 'return r.join("");';
    return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
}

var ROOT = path.join(__dirname, '/wclz-theme');
var body = [];
app.use(logger());
app.use(router(app));

app.get('/', function * () {
	yield send(this, ROOT + '/index.html');
})
app.use(function * () {
	yield send(this, this.path, {
		root: ROOT
	});
})

app.post('/', function * () {
  var part, data = [], i=0;
  var parts = parse(this, {
    dest: path.join(ROOT, 'uploads'),
    onFileUploadData: function checkSize(file, fileStream, data) {
      if (file.size > 1820320) {
        return fileStream.resume();
      }
    }
  });
  
  while(part = yield parts) {
    data.push(part);
    i++;
  }
  while (i--) {
    if (data[i].size > 1820320) {
      data[i].unlink(data[i].path);
    } else {
      delete data[i].unlink
      delete data[i].path
      body.push(data[i]);
    }
  }
  this.status = 200
  this.body = yield TemplateEngine(fs.readFileSync(ROOT + '/finish.html'), {images: body});
});
app.listen(process.env.PORT || 5555);
console.log('Start listening on port ', process.env.PORT || 5555);

