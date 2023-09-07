const express = require('express');
const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
require('dotenv').config();


const app = express();

var cors = require('cors');
var bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const BUCKET = process.env.AWS_BUCKET_NAME
const REGION = process.env.AWS_BUCKET_REGION
const ACCESS_KEY = process.env.AWS_ACCESS_KEY
const SECRET_KEY = process.env.AWS_SECRET_KEY

const s3 = new AWS.S3({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
    region: REGION
});

app.post("/uploadfile", upload.single('file'), (req, res) => {
    if (req.file == null) {
        return res.status(400).json({ 'message': 'Please choose the file' })
    }

    var file = req.file
    const uploadImage = (file) => {
        const fileStream = fs.createReadStream(file.path);

        const params = {
            Bucket: BUCKET,
            Key: file.originalname,
            Body: fileStream,
        };
        s3.upload(params, function (err, data) {
            console.log(data)
            if (err) {
                throw err
            }
        });
    }
    uploadImage(file);
    return res.send(200)
})

// app.listen(8080);
app.listen(8080, () => {
    console.log("Server running on port 8080")
})

