# FolderCMS

An easy CMS for managing your website using markdown files placed in folders.

> You can look at the [Project page](https://github.com/users/fred-corp/projects/1/views/4) for this repo to see what's going on.  
> A demo website is on its way !

## But why ?

Well, I didn't really find a suitable solution for what I wanted to do. [Automad](https://automad.org) was great, but lacked some flexibility I wanted to have like :

* **Drop-down menus in navbar**  
* Easily make custom themes  
* Upload markdown files in sub-folders in a site-map like fashion
* ... (more to come during doc phase)

This project aims to make those tasks a bit easier.

## How to install

**Dependencies :**

* NPM

FolderCMS was written in Javascript and runs with NodeJS. First, clone this repo on your computer/server and install dependencies :

``` zsh
$ git clone https://github.com/fred-corp/folderCMS
$ cd folderCMS
$ npm install
```

Then, add your webpages in the ```website``` folder. The files that are included are the same files used on the demo. You can use them as a guide on how to arrange your files.

Finally, launch the server with NodeJS !

``` zsh
$ node server.js
```

## Todo

* Work on issues  

Made with ❤️, lots of ☕️, and lack of 🛌

Published under CreativeCommons BY-NC-SA 4.0

[![Creative Commons License](https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png)](http://creativecommons.org/licenses/by-nc-sa/4.0/)  
This work is licensed under a [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-nc-sa/4.0/).
