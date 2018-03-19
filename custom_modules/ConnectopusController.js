module.exports = class ConnectopusController extends EventEmitter {

	constructor(viewController, configModel, settingsModel, connectionsModel, themesModel) {
		super();
		this.connectionsModel = connectionsModel;
		this.viewController = viewController;
		this.configModel = configModel;
		this.settingsModel = settingsModel;
		this.themesModel = themesModel;
		this.configModel.subscribe("data", this.handleConfigData.bind(this));
		this.settingsModel.subscribe("settings", this.handleSettingsData.bind(this));
		this.connectionsModel.subscribe("connections-status", this.handleConnectionsStatus.bind(this));
		this.dragId = null;
		this.dragFolderName = null;
		this.isDraggingConnection = false;
		this.isDraggingFolder = false;
		this.lastUpdate = null;
		this.generalStatus = 'nominal';

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

	handleError(obj) {
		console.error(obj);
	}

	setStatus(status) {
		this.generalStatus = status;
		this.dispatchEvent("general-status", status);
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
	connectTo(id) {
		var con = this.configModel.getConnection(id);
		if(con) {
			this._call("modal-overlay", "showLoader");
			this.connectionsModel.addConnection(con, function() {
				this._call("modal-overlay", "hide");
			}.bind(this));
		}
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
	showConnectionDetail(id) {
		var con = this.configModel.getConnection(id);
		this._call("connections-page", "setConnectionDetails", con);
		this._call(["connection", "context-side-bar"], "setSelectedConnection", id);
		this._call(["folder", "context-side-bar"], "setSelectedFolder", null);
		this._call("folder", "clearSelected");
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
	setMaxRowsRequested(num) {
		if(num) {
			this.settingsModel.setMaxRowsRequested(num);
		}
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
	showHomePage() {
		this._call(["work-area", "main-view"], "showHome");
		this._call("context-side-bar", "setContext", "home");
	}
	showConnectionsPage() {
		this._call(["work-area", "main-view"], "showConnections");
		this._call("context-side-bar", "setContext", "connections");
	}
	showDataPage() {
		this._call(["work-area", "main-view"], "showData");
		this._call("context-side-bar", "setContext", "data");
	}
	showFilesPage() {
		this._call(["work-area", "main-view"], "showFiles");
		this._call("context-side-bar", "setContext", "files");
	}

	handleConfigData(data) {
		this._call("current-connections", "setFolders", data.folders);
		this._call("current-connections", "setConnections", data.servers);
		if(this.lastUpdate) {
			this._call("connections-page", "setConnectionDetails", this.configModel.getConnection(this.lastUpdate));
		}
	}
	handleConnectionsStatus(data) {
		this._call("connection", "setConnectionStatus", data);
		this._call("title-bar", "setSubject", data[0].name);
	}
	handleSettingsData(data) {
		this._call("settings-side-bar", "setSettings", data);
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
	handleDragConnectionEnd() {
		this.isDraggingConnection = false;
	}
	handleDragFolderEnd() {
		this.isDraggingFolder = false;
	}

	_call(views, method, params) {
		return this.viewController.callViewMethod(views, method, params);
	}
	_getThemes() {
		return [];
	}
}