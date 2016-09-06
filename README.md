# nexrender-boilerplate
Boilerplate project for rendering a video using nexrender.

This example shows you how to use nexrender locally (without setting up whole network) as a tool for creating dynamic personalized videos. In this example used real template that i made for youtube video channel i manage: [Noxcaos Music](https://www.youtube.com/channel/UC2D9WSUKnyTX8wWqNVITTAw). (most of those videos are made using nexrender).

Current template showcases chages for:

* background image
* background color overlay
* current playing track name
* current playing track artist(s)
* current track in tracklist indicator
* current track progress

## Super important:

**If you want to make changes to a template, please note that after effects have "bug":**

If you are making changes, and saving a project, after effects will store paths to related assets. But it will try to access them by absolute paths first, and then if it cant find by absoluting it, will fallback to relative paths. 

So if you saved a project in some folder `/Users/me/prj/`, `aerender` binary at render runtime will try to search for the asset files in that folder first and as result wont use **asset substitution** at all. So i recommend you either to delete assets in that folder (`/Users/me/prj/`) or move/rename this folder. This will force `aerender` to search for files in relative context (near project file), which is just what we need!

## Installation/Usage

You need to have installed `node.js` *>= 4* and `npm`.
And Adobe After Effects (obviously).

**Note:** dont forget to configure AE outputModule to your needs: [details](https://helpx.adobe.com/after-effects/using/basics-rendering-exporting.html#output_modules_and_output_module_settings). Usually i use h264 output codec and call the outputModule respectively. 

1. download or clone repo (`$ git clone https://github.com/Inlife/nexrender-boilerplate.git`)
2. install dependencies (`$ npm install`)
3. start rendering (`$ node start.js`)
4. success ?

