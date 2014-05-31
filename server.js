var app = require('koa')(),
logger 	 = require('koa-logger'),
router   = require('koa-router'),
send     = require('koa-send'),
ejs      = require('koa-ejs')
path     = require('path')
parse    = require('co-busboy-extend')
saveTo   = require('save-to')
fs       = require('fs');

var ROOT = path.join(__dirname, '/wclz-theme');


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
  var part, data = [], body = [], i = 0;
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
  this.body = JSON.stringify(body, null, 2);
});

app.listen(process.env.PORT || 5555);
console.log('Start listening on port ', process.env.PORT || 5555);

