module.exports = class ConnectopusController extends EventEmitter {

	constructor(viewController, models) {
		super();
		this.viewController = viewController;
		this.configModel = models.configModel;
		this.settingsModel = models.settingsModel;
		this.connectionsModel = models.connectionsModel;
		this.themesModel = models.themesModel;
		this.fileModel = models.fileModel;
		this.newsModel = models.newsModel;
		this.pathsModel = models.pathsModel;
		this.projectsModel = models.projectsModel;
		this.currentFilePath = "";
		this.pathsModel.subscribe("path-change", this.handlePathChange.bind(this));
		this.configModel.subscribe("data", this.handleConfigData.bind(this));
		this.settingsModel.subscribe("settings", this.handleSettingsData.bind(this));
		this.connectionsModel.subscribe("connections-status", this.handleConnectionsStatus.bind(this));
		this.fileModel.subscribe("data-update", this.handleFileModelUpdate.bind(this));
		this.newsModel.subscribe("data-update", this.handleNewsUpdate.bind(this));
		this.projectsModel.subscribe("data-update", this.handleProjectsUpdate.bind(this));
		this.diff = require('diff');
		this.dragId = null;
		this.dragFolderName = null;
		this.isDraggingConnection = false;
		this.isDraggingFolder = false;
		this.lastUpdate = null;
		this.generalStatus = 'nominal';
		this.colorStyle = { saturation: "50%", luminance: "75%" }
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
		this.projectsDirectory = __dirname.split("custom_modules/controllers")[0] + "working_files/projects";
		this.isInProcess = false;
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
	compareFiles(conId, path) {
		this._call("modal-overlay", "showLoader");
		this.connectionsModel.compare(conId, path, (data) => {
			this._call("modal-overlay", "hide");
			data.diff = this.diff.diffLines(data.compare, data.prime, {ignoreWhitespace: false, newlineIsToken: true});
			data.totalConnections = this.connectionsModel.getConnectionCount();
			data.compareIndex = this.connectionsModel.getConnectionIndex(conId);
			data.compareName = this.connectionsModel.getConnectionName(conId);
			data.primeName = this.connectionsModel.getConnectionName(this.connectionsModel.getPrimeId());
			this._call("diff-view", "show", data);
		});
	}
	connectTo(id, callback) {
		var con = this.configModel.getConnection(id);
		if(con) {
			if(!this.isInProcess) {
				this._call("modal-overlay", "showLoader");
			}
			this.connectionsModel.addConnection(con, function(data) {
				if(!this.isInProcess) {
					this._call("modal-overlay", "hide");
				}
				if(callback) {
					callback(data);
				}
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
		this.projectsModel.createProject(name);
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
	disconnectFrom(id) {
		this.connectionsModel.removeConnection(id, function(success) {
			console.log(success);
		});
	}
	getColorStyle() {
		return this.colorStyle;
	}
	getConnectionName(id) {
		return this.connectionsModel.getConnectionName(id);
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
	getPrimeId() {
		return this.connectionsModel.getPrimeId();
	}
	getSettings() {
		return this.settingsModel.getSettings();
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
		this._call("tool-bar", "setConnectionStatus", data);
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
	handleExternalCall(args) {
		if(args) {
			if(args.method == "newProject") {
				this.showAddProject();
			} else if(args.method == "closeProject") {
				this.showDeleteProject(this.connectionsModel.currentProject);
			} else if(args.method == "saveCurrentProject") {
				this.saveCurrentProject(args);
			} else if(args.method == "saveAllProjects") {
				console.log("save all projects");
			} else if(args.method == "toggleViewSettings") {
				this.toggleViewSettings();
			} else if(args.method == "openProject") {
				dialog.showOpenDialog(
					{
						title: "Select Project File", 
						defaultPath: this.projectsDirectory,
						filters: [{name: "Projects", extensions: ["json"]}],
						properties: ["openFile"]
					}, 
					(filePath) => {
						if(filePath && filePath[0]) {
							this.openProject(filePath[0]);
						}
					}
				);
			}  else {
				console.log(args);
			}
		} else {
			this.handleError("external call to controller with no arguments");
		}
	}
	handleFileModelUpdate(data) {
		this._call(["current-directories", "files-page"], "handleFileModelUpdate");
	}
	handleHideAllLabels() {
		this._call("modal-overlay", "hide");
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
					this.connectionsModel.createDirectory(con, path, function() {
						this.setFilePath(path, true);
					}.bind(this));
					this.hideModal();
				}.bind(this)}
			]
		});
	}
	handleNewsUpdate(data) {
		this._call("project-news", "setNewsData", data);
	}
	handlePathChange(data) {
		console.log(data);
	}
	handleProjectNameConflict(data) {
		var name = data.project.name;
		this._call("modal-overlay", "show", {
			title: name + " already exists as a project",
			message: name + " is already used as a project name.  Would you like to overwrite it?",
			buttons: [
				{label: "Cancel", class: "btn-warning", icon: "", callback: function() {
					this.hideModal();
				}.bind(this)},
				{label: "Overwrite " + name, class: "btn-danger", icon: "", callback: function() {
					this.projectsModel.saveProject(data, this.handleProjectSaved.bind(this));
				}.bind(this)}
			]
		});
	}
	handleProjectSaved(data) {
		this._call("modal-overlay", "show", {
			title: "Project Saved",
			message: "'" + data.project.name + "' successfully saved.",
			buttons: [
				{label: "OK", class: "btn-success", callback: function() {
					this.hideModal()
				}.bind(this)}
			]
		});
	}
	handleProjectsUpdate(data) {
		this._call("welcome-page", "setSavedProjects", data.savedProjects);
		this._call("welcome-page", "setActiveProjects", data.projects);
		this._call("project-tabs", "setProjects", data.projects);
		this.connectionsModel.setCurrentProject(data.currentProject);
		this._call("project-tabs", "setCurrentProject", data.currentProject);
		this._call("title-bar", "setTitle", this.projectsModel.getProject(data.currentProject).name);
	}
	handleSelectedFilesChange() {
		var syncCount = $(".is-sync-action input:checked").length;
		var deleteCount = $(".is-delete-action input:checked").length;
		this._call("files-nav-bar", "handleSelectedFilesChange", {syncCount: syncCount, deleteCount: deleteCount});
	}
	handleSettingsData(data) {
		this._call("settings-side-bar", "setSettings", data);
		this._call(["active-connection", "files-page", "diff-view"], "setMaximizeContrast", data.maximizeContrast);
		this._call("work-area", "setHideMatchingFiles", data.hideFilesInSync);
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
	handleShowAllLabels() {
		this._call("modal-overlay", "showOverlay");
	}

	hideModal() {
		this._call("modal-overlay", "hide");
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
	openProject(path) {
		this.isInProcess = true;
		this._call("modal-overlay", "showLoader");
		var proj = this.projectsModel.getCurrentProject();
		var count = this.connectionsModel.getConnectionCount();
		this.projectsModel.openProject(path, () => {
			this._call("modal-overlay", "hide");
			this.isInProcess = false;
			if(count == 0 && proj.id == this.projectsModel._defaultProjectId) {
				this.projectsModel.removeProject(proj.id);
			}
		});
	}
	refreshFileView() {
		this.setFilePath(this.currentFilePath, true);
	}
	saveCurrentProject(args) {
		var proj = this._strip(this.projectsModel.getCurrentProject());
		var cons = this._strip(this.connectionsModel.getConnections());
		var projectData = {project: proj, connections: cons};
		if(args.promptForName) {
			this._call("modal-overlay", "show", {
				title: "Name your project",
				message: "What would you like to name this project? <div><input style='width: 100%; margin-top: .25em; display: ineline-block;' class='project-name-input' placeholder='Project Name' /></div>",
				buttons: [
					{label: "Cancel", class: "btn-warning", icon: "", callback: function() {
						this.hideModal();
					}.bind(this)},
					{label: "Save Project", class: "btn-success", icon: "", callback: function() {
						var name = $(".project-name-input").val();
						if(name) {
							projectData.project.name = name;
							this.projectsModel.setProjectName(projectData.project.id, name);
							this.projectsModel.projectExists(name, (err, exists) => {
								if(exists) {
									this.handleProjectNameConflict(projectData);
								} else {
									this.projectsModel.saveProject(projectData, this.handleProjectSaved.bind(this));
								}
							});
						}
						this.hideModal();
					}.bind(this)}
				]
			});
			setTimeout(function() {
				$(".project-name-input").select();
			}, 200);
		} else {
			this.projectsModel.projectExists(proj.name, (err, exists) => {
				if(exists) {
					this.handleProjectNameConflict(projectData);
				} else {
					this.projectsModel.saveProject(projectData, this.handleProjectSaved.bind(this));
				}
			})
		}
	}
	setContextVisible(bool) {
		this._call("work-area", "setIsContextVisible", bool);
	}
	setCurrentProject(id) {
		this.projectsModel.setCurrentProject(id);
		this.connectionsModel.setCurrentProject(id);
		this.pathsModel.setCurrentProject(id);
		this._call("project-tabs", "setCurrentProject", id);
		this._call("title-bar", "setTitle", this.projectsModel.getProject(id).name);
	}
	setDragFolderName(name) {
		this.dragFolderName = name;
		this.isDraggingFolder = true;
		this.viewController.callViewMethod(["folder", "context-side-bar"], "setSelectedFolder", name);
		if(name != null) {
			this._call(["connection", "context-side-bar"], "setSelectedConnection", null);
		}
	}
	setDragId(id) {
		this.dragId = id;
		this.isDraggingConnection = true;
	}
	setFilePath(path, forceRefresh) {
		this._call("files-page", "clearSelections");
		this.currentFilePath = path;
		this._call(["current-directories", "files-page", "files-nav-bar"], "setPath", path);
		var liveCons = this.connectionsModel.getConnections();
		var currentConnection = 0;
		if(liveCons.length) {
			var handler = function(data) {
				++currentConnection;
				if(currentConnection < liveCons.length) {
					this._getFiles(liveCons[currentConnection], path, handler);
				} else {
					this._call("modal-overlay", "hide");
				}
			}.bind(this);
			if(!this.fileModel.hasContent(liveCons[0].id, path) || forceRefresh) {
				this._call("modal-overlay", "showLoader");
				this._getFiles(liveCons[currentConnection], path, handler);
			}
		}
	}
	setLeftFooterLabel(str) {
		this._call("footer-bar", "setLeftLabel", str);
	}
	setHideFilesInSync(bool) {
		this.settingsModel.setHideFilesInSync(bool);
	}
	setMaximizeContrast(bool) {
		this.settingsModel.setMaximizeContrast(bool);
	}
	setMaxRowsRequested(num) {
		if(num) {
			this.settingsModel.setMaxRowsRequested(num);
		}
	}
	setProjectName(index, name) {
		this.projectsModel.setProjectName(index, name);
		this._call("title-bar", "setTitle", name);
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
			title: 'Close Project',
			message: "Are you sure you want to close the project, '" + this.projectsModel.getProject(index).name + "'", 
			buttons: [
				{label: "Cancel", class: "btn-warning", icon: "glyphicon glyphicon-ban-circle", callback: function() {
					this.hideModal();
				}.bind(this)},
				{label: "Close Project", class: "btn-danger", icon: "glyphicon glyphicon-remove", callback: function() {
					this.projectsModel.removeProject(index);
					this.connectionsModel.removeProjectData(index);
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
	syncSelectedFiles() {
		var updates = [];
		var deletes = [];
		var controllerRef = this;
		$(".files-page .file-compare input:checked").each(function() {
			var $this = $(this);
			var $fileCompare = $this.closest(".file-compare");
			var name = $fileCompare.attr("data-name");
			if(name) {
				var path = controllerRef.currentFilePath ? controllerRef.currentFilePath + '/' + name : name;
				updates.push(path);
			} else {
				name = $fileCompare.closest("tr").find(".file-compare.is-not-in-sync").attr("data-name");
				if(name) {
					var path = controllerRef.currentFilePath ? controllerRef.currentFilePath + '/' + name : name;
					deletes.push(path);
				} else {
					controllerRef.handleError("cannot locate paths for all selected files");
				}
			}
		});
		if(deletes.length) {
			this._call("modal-overlay", "show", {
				title: "File Delete Warning",
				message: "During this file sync, you are going to delete the following downstream files: " + deletes.join(", "),
				buttons: [
					{label: "Cancel", class: "btn-warning", icon: "glyphicon glyphicon-ban-circle", callback: function() {
						this.hideModal();
					}.bind(this)},
					{label: "Delete Files", class: "btn-danger", icon: "glyphicon glyphicon-remove", callback: function() {
						this.hideModal();
						this.connectionsModel.syncFiles(this.currentFilePath, updates, deletes, (result) => {
							//console.log(result);
							this.refreshFileView();
						});
					}.bind(this)}
				]
			});
		} else {
			this.connectionsModel.syncFiles(this.currentFilePath, updates, deletes, (result) => {
				//console.log(result);
				this.refreshFileView();
			});
		}
	}
	toggleViewSettings() {
		this._call("work-area", "toggleSettings");
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
}