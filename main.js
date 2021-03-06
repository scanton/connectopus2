const {Menu, ipcMain} = require('electron')
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var path = require('path');

var mainWindow = null;

app.on('ready', () => {
	mainWindow = new BrowserWindow({ width: 1200, height: 1000, center: true, frame: true, icon: path.join(__dirname, 'assets/icons/png/64x64.png') });
	mainWindow.loadURL('file://' + __dirname + '/index.html');
	//mainWindow.webContents.openDevTools();

	var template = [
	  {
	    label: 'File',
	    submenu: [
	      {
	      	label: "New Folder Diff",
	      	click () { mainWindow.webContents.send("controller-method", { method: "openFolderDiff" }) }
	      },
	      {
	      	label: "New File Diff",
	      	click () { mainWindow.webContents.send("controller-method", { method: "openFileDiff" }) }
	      },
	      {
	      	type: 'separator'
	      },
	      {
	      	label: "New Project",
	      	click () {mainWindow.webContents.send("controller-method", {method: 'newProject'}) }
	      },
	      {
	      	type: 'separator'
	      },
	      {
	        label: "Open Project...",
	        click () { mainWindow.webContents.send("controller-method", {method: 'openProject'}) }
	      },
	      {
	        label: "Save Project",
	        click () { mainWindow.webContents.send("controller-method", {method: 'saveCurrentProject', promptForName: false}) }
	      },
	      {
	        label: "Save Project As...",
	        click () { mainWindow.webContents.send("controller-method", {method: 'saveCurrentProject', promptForName: true}) }
	      },
	      {
	      	type: 'separator'
	      },
	      {
	      	label: "Close Project",
	      	click () {mainWindow.webContents.send("controller-method", {method: 'closeProject'}) }
	      }
	    ]
	  },
	  {
	    label: 'Edit',
	    submenu: [
	      {
	        role: 'undo'
	      },
	      {
	        role: 'redo'
	      },
	      {
	        type: 'separator'
	      },
	      {
	        role: 'cut'
	      },
	      {
	        role: 'copy'
	      },
	      {
	        role: 'paste'
	      },
	      {
	        role: 'pasteandmatchstyle'
	      },
	      {
	        role: 'delete'
	      },
	      {
	        role: 'selectall'
	      }
	    ]
	  },
	  {
	    label: 'View',
	    submenu: [
	      {
	        label: 'Settings',
	        accelerator: process.platform === 'darwin' ? 'Alt+Command+S' : 'Ctrl+Shift+S',
	        click () {mainWindow.webContents.send("controller-method", {method: 'toggleViewSettings'}) }
	      },
	      {
	        type: 'separator'
	      },
	      {
	        role: 'resetzoom'
	      },
	      {
	        role: 'zoomin'
	      },
	      {
	        role: 'zoomout'
	      },
	      {
	        type: 'separator'
	      },
	      {
	        role: 'togglefullscreen'
	      }
	    ]
	  },
	  {
	    label: 'Developer',
	    submenu: [
	      {
	        label: 'UUID Generator',
	        click () { mainWindow.webContents.send("controller-method", {method: 'toggleUuidGenerator'}) }
	      }/*,
	      {
	      	label: 'UML Diagram',
	      	click () { mainWindow.webContents.send("controller-method", {method: 'toggleUmlDiagram'}) }
	      }*/,
	      {
	      	type: 'separator'
	      },
	      {
	      	label: "Import Config...",
	      	click () {mainWindow.webContents.send("controller-method", {method: 'importConfig'}) }
	      },
	      {
	      	label: "Export Config...",
	      	click () {mainWindow.webContents.send("controller-method", {method: 'exportConfig'}) }
	      },
	      {
	      	type: 'separator'
	      },
	      {
	        label: 'Re-Initialize Connectopus',
	        accelerator: 'CmdOrCtrl+R',
	        click (item, focusedWindow) {
	          if (focusedWindow) focusedWindow.reload()
	        }
	      },
	      {
	        label: 'Toggle Developer Tools',
	        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
	        click (item, focusedWindow) {
	          if (focusedWindow) focusedWindow.webContents.toggleDevTools()
	        }
	      }
	    ]
	  },
	  {
	    role: 'window',
	    submenu: [
	      {
	        role: 'minimize'
	      },
	      {
	        role: 'close'
	      }
	    ]
	  },
	  {
	    role: 'help',
	    submenu: [
	      /*{
	        label: 'Connectopus.org',
	        click () { require('electron').shell.openExternal('http://connectopus.org') }
	      },*/
	      {
	      	label: 'Online Documentation',
	      	click () { require('electron').shell.openExternal('http://connectopus.org/docs') }
	      }
	    ]
	  }
	]

	if (process.platform === 'darwin') {
	  const name = app.getName()
	  template.unshift({
	    label: name,
	    submenu: [
	      {
	        role: 'about'
	      },
	      {
	        type: 'separator'
	      },
	      {
	        role: 'services',
	        submenu: []
	      },
	      {
	        type: 'separator'
	      },
	      {
	        role: 'hide'
	      },
	      {
	        role: 'hideothers'
	      },
	      {
	        role: 'unhide'
	      },
	      {
	        type: 'separator'
	      },
	      {
	        role: 'quit'
	      }
	    ]
	  })
	  // Edit menu.
	  template[2].submenu.push(
	    {
	      type: 'separator'
	    },
	    {
	      label: 'Speech',
	      submenu: [
	        {
	          role: 'startspeaking'
	        },
	        {
	          role: 'stopspeaking'
	        }
	      ]
	    }
	  )
	  // Window menu.
	  template[5].submenu = [
	    {
	      label: 'Close',
	      accelerator: 'CmdOrCtrl+W',
	      role: 'close'
	    },
	    {
	      label: 'Minimize',
	      accelerator: 'CmdOrCtrl+M',
	      role: 'minimize'
	    },
	    {
	      label: 'Zoom',
	      role: 'zoom'
	    },
	    {
	      type: 'separator'
	    },
	    {
	      label: 'Bring All to Front',
	      role: 'front'
	    }
	  ]
	}
	Menu.setApplicationMenu(Menu.buildFromTemplate(template))
});