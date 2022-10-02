# FolderCMS

An easy CMS for managing your website using markdown files placed in folders.

> You can look at the [Project page](https://github.com/users/fred-corp/projects/1/views/4) for this repo to see what's going on.  
> A demo website is on its way !

## Development plans

* [x] Make a prototype
* [x] Polish the prototype to create a working demo
* [x] Create a Docker container
* [ ] Release v1.0
* [ ] Work on feature requests :)

## But why ?

Well, I didn't really find a suitable solution for what I wanted to do. [Automad](https://automad.org) was great, but lacked some flexibility I wanted to have like :

* **Drop-down menus in navbar**  
* Easily make custom themes  
* Upload markdown files in sub-folders in a site-map like fashion
* ... (more to come during doc phase)

This project aims to make those tasks a bit easier.

## How to use

This repo contains a demo website (```website-example```) with a working structure. it should provide a good starting point for your own website.

To create your website, you'll have to modify ```server-config.json``` and create a website directory with the exlained folder structure.

### ```server-config.json```

The ```server-config.json``` file contains the following settings :

* siteTitle : The name of the website (Default : "folderCMS")  
* theme : The theme to use (Default : "default")  
* websiteDir : The directory with the website's folder structure (Default : "website-example")  
* refreshURL : The URL you'll have to access to update the Look-Up tables, should be something only you know, like a ling string (for example a UUID) (Default : "your-own-URL-wich-should-be-a-UUID")  

### Folder structure

The whole point of FolderCMS is to arrange your website's pages inside of folers the way you would like them to be displayed and accessed online.

The ```website-example``` folder structure is the following :

```
website-example
├── pages
│   ├── 01-Home-none
│   │   └── page.md
│   ├── 02-Folder-none
│   │   ├── 01-Subpage 1-none
│   │   │   └── page.md
│   │   ├── 02-Subpage 2-none
│   │   │   └── page.md
│   │   ├── 03-Sub Folder-none
│   │   │   ├── 01-Subpage 1-none
│   │   │   │   └── page.md
│   │   │   ├── 02-Subpage 2-none
│   │   │   │   └── page.md
│   │   │   └── page.md
│   │   └── page.md
│   ├── 03-Page-none
│   │   └── page.md
│   ├── 04-About-right
│   │   └── page.md
│   └── 05-Page right-right
│       └── page.md
│
├── footer
│   ├── left.md
│   ├── middle.md
│   └── right.md
│
├── 404
│   └── page.md
├── files
│
├── images
│   └── favicon.ico
│
└── title
    └── page.md
```

#### ```pages```

The ```pages``` folder contains all the pages of the website. You can see there is a ```<number>-<name>-<float>``` naming scheme for the folders. This is used to sort the pages in the navbar.  
The ```<number>``` is the position in the navbar, the ```<name>``` is the name of the page, and the ```<float>``` is the float of the page (right / none).  
When float is set to ```right```, the page will be displayed in the navbar on the right side *with the right most element being the one with the smallest number* (here "Page right" will be *before* "About" (see demo website)).

You can see that some folder contains sub-folders. This is used to create sub-pages and drop-down menus in the navBar. This only goes one layer deep, so in the ```website-example```, ```01-Subpage 1-none``` and ```02-Subpage 2-none``` in ```02-Folder-none``` won't be displayed in the navbar (but are accessible via their URL).

Each folder has a ```page.md``` file. This is the file that will be displayed when the user accesses the page.

#### ```footer```

The ```footer``` folder contains the footer of the website. It is divided in three parts : ```left.md```, ```middle.md``` and ```right.md```.  
The content of each file will be displayed in the corresponding part of the footer, and the footer will be displayed on every page.

#### ```404```

The ```404``` folder contains the page that will be displayed when the user tries to access a page that doesn't exist.

#### ```files```

The ```files``` folder contains files that can be downloaded by the user (**not yet tested** and not used in demo)

#### ```images```

The ```images``` folder contains images that can be displayed in the markdown pages. The homepage of the demo website uses the ```favicon.ico``` file.

#### ```title```

The ```title``` folder contains the markdown file for the website title.

### URL

*How are URLs generated ?*

[TODO]

## How to install

**Dependencies :**

* NPM

FolderCMS was written in Javascript and runs with NodeJS. First, clone this repo on your computer/server and install dependencies :

``` zsh
git clone https://github.com/fred-corp/folderCMS

cd folderCMS

npm install
```

Then, add your webpages in the ```website``` folder. You can find example websites in the ```website-examples``` folder.

### Run with Node.JS

Launch the server with NodeJS !

``` zsh
node server.js
```

### Run with Docker

You can also run FolderCMS with Docker. First, build the image :

``` zsh
docker build . -t foldercms
```

Then, run the container with linked port 3000, linked directory website and linked directory config :

``` zsh
docker run -p 3000:3000 -v /path/to/website:/app/website -v /path/to/config:/app/config --name FolderCMS-site foldercms
```

## Todo

* Work on issues (You can look at the [Project page](https://github.com/users/fred-corp/projects/1/views/4) for this repo to see what's going on).  
* Create live demo website
* Create documentation

Made with ❤️, lots of ☕️, and lack of 🛌

Published under CreativeCommons BY-NC-SA 4.0

[![Creative Commons License](https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png)](http://creativecommons.org/licenses/by-nc-sa/4.0/)  
This work is licensed under a [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-nc-sa/4.0/).
