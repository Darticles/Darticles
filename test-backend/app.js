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
    const file = req.file;
    // res.download(file.path);
    var data = fs.readFileSync(file.path); 

    ipfs.files.add([{
        path: 'photo.png',
        content: data
    }], function(err, res) {
        if (err) { throw err; }
        resp.send('File Uploaded to ipfs');
        
        res.forEach(function (file) {
            if (file && file.hash) {
              console.log('successfully stored', file.hash);
              console.log(file.hash);
            }
        })
    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
  });