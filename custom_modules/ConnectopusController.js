module.exports = class ConnectopusController extends EventEmitter {

	constructor(viewController, configModel) {
		super();
		this.viewController = viewController;
		this.configModel = configModel;
		this.configModel.subscribe("data", this.handleConfigData.bind(this));
		this.dragId = null;
		this.dragFolderName = null;
		this.isDraggingConnection = false;
		this.isDraggingFolder = false;
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
	deleteConnection(id) {
		this.viewController.callViewMethod("modal-overlay", "show", {
			title: 'Confirm Delete Connection',
			message: 'Are you sure you want to delete this connection?', 
			buttons: [
				{label: "Cancel", class: "btn-warning", callback: function() {
					this.hideModal();
				}.bind(this)},
				{label: "Delete", class: "btn-danger", callback: function() {
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
			message: 'Are you sure you want to delete this folder (and all of its contents)?', 
			buttons: [
				{label: "Cancel", class: "btn-warning", callback: function() {
					this.hideModal();
				}.bind(this)},
				{label: "Delete", class: "btn-danger", callback: function() {
					this.configModel.deleteFolder(name);
					this._call("context-side-bar", "resetSelectedFolder");
					this.hideModal();
				}.bind(this)}
			]
		});
	}
	connectTo(id) {
		var con = this.configModel.getConnection(id);
		console.log("connectTo", id, con);
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
	showAddConnection() {
		this._call("connections-page", "showAddConnection");
	}
	showAddFolder() {
		this._call("current-connections", "showAddFolder");
	}
	showHomePage() {
		this._call(["work-area", "main-view"], "showHome");
	}
	showConnectionsPage() {
		this._call(["work-area", "main-view"], "showConnections");
	}
	showDataPage() {
		this._call(["work-area", "main-view"], "showData");
	}
	showFilesPage() {
		this._call(["work-area", "main-view"], "showFiles");
	}

	handleConfigData(data) {
		this._call("current-connections", "setFolders", data.folders);
		this._call("current-connections", "setConnections", data.servers);
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
}