module.exports = class ConnectopusController extends EventEmitter {

	constructor(viewController, configModel, settingsModel, connectionsModel, themesModel, fileModel, newsModel, pathsModel) {
		super();
		this.connectionsModel = connectionsModel;
		this.viewController = viewController;
		this.configModel = configModel;
		this.settingsModel = settingsModel;
		this.themesModel = themesModel;
		this.fileModel = fileModel;
		this.newsModel = newsModel;
		this.pathsModel = pathsModel;
		this.currentFilePath = "";
		this.pathsModel.subscribe("path-change", this.handlePathChange.bind(this));
		this.configModel.subscribe("data", this.handleConfigData.bind(this));
		this.settingsModel.subscribe("settings", this.handleSettingsData.bind(this));
		this.connectionsModel.subscribe("connections-status", this.handleConnectionsStatus.bind(this));
		this.fileModel.subscribe("data-update", this.handleFileModelUpdate.bind(this));
		this.newsModel.subscribe("data-update", this.handleNewsUpdate.bind(this));
		this.dragId = null;
		this.dragFolderName = null;
		this.isDraggingConnection = false;
		this.isDraggingFolder = false;
		this.lastUpdate = null;
		this.generalStatus = 'nominal';
		this.colorStyle = { saturation: "50%", luminance: "75%" }
		this._initializeProjects();
		this.themesModel.loadThemes(function(themes) {
			if(themes) {
				this._call("settings-side-bar", "setThemes", themes);

				var s = "";
				var paths = this.themesModel.getPaths();
				var l = paths.length;
				while(l--) {
					s += '<link rel="stylesheet" href="' + paths[l] + '">';
				}
				$("head").append(s);
			}
		}.bind(this));
	}

	addNewConnection(connection) {
		var o = {};
		if(connection.connectionType != 'select connection type') {
			o.name = connection.name;
			o.connectionType = connection.connectionType;
			o.uri = connection.uri;
			o.host = connection['ssh-host'];
			o.port = connection['ssh-port'];
			o.root = connection['ssh-root-directory'];
			o.username = connection['ssh-username'];
			o.password = connection['ssh-password'];
			o.directory = connection['directory-path'];
			o.connections = [{}];
			if(connection.databaseType != 'select database type') {
				o.connections = [{
					"type": connection.databaseType,
					"database": connection["db-connection-database"],
					"file": connection["db-connection-file"],
					"host": connection["db-connection-host"],
					"name": connection["db-connection-name"],
					"password": connection["db-connection-password"],
					"uri": connection["db-connection-uri"],
					"rest-verb": connection["db-connection-rest-verb"],
					"rest-args": connection["db-connection-rest-args"],
					"username": connection["db-connection-username"]
				}];
			}
		} else {
			console.error("Invalid Connection", connection);
		}
		this.configModel.addConnection(o);
	}
	connectTo(id) {
		var con = this.configModel.getConnection(id);
		if(con) {
			this._call("modal-overlay", "showLoader");
			this.connectionsModel.addConnection(con, function() {
				this._call("modal-overlay", "hide");
			}.bind(this));
		}
	}
	createConfigFolder(name) {
		if(name) {
			var folder = this.configModel.getFolder(name);
			if(folder) {
				this._call("modal-overlay", "show", {
					title: 'Folder Already Exists',
					message: 'You already have a folder named "' + name + '"', 
					buttons: [
						{label: "OK", class: "btn-success", callback: function() {
							this.hideModal();
						}.bind(this)}
					]
				});
			} else {
				this.configModel.createFolder(name);
			}
		}
	}
	createProject(name) {
		var projectId = new Date().getTime();
		this.projects[projectId] = {name: name, id:projectId };
		this.setCurrentProject(projectId);
		this._call("project-tabs", "setProjects", this.projects);
	}
	deleteConnection(id) {
		this.viewController.callViewMethod("modal-overlay", "show", {
			title: 'Confirm Delete Connection',
			message: 'Are you sure you want to delete this connection?', 
			buttons: [
				{label: "Cancel", class: "btn-warning", icon: "glyphicon glyphicon-ban-circle", callback: function() {
					this.hideModal();
				}.bind(this)},
				{label: "Delete", class: "btn-danger", icon:"glyphicon glyphicon-remove", callback: function() {
					this.configModel.deleteConnection(id);
					this._call("connections-page", "resetView");
					this._call("context-side-bar", "resetSelectedConnection");
					this.hideModal();
				}.bind(this)}
			]
		});
	}
	deleteFolder(name) {
		this.viewController.callViewMethod("modal-overlay", "show", {
			title: 'Confirm Delete Folder',
			message: 'Are you sure you want to delete this folder <strong>(and all of its contents)</strong>?', 
			buttons: [
				{label: "Cancel", class: "btn-warning", icon: "glyphicon glyphicon-ban-circle", callback: function() {
					this.hideModal();
				}.bind(this)},
				{label: "Delete", class: "btn-danger", icon: "glyphicon glyphicon-remove", callback: function() {
					this.configModel.deleteFolder(name);
					this._call("context-side-bar", "resetSelectedFolder");
					this.hideModal();
				}.bind(this)}
			]
		});
	}
	updateConnection(connection) {
		this.lastUpdate = connection.id;
		var o ={};
		o.id = connection.id;
		o.name = connection.name;
		o.connectionType = connection.connectionType;
		o.uri = connection.uri;
		o.host = connection['ssh-host'];
		o.port = connection['ssh-port'];
		o.root = connection['ssh-root-directory'];
		o.username = connection['ssh-username'];
		o.password = connection['ssh-password'];
		o.directory = connection['directory-path'];
		o.connections = [{}];
		if(connection.databaseType != 'select database type') {
			o.connections = [{
				"type": connection.databaseType,
				"database": connection["db-connection-database"],
				"file": connection["db-connection-file"],
				"host": connection["db-connection-host"],
				"name": connection["db-connection-name"],
				"password": connection["db-connection-password"],
				"uri": connection["db-connection-uri"],
				"rest-verb": connection["db-connection-rest-verb"],
				"rest-args": connection["db-connection-rest-args"],
				"username": connection["db-connection-username"]
			}];
		}
		this.configModel.updateConnection(connection.id, o);
	}

	getColorStyle() {
		return this.colorStyle;
	}
	getConnectionName(id) {
		return this.connectionsModel.getConnectionName(id);
	}
	getPrimeId() {
		return this.connectionsModel.getPrimeId();
	}
	getDirectories(connections, path) {
		var a = [];
		var l = connections.length;
		while(l--) {
			this._addDirectories(a, path, this.fileModel.getContents(connections[l], path));
		}
		return utils.sortArrayBy(a, "name");
	}
	getFiles(connections, path) {
		var allFiles = [];
		var o = {};
		var l = connections.length;
		while(l--) {
			var a2 = o[connections[l]] = [];
			var contents = this.fileModel.getContents(connections[l], path);
			this._addFiles(allFiles, path, contents);
			this._addFiles(a2, path, contents);
			utils.sortArrayBy(a2, "name");
		}
		o.allFiles = utils.sortArrayBy(allFiles, "name", 0);
		return o;
	}
	getSettings() {
		return this.settingsModel.getSettings();
	}

	moveConnectionTo(toId) {
		this.configModel.moveTo(this.dragId, toId);
	}
	moveConnectionToFolder(name) {
		this.configModel.moveConnectionToFolder(this.dragId, name);
	}
	moveFolderTo(name) {
		this.configModel.moveFolderTo(this.dragFolderName, name);
	}

	setCurrentProject(id) {
		this.currentProject = id;
		this.connectionsModel.setCurrentProject(id);
		this.pathsModel.setCurrentProject(id);
		this._call("project-tabs", "setCurrentProject", id);
		this._call("title-bar", "setTitle", this.projects[id].name);
	}
	setDragId(id) {
		this.dragId = id;
		this.isDraggingConnection = true;
	}
	setDragFolderName(name) {
		this.dragFolderName = name;
		this.isDraggingFolder = true;
		this.viewController.callViewMethod(["folder", "context-side-bar"], "setSelectedFolder", name);
		if(name != null) {
			this._call(["connection", "context-side-bar"], "setSelectedConnection", null);
		}
	}
	setFilePath(path, forceRefresh) {
		this.currentFilePath = path;
		this._call(["current-directories", "files-page", "files-nav-bar"], "setPath", path);
		var liveCons = this.connectionsModel.getConnections();
		var currentConnection = 0;
		if(liveCons.length) {
			var handler = function(data) {
				++currentConnection;
				if(currentConnection < liveCons.length) {
					this._getFiles(liveCons[currentConnection], path, handler);
				}
			}.bind(this);
			if(!this.fileModel.hasContent(liveCons[0].id) || forceRefresh) {
				this._getFiles(liveCons[currentConnection], path, handler);
			}
		}
	}
	setLeftFooterLabel(str) {
		this._call("footer-bar", "setLeftLabel", str);
	}
	setMaxRowsRequested(num) {
		if(num) {
			this.settingsModel.setMaxRowsRequested(num);
		}
	}
	setMaximizeContrast(bool) {
		this.settingsModel.setMaximizeContrast(bool);
	}
	setProjectName(index, name) {
		if(this.projects[index] && this.projects[index].name) {
			this.projects[index].name = name;
			this._call("project-tabs", "setProjects", this.projects);
			this._call("title-bar", "setTitle", name);
		}
	}
	setStatus(status) {
		this.generalStatus = status;
		this.dispatchEvent("general-status", status);
	}
	setTheme(name) {
		if(name) {
			this.settingsModel.setTheme(name);
		}
	}

	showAddConnection() {
		this._call("connections-page", "showAddConnection");
	}
	showAddFolder() {
		this._call("current-connections", "showAddFolder");
	}
	showAddProject() {
		this.viewController.callViewMethod("modal-overlay", "show", {
			title: 'Create New Project',
			message: "Give your new project a name. <input style='width: 100%; margin: .5em 0 0' placeholder='Project Name' class='project-name-input' name='name' />", 
			buttons: [
				{label: "Cancel", class: "btn-warning", icon: "glyphicon glyphicon-ban-circle", callback: function() {
					this.hideModal();
				}.bind(this)},
				{label: "Create Project", class: "btn-success", icon: "", callback: function() {
					var val = $(".project-name-input").val();
					if(val) {
						this.createProject(val);
						$(".project-name-input").val("");
					}
					this.hideModal();
				}.bind(this)}
			]
		});
		setTimeout(function() {
			$(".project-name-input").select();
		}, 200);
	}
	showConnectionDetail(id) {
		var con = this.configModel.getConnection(id);
		this._call("connections-page", "setConnectionDetails", con);
		this._call(["connection", "context-side-bar"], "setSelectedConnection", id);
		this._call(["folder", "context-side-bar"], "setSelectedFolder", null);
		this._call("folder", "clearSelected");
	}
	showConnectionsPage() {
		this._call(["work-area", "main-view"], "showConnections");
		this._call("context-side-bar", "setContext", "connections");
	}
	showDataPage() {
		this._call(["work-area", "main-view"], "showData");
		this._call("context-side-bar", "setContext", "data");
	}
	showDeleteProject(index) {
		this.viewController.callViewMethod("modal-overlay", "show", {
			title: 'Delete Project',
			message: "Are you sure you want to delete the project, '" + this.projects[index].name + "'", 
			buttons: [
				{label: "Cancel", class: "btn-warning", icon: "glyphicon glyphicon-ban-circle", callback: function() {
					this.hideModal();
				}.bind(this)},
				{label: "Delete Project", class: "btn-danger", icon: "glyphicon glyphicon-remove", callback: function() {
					this._removeProject(index);
					this.hideModal();
				}.bind(this)}
			]
		});
	}
	showFilesPage() {
		this._call(["work-area", "main-view"], "showFiles");
		this._call("context-side-bar", "setContext", "files");
	}
	showHomePage() {
		this._call(["work-area", "main-view"], "showHome");
		this._call("context-side-bar", "setContext", "home");
	}
	
	hideModal() {
		this._call("modal-overlay", "hide");
	}

	handleConfigData(data) {
		this._call("current-connections", "setFolders", data.folders);
		this._call("current-connections", "setConnections", data.servers);
		if(this.lastUpdate) {
			this._call("connections-page", "setConnectionDetails", this.configModel.getConnection(this.lastUpdate));
		}
	}
	handleConnectionsStatus(data) {
		var name = ""
		if(data && data[0] && data[0].name) {
			name = data[0].name;
		}
		var target = "";
		if(data && data.length > 1) {
			target = data[data.length - 1].name;	
		}
		this._call("title-bar", "setSubject", name); 
		this._call("title-bar", "setTarget", target);
		this._call("connection", "setConnectionStatus", data);
		this._call("category-side-bar", "setConnectionStatus", data);
		this._call(["current-directories", "files-page", "file-listing"], "setConnections", data);
	}
	handleDragConnectionEnd() {
		this.isDraggingConnection = false;
	}
	handleDragFolderEnd() {
		this.isDraggingFolder = false;
	}
	handleError(obj) {
		this.viewController.callViewMethod("modal-overlay", "show", {
			title: 'Error',
			message: obj.toString(), 
			buttons: [
				{label: "OK", class: "btn-danger", icon: "glyphicon glyphicon-ban-circle", callback: function() {
					this.hideModal();
				}.bind(this)}
			]
		});
		console.error(obj);
	}
	handleFileModelUpdate(data) {
		this._call(["current-directories", "files-page"], "handleFileModelUpdate");
	}
	handleMissingDirectory(con, path) {
		this.viewController.callViewMethod("modal-overlay", "show", {
			title: 'Directory "' + path + '" does not exist on ' + con.name,
			message: "Would you like to create the remote directory '" + path + "' on " + con.name + "?", 
			buttons: [
				{label: "Cancel", class: "btn-warning", icon: "", callback: function() {
					this.hideModal();
				}.bind(this)},
				{label: "Create Directory", class: "btn-success", icon: "", callback: function() {
					this.hideModal();
				}.bind(this)}
			]
		});
	}
	handleShowAllLabels() {
		this._call("modal-overlay", "showOverlay");
	}
	handleHideAllLabels() {
		this._call("modal-overlay", "hide");
	}
	handleNewsUpdate(data) {
		this._call("project-news", "setNewsData", data);
	}
	handlePathChange(data) {
		console.log(data);
	}
	handleSettingsData(data) {
		this._call("settings-side-bar", "setSettings", data);
		this._call(["active-connection", "file-listing"], "setMaximizeContrast", data.maximizeContrast);
		if(data.theme) {
			var theme = data.theme.toLowerCase().split(" ").join("-");
			var $main = $("body");
			var last = $main.attr("data-last-class");
			if(last) {
				$main.removeClass(last);
			}
			$main.addClass(theme);
			$main.attr("data-last-class", theme);
			this._call(["title-bar", "work-area"], "setTheme", theme);
		}
	}

	_addDirectories(arr, path, data) {
		if(data && data.directories) {
			var l = data.directories.length;
			var d, delimiter;
			while(l--) {
				d = data.directories[l];
				if(!this._hasDirectory(arr, d.name)) {
					delimiter = path.length ? '/' : '';
					arr.push({name: d.name, path: path + delimiter + d.name});
				}
			}
		}
		return arr;
	}
	_addFiles(arr, path, data) {
		if(data && data.files) {
			var l = data.files.length;
			var d, delimiter;
			while(l--) {
				d = data.files[l];
				if(!this._hasFile(arr, d.name)) {
					delimiter = path.length ? '/' : '';
					arr.push({name: d.name, path: path + delimiter + d.name, md5: d.md5});
				}
			}
		}
		return arr;
	}
	_call(views, method, params) {
		return this.viewController.callViewMethod(views, method, params);
	}
	_getFiles(con, path, callback) {
		this.connectionsModel.getDirectory(con, path, function(data) {
			callback(data);
		});
	}
	_hasDirectory(arr, name) {
		var l = arr.length;
		while(l--) {
			if(arr[l].name == name) {
				return true;
			}
		}
		return false;
	}
	_hasFile(arr, name) {
		var l = arr.length;
		while(l--) {
			if(arr[l].name == name) {
				return true;
			}
		}
		return false;
	}
	_initializeProjects() {
		var defaultProjectId = new Date().getTime();
		this.projects = {};
		this.projects[defaultProjectId] = { name: 'Project 1', id: defaultProjectId };
		this.setCurrentProject(defaultProjectId);
		this._call("project-tabs", "setProjects", this.projects);
	}
	_removeProject(index) {
		delete this.projects[index];
		this.connectionsModel.removeProjectData(index);
		var leastDiff = Number.POSITIVE_INFINITY;
		var closestProjectId, delta;
		for(var i in this.projects) {
			delta = Math.abs(Number(index) - Number(i));
			if(delta < leastDiff) {
				leastDiff = delta;
				closestProjectId = i;
			}
		}
		if(closestProjectId == undefined) {
			this._initializeProjects();
		} else {
			this.setCurrentProject(closestProjectId);
			this._call("project-tabs", "setProjects", this.projects);
		}
		//this._call("current-connections", "", ) TODO: update curent-connections data
	}
	_totalProjects() {
		var l = 0;
		for(var i in this.projects) {
			++l;
		}
		return l;
	}
}