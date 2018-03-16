const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var path = require('path');

var mainWindow = null;

app.on('ready', () => {
	mainWindow = new BrowserWindow({ width: 1200, height: 1000, center: true, frame: false, icon: path.join(__dirname, 'assets/icons/png/64x64.png') });
	mainWindow.loadURL('file://' + __dirname + '/index.html');
	mainWindow.webContents.openDevTools();
});