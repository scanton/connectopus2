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
	compare(conId, path, callback) {
		var dirName = __dirname.split("/custom_modules/models")[0];
		var primeSource = "comp-0.txt";
		var compareSource = "comp-1.txt"
		var workingPath = dirName + "/working_files/compare/";
		var con = this.getConnection(conId);
		if(con) {
			var liveConnection = DataSourceFactory.createConnection(con);
			if(liveConnection) {
				liveConnection.getSourceFile(path, workingPath, compareSource, (data) => {
					var primeCon = this._connections[this.currentProject][0];
					if(primeCon) {
						var primeConnection = DataSourceFactory.createConnection(primeCon);
						primeConnection.getSourceFile(path, workingPath, primeSource, (primeData) => {
							callback({conId: conId, path: path, prime: this.fs.readFileSync(primeData, "utf8"), compare: this.fs.readFileSync(data, "utf8")});
						});
					} else {
						controller.handleError("Prime Connection Now Found at connectionsModel");
					}
				});
			}
		}
	}
	createDirectory(con, path, callback) {
		var liveConnection = DataSourceFactory.createConnection(con);
		if(liveConnection) {
			liveConnection.createDirectory(path, function() {
				callback();
			});
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
	getConnection(id) {
		if(this._connections[this.currentProject]) {
			var l = this._connections[this.currentProject].length;
			while(l--) {
				if(this._connections[this.currentProject][l].id == id) {
					return this._strip(this._connections[this.currentProject][l]);
				}
			}
		}
		return null;
	}
	getConnectionIndex(id) {
		if(this._connections[this.currentProject]) {
			var l = this._connections[this.currentProject].length;
			while(l--) {
				if(this._connections[this.currentProject][l].id == id) {
					return l;
				}
			}
		}
		return -1;
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
	getConnectionCount() {
		return this._connections[this.currentProject].length;
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