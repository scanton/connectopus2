module.exports = class ConnectionsModel extends AbstractModel {

	constructor(fileModel) {
		super();
		this._connections = [[]];
		this.fileModel = fileModel;
		this.tunnel = require('tunnel-ssh');
		this.currentProject = 0;
	}

	addConnection(con, callback) {
		if(con && con.id && !this.hasConnection(con.id)) {
			var conId = con.id;
			con = this._strip(con);
			con.status = 'pending';
			if(this._connections[this.currentProject].length == 0) {
				con.isPrime = true;
			} else {
				con.isPrime = false;
			}
			this._connections[this.currentProject].push(con);
			this._dispatchUpdate();
			this.getDirectory(con, "", callback);
		}
	}
	getDirectory(con, directory, callback) {
		var liveConnection = DataSourceFactory.createConnection(con);
		if(liveConnection) {
			this.setStatus(con.id, 'pending');
			liveConnection.getDirectory(directory, function(data) {
				this.setStatus(con.id, 'connected');
				this.fileModel.setContents(data.con, data.path, data);
				if(callback) {
					callback(data);
				}
			}.bind(this), function(err) {
				controller.handleError(err);
				this.setStatus(con.id, 'error');
			}.bind(this));
		}
	}
	getPrimeId() {
		if(this._connections[this.currentProject]) {
			return this._connections[this.currentProject][0].id;
		}
	}
	getConnectionName(id) {
		if(this._connections[this.currentProject]) {
			var l = this._connections[this.currentProject].length;
			while(l--) {
				if(this._connections[this.currentProject][l].id == id) {
					return this._connections[this.currentProject][l].name;
				}
			}
		}
		return "";
	}
	getConnections() {
		return this._strip(this._connections[this.currentProject]);
	}
	hasConnection(id) {
		if(this._connections[this.currentProject]) {
			var l = this._connections[this.currentProject].length;
			while(l--) {
				if(this._connections[this.currentProject][l].id == id) {
					return true;
				}
			}
		}
		return false;
	}

	removeConnection(id, callback) {
		var l = this._connections[this.currentProject].length;
		while(l--) {
			if(this._connections[this.currentProject][l].id == id) {
				this._connections[this.currentProject].splice(l, 1);
				return 1;
			}
		}
		return 0;
	}
	removeProjectData(index) {
		delete this._connections[index];
		this._dispatchUpdate();
	}

	setCurrentProject(index) {
		if(this._connections[index] == null) {
			this._connections[index] = [];
		}
		this.currentProject = index;
		this._dispatchUpdate();
	}
	setStatus(id, status) {
		var l = this._connections[this.currentProject].length;
		while(l--) {
			if(this._connections[this.currentProject][l].id == id) {
				this._connections[this.currentProject][l].status = status;
				this._dispatchUpdate();
				return true;
			}
		}
		return false;
	}

	_dispatchUpdate() {
		if(this._connections[this.currentProject]) {
			this.dispatchEvent("connections-status", this._strip(this._connections[this.currentProject]));
		}
	}
}