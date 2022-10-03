<h1 align="center">FolderCMS</h1>

<p align="center">
	<img width="200" height="200" margin-right="100%" src="https://raw.githubusercontent.com/fred-corp/folderCMS/main/website-examples/Demo/images/favicon.ico">
</p>

<p align="center">An easy CMS for managing your website using markdown files placed in folders.</p>
<p align="center">

[![CodeQL Workflow](https://github.com/fred-corp/folderCMS/actions/workflows/codeql.yml/badge.svg)](https://github.com/fred-corp/folderCMS/actions/workflows/codeql.yml)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/fred-corp/folderCMS)](https://github.com/fred-corp/folderCMS/releases)
[![License](https://img.shields.io/github/license/fred-corp/folderCMS)](https://github.com/fred-corp/folderCMS/blob/main/LICENCE)
[![GitHub issues](https://img.shields.io/github/issues/fred-corp/folderCMS)](https://github.com/fred-corp/folderCMS/issues)
[![GitHub last commit](https://img.shields.io/github/last-commit/fred-corp/folderCMS)](https://github.com/fred-corp/folderCMS/commits/main)
[![GitHub All Releases downloads](https://img.shields.io/github/downloads/fred-corp/folderCMS/total)](https://github.com/fred-corp/folderCMS/releases)
[![GitHub repo size](https://img.shields.io/github/repo-size/fred-corp/folderCMS)](https://github.com/fred-corp/folderCMS)
[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/fred-corp/folderCMS)](https://github.com/fred-corp/folderCMS)

> A demo website is on its way !

## But why ?

Well, I didn't really find a suitable solution for my website needs. [Automad](https://automad.org) was great, but lacked some flexibility I wanted to have like :

* **Drop-down menus in navbar**  
* Easily make custom themes  
* Upload markdown files in sub-folders in a site-map like fashion
* ... (more to come during doc phase)

This project aims to make those tasks a bit easier.

## [Wiki](https://github.com/fred-corp/folderCMS/wiki)

Everything you need start working with FolderCMS should be explained in the [wiki](https://github.com/fred-corp/folderCMS/wiki).

## Development plans

* [x] Make a prototype
* [x] Polish the prototype to create a working demo
* [x] Create a Docker container
* [ ] Release v1.0
* [ ] Work on feature requests :)

> You can look at the [Project page](https://github.com/users/fred-corp/projects/1/views/4) for this repo to see what's going on.

## How to install

See [How to install](https://github.com/fred-corp/folderCMS/wiki/How-to-install) on wiki for more detailed information.

### Dependencies

* NPM

``` zsh
git clone https://github.com/fred-corp/folderCMS

cd folderCMS
```

Create a `website` folder at the root of `folderCMS` and add your webpages in side it. You can find example websites in the `website-examples` folder.

### Run with Node.JS

``` zsh
npm install

node server.js
```

> Note : Alternatively, you can use ```npm ci``` to install dependencies from the lock file.
>
> ``` zsh
> npm ci
>
> node server.js
> ```

### Run with Docker

``` zsh
docker build . -t foldercms
```

Then, run the container with linked port 3000, linked directory website and linked directory config :

``` zsh
docker run -d -p 3000:3000 -v /path/to/website:/app/website -v /path/to/config:/app/config --name FolderCMS-site foldercms
```

## How to use

See [How to use](https://github.com/fred-corp/folderCMS/wiki/How-to-use) on wiki.

## Todo

* Work on issues (You can look at the [Project page](https://github.com/users/fred-corp/projects/1/views/4) for this repo to see what's going on).  
* Create more themes
* Test the ```files``` folder
* Create live demo website  
* Write better documentation  

## Contributing

Contributions are welcome !  
Just fork the repo, make your changes and open a pull request.

## License & Acknowledgements

Made with ❤️, lots of ☕️, and lack of 🛌

Published under CreativeCommons BY-SA 4.0

[![Creative Commons License](https://i.creativecommons.org/l/by-sa/4.0/88x31.png)](http://creativecommons.org/licenses/by-sa/4.0/)  
This work is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/).
