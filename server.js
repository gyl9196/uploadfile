var express = require('express');
var multer = require('multer');
var app = express();

//add the file management
app.use("/",express.static(__dirname + "/"));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })

app.get("/form", function(req, res, next){
    var form = fs.readFileSync('./form.html', {encoding:'utf-8'});
    res.send(form);
})

app.post('/upload', upload.single('pic'), function(req, res, next){
    var file = req.file;
    
});