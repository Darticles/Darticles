var express = require('express');
var multer = require('multer');
var app = express();

var ipfsAPI = require('ipfs-api');
var ipfs = ipfsAPI('localhost', 5001);
var fs = require('fs');

const storage = multer.diskStorage({
    destination: './files',
    filename(req, file, cb) {
      cb(null, `${new Date()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

app.post('/files', upload.single('file'), function(req, resp){
    console.log(req)
    const file = req.file;
    // res.download(file.path);
    var data = fs.readFileSync(file.path); 

    ipfs.files.add([{
        path: 'photo.png',
        content: data
    }], function(err, res) {
        if (err) { throw err; }
        
        var hashes = [];
        res.forEach(function (file) {
            if (file && file.hash) {
                hashes.push(file.hash);
            }
        })
        resp.send(hashes);
        
    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
  });