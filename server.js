var express = require('express');
var multer = require('multer');
var fs = require('fs');
var AdmZip = require('adm-zip');
var app = express();

//add the file management
app.use("/",express.static(__dirname + "/"));

//create the folder and upload files
var createFolder = function(folder){
    try{
        fs.accessSync(folder); 
    }catch(e){
        fs.mkdirSync(folder);
    }  
};
var uploadFolder = './uploads/';
createFolder(uploadFolder);
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })

//router info
app.get("/form", function(req, res, next){
    var form = fs.readFileSync('./form.html', {encoding:'utf-8'});
    res.send(form);
})

app.post('/upload', upload.single('pic'), function(req, res, next){
    var file = req.file; 
    console.log(file.originalname);
    if(file.mimetype=="application/zip"){ 
        var zip = new AdmZip("./uploads/"+file.originalname);
        var zipEntries = zip.getEntries();
        var array =[];
        zipEntries.forEach(function(zipEntry) {
            if (zipEntry.entryName.toString() == zipEntry.name.toString()) {
                array.push("http://localhost:3000/uploads/unzip/"+zipEntry.name.toString());//Add zip folder under the uploads
            }
        });
        zip.extractAllTo("./uploads/unzip/");      
        for(i=0;i<array.length;i++){
            res.write("<p><a href=\""+array[i]+"\">"+array[i]+"</a></p>");
        }  
       res.end("thanks zip file");
    }else{
        
        var httpath = "http://localhost:3000/"+file.path;
        res.write("<p><a href=\""+httpath+"\">"+httpath+"</a></p>");
        res.end("<p>thanks normal file</p>");
    }

});

app.listen(3000, function(){
    console.log("express is running on port 3000");
})