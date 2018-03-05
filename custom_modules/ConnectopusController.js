module.exports = class ConnectopusController extends EventEmitter {

	constructor(viewController) {
		super();
		this.viewController = viewController;
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
}