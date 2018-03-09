module.exports = class ConnectopusController extends EventEmitter {

	constructor(viewController, configModel) {
		super();
		this.viewController = viewController;
		this.configModel = configModel;
		this.configModel.subscribe("data", this.handleConfigData.bind(this));
	}

	addNewConnection(connection) {
		var o = {}
		if(connection.connectionType != 'select connection type') {
			o.name = connection.name;
			o.connectionType = connection.connectionType;
			o.host = connection['ssh-host'];
			o.port = connection['ssh-port'];
			o.username = connection['ssh-username'];
			o.password = connection['ssh-password'];
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
	}
	connectTo(id) {
		var con = this.configModel.getConnection(id);
		console.log("connectTo", id, con);
	}
	showConnectionDetail(id) {
		var con = this.configModel.getConnection(id);
		this.viewController.callViewMethod("connections-page", "setConnectionDetails", con);
		this.viewController.callViewMethod(["connection", "context-side-bar"], "setSelectedConnection", id);
	}
	showAddConnection() {
		this.viewController.callViewMethod("connections-page", "showAddConnection");
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
}