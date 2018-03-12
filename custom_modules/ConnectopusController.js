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
		this.configModel.deleteConnection(id);
		this.viewController.callViewMethod("connections-page", "resetView");
	}
	connectTo(id) {
		var con = this.configModel.getConnection(id);
		console.log("connectTo", id, con);
	}
	moveConnectionTo(toId) {
		this.configModel.moveTo(this.dragId, toId);
	}
	moveConnectionToFolder(name) {
		this.configModel.moveConnectionToFoler(this.dragId, name);
	}
	moveFolderTo(name) {
		this.configModel.moveFolderTo(this.dragFolderName, name);
	}
	showConnectionDetail(id) {
		var con = this.configModel.getConnection(id);
		this.viewController.callViewMethod("connections-page", "setConnectionDetails", con);
		this.viewController.callViewMethod(["connection", "context-side-bar"], "setSelectedConnection", id);
	}
	createConfigFolder(name) {
		if(name) {
			this.configModel.createFolder(name);
		}
	}
	setDragId(id) {
		this.dragId = id;
		this.isDraggingConnection = true;
	}
	setDragFolderName(name) {
		this.dragFolderName = name;
		this.isDraggingFolder = true;
	}
	showAddConnection() {
		this.viewController.callViewMethod("connections-page", "showAddConnection");
	}
	showAddFolder() {
		this.viewController.callViewMethod("current-connections", "showAddFolder");
	}
	showHomePage() {
		this.viewController.callViewMethod(["work-area", "main-view"], "showHome");
	}
	showConnectionsPage() {
		this.viewController.callViewMethod(["work-area", "main-view"], "showConnections");
	}
	showDataPage() {
		this.viewController.callViewMethod(["work-area", "main-view"], "showData");
	}
	showFilesPage() {
		this.viewController.callViewMethod(["work-area", "main-view"], "showFiles");
	}

	handleConfigData(data) {
		this.viewController.callViewMethod("current-connections", "setFolders", data.folders);
		this.viewController.callViewMethod("current-connections", "setConnections", data.servers);
	}
	handleDragConnectionEnd() {
		this.isDraggingConnection = false;
	}
	handleDragFolderEnd() {
		this.isDraggingFolder = false;
	}
}