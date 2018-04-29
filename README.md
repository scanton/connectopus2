![Connectopus Logo](http://connectopus.org/images/logos/connectopus-logo.svg)

Connectopus 2
===========

Connectopus 2 is a tool to compare (diff), merge and sync multiple versions of the same code base across different installations.  For instance, if you have a website development pipeline that includes first developing your web application in a 'Dev' virtual environment, then moving that content, code and media to a 'Stage' environment, and then finally into Production, Connectopus can help automate that process, as well as view the differences between these different code bases.

You can connect to an unlimited number of servers in one session (limited only on your system resources).  So you can compare local versions of your application with your Git repository and with/against your remote web servers via SFTP.

## Connectopus 2 Features

* Code compare and sync code across multiple installations with line level code diff.
* Compare remote installations against Git repositories on the local file system.
* Sync media folders across multiple SFTP endpoints.

## Installation Instructions

You will need to install the latest version of [Node.js](https://nodejs.org/en/) to install this project.  If you are new to Node.js, you can download the most recent Node installer from the home page of their website.

Once Node.js is installed, clone this repository to your local machine.  If you are new to Git and aren't sure how to 'clone' this repository, you can click on the green "Clone or download" button on top of this page and/or use [GitHub Desktop](https://desktop.github.com/).

Once you have cloned this project to your local machine, open a Terminal/Command window and navigate to the directory you cloned this project to.  Then enter this command in the Terminal (note, on Windows you won't need 'sudo' but you will need to run the command prompt as Admin):

```bash
sudo npm install
```

This should install the node dependencies for this project.

To run the application, just type the following into the console:

```bash
npm start
```

## Using Connectopus 2

### Adding Connections

Connectopus 2 can connect to a variety of data sources.  As you references to remote servers or directories on the local file system, you'll see a list on the left navigation called "Connections" that will list all of the server connections you put into the application.  Click on one or more of these Connections in the left nav and click the "Connect" button to create a live connection to that data source.

### Active Connections

You will see the "Active Connections" of the servers that you have connected to at the left toolbar indicated by a unique colored background.  Each Active Connection will get a specific color scheme that data from that source will share, making it easy to see which source (connection) a particular piece of data came from.

### Comparing Files Across Installations

Clicking the "Code" button on the left toolbar of the application will allow you to browse the files (code, media, etc.) between each of the Active Connections.

Browse the file tree in the left navigation, clicking each folder to view the file differences in each directory.

Select the rows/files you would like to syncronize by clicking the checkbox at the beginning of each row.

Once you have selected the files you'd like to syncronize, click "Sync Selected Files" to have Connectopus copy and move the selected files between your SFTP servers.

### File Diff

Files that are out of sync will be indicated in Red.  If you click on any file name displayed in Red, Connectopus will download both the file out of sync and compare the file with the main version of the file being compared.

Additonal merge functionality is currently in development on the diff view, which will enable line item code push/merge options.