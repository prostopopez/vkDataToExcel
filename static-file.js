// A very basic web server in node.js
// Stolen from: Node.js for Front-End Developers by Garann Means (p. 9-10)

let port = 8000;
let serverUrl = "127.0.0.1";

let http = require("http");
let path = require("path");
let fs = require("fs");
let checkMimeType = true;

console.log("Starting web server at " + serverUrl + ":" + port);

http.createServer(function (req, res) {

    let now = new Date();

    let filename = req.url || "index.html";
    let ext = path.extname(filename);
    let localPath = __dirname;
    let validExtensions = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".txt": "text/plain",
        ".jpg": "image/jpeg",
        ".gif": "image/gif",
        ".png": "image/png",
        ".woff": "application/font-woff",
        ".woff2": "application/font-woff2"
    };

    let validMimeType = true;
    let mimeType = validExtensions[ext];
    if (checkMimeType) {
        validMimeType = validExtensions[ext] != undefined;
    }

    if (validMimeType) {
        localPath += filename;
        fs.exists(localPath, function (exists) {
            if (exists) {
                console.log("Serving file: " + localPath);
                getFile(localPath, res, mimeType);
            } else {
                console.log("File not found: " + localPath);
                res.writeHead(404);
                res.end();
            }
        });

    } else {
        console.log("Invalid file extension detected: " + ext + " (" + filename + ")")
    }

}).listen(port, serverUrl);

function getFile(localPath, res, mimeType) {
    fs.readFile(localPath, function (err, contents) {
        if (!err) {
            res.setHeader("Content-Length", contents.length);
            if (mimeType != undefined) {
                res.setHeader("Content-Type", mimeType);
            }
            res.statusCode = 200;
            res.end(contents);
        } else {
            res.writeHead(500);
            res.end();
        }
    });
}