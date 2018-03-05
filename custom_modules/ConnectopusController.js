module.exports = class ConnectopusController extends EventEmitter {

	constructor(viewController) {
		super();
		this.viewController = viewController;

	}
	
	showHomePage() {
		this.viewController.callViewMethod("work-area", "showHome");
	}
	showConnectionsPage() {
		viewController.callViewMethod("work-area", "showConnections");
	}
	showDataPage() {
		viewController.callViewMethod("work-area", "showData");
	}
	showFilesPage() {
		viewController.callViewMethod("work-area", "showFiles");
	}
}