"use strict";
const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");

const {init, render} = require("@nexrender/core");
console.log("init", init);
console.log("render", render);

/**
 *
 */
let mixfile = "deep_60s.mp3";
let background = "2016-aug-deep.jpg";
let datascript = "2016-aug-deep.js";
let duration = 3600; // set max duration for 1 minute (equal to audio length)

let aepxfile = "nm05ae12.aet";
let audio = "mp3";

const aebinary = "/Applications/Adobe After Effects 2020/aerender";
const port = 23234;

/**
 * HTTP server
 */
let server = http.createServer((req, res) => {
  let uri = url.parse(req.url).pathname;
  let filename = path.join(process.cwd(), uri);

  fs.exists(filename, exists => {
    if (!exists) {
      res.writeHead(404, {"Content-Type": "text/plain"});
      res.write("404 Not Found\n");
      return res.end();
    }

    fs.readFile(filename, "binary", function(err, file) {
      if (err) {
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
  console.log("Started local static server at port:", port);

  // addtional info about configuring project can be found at:
  // https://github.com/Inlife/nexrender/wiki/Project-model
  let project = {
    template: {
      src: `http://localhost:${port}/assets/${aepxfile}`,
      composition: "main",
      frameStart: 0,
      frameEnd: duration,
    },
    assets: [
      {
        type: "image",
        name: "background.jpg",
        layerName: "background.jpg",
        src: `http://localhost:${port}/assets/${background}`,
        // filters: [{name: "cover", params: [1280, 720]}],
      },
      {
        type: "image",
        name: "nm.png",
        layerName: "nm.png",
        src: `http://localhost:${port}/assets/nm.png`,
      },
      {
        type: "audio",
        name: `audio.${audio}`,
        layerName: `audio.${audio}`,
        src: `http://localhost:${port}/assets/${mixfile}`,
      },
      {
        type: "data",
        layerName: "artist",
        property: "position",
        value: [0, 250],
        expression: "[5*time,250]",
      },
      {
        type: "data",
        layerName: "track name",
        property: "Source Text",
        value: "lorem",
      },
    ],
    actions: {
      postrender: [
        {
          module: "@nexrender/action-encode",
          output: "output.mp4",
          preset: "mp4",
        },
        {
          module: "@nexrender/action-copy",
          input: "output.mp4",
          output: process.cwd() + "/results/output.mp4",
        },
      ],
    },
  };

  const settings = {
    workpath: process.cwd() + "/temp",
    binary: aebinary,
    debut: true,
    skipCleanup: true,
  };
  // start rendering
  render(project, init(settings))
    .then(() => {
      // success
      server.close();
      console.log("rendering finished");
    })
    .catch(err => {
      // error
      console.error(err);
      server.close();
    });
});
