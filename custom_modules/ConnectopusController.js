module.exports = class ConnectopusController extends EventEmitter {

	constructor(viewController, configModel) {
		super();
		this.viewController = viewController;
		this.configModel = configModel;
		this.configModel.subscribe("data", this.handleConfigData.bind(this));
	}

	connectTo(id) {
		var con = this.configModel.getConnection(id);
		console.log("connectTo", id, con);
	}
	showConnectionDetail(id) {
		var con = this.configModel.getConnection(id);
		this.viewController.callViewMethod("connections-page", "setConnectionDetails", con);
		this.viewController.callViewMethod("connection", "setSelectedConnection", id);
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