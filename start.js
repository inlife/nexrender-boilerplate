'use strict';

/**
 * Parameters for rendering
 */
let mixfile     = 'deep_cut.mp3';
let background  = '2016-aug-deep.jpg';
let datascript  = '2016-aug-deep.js';
let duration    = 36000; // set max duration for 10 minutes (equal to audio length)

let aepxfile  = 'nm05ae12.aepx';
let audio     = 'mp3';

/**
 * Settings for renderer
 */
const aebinary  = '/Applications/Adobe After Effects CC/aerender';
const port      = 23234;

/**
 * Dependencies
 */
const http      = require('http');
const url       = require('url');
const path      = require('path');
const fs        = require('fs');

const Project   = require('nexrender').Project;
const renderer  = require('nexrender').renderer;

/**
 * HTTP server
 */
let server = http.createServer((req, res) => {

    let uri         = url.parse(req.url).pathname;
    let filename    = path.join(process.cwd(), uri);

    fs.exists(filename, (exists) => {
        if(!exists) {
            res.writeHead(404, {"Content-Type": "text/plain"});
            res.write("404 Not Found\n");
            
            return res.end();
        }

        fs.readFile(filename, "binary", function(err, file) {
            if(err) {    
                res.writeHead(500, {"Content-Type": "text/plain"});
                res.write(err + "\n");
                return res.end();
            }

            // send 200
            res.writeHead(200);
            res.write(file, "binary");
            return res.end();
        });
    });
});

/**
 * Renderer
 */
server.listen(port, () => {

    console.log('Started local static server at port:', port);

    let project = new Project({
        "template": "project.aepx",
        "composition": "main",
        "type": "default",
        "settings": {
            "startFrame": 0,
            "endFrame": duration
        },
        "assets": [
            { "type": "project", "name": "project.aepx",    "src": `http://localhost:${port}/assets/${aepxfile}`}, 
            { "type": "image",   "name": "background.jpg",  "src": `http://localhost:${port}/assets/${background}`, "filters": [ {"name":"cover", "params": [1280, 720] }] },
            { "type": "image",   "name": "nm.png",          "src": `http://localhost:${port}/assets/nm.png` },
            { "type": "audio",   "name": `audio.${audio}`,  "src": `http://localhost:${port}/assets/${mixfile}` },
            { "type": "script",  "name": "data.js",         "src": `http://localhost:${port}/assets/${datascript}` }
        ]
    });

    console.log(project);

    // start rendering
    renderer.render(aebinary, project).then(() => {
        // success
        server.close();
        console.log('rendering finished');
    }).catch((err) => {
        // error
        console.err(err);
        server.close();
    });

});
