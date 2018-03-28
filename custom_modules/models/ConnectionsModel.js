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

			var liveConnection = DataSourceFactory.createConnection(con);
			if(liveConnection) {
				liveConnection.getDirectory(con.directory, function(data) {
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
		this._connections.splice(index, 1);
		if(this.currentProject == index) {
			this.setCurrentProject(index - 1);
		}
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

	_getRemoteDataSource(con, path, callback, errorHandler) {

		/*
		var sshCon = this.tunnel(sshData, function(err, server) {
			if(err) {
				this.setStatus(conId, 'error');
				controller.handleError(err);
			} else {
				this.setStatus(conId, 'connected');
				console.log(con, server, "check for DB here ----");
				server.close();
				this._getRemoteHash(con, "www/index.php", function(data) {
					console.log(data);
				});
			}
		}.bind(this));
		*/

	}
	_getRemoteHash(con, path, callback, errorHandler) {
		var sshData = {
			host: con.host,
			port: con.port,
			username: con.username,
			password: con.password,
			stdout: this.fs.createWriteStream('./working_files/out.txt'),
			stderr: this.fs.createWriteStream('./working_files/err.txt')
		}
		this.remote(sshData.host, "md5sum " + path, sshData, function(err) {
			if(err) {
				if(errorHandler) {
					errorHandler(err);
				}
				controller.handleError(err);
			} else {
				this.fs.readFile('./working_files/out.txt', 'utf8', (err, data) => {
					if(err) {
						if(errorHandler) {
							errorHandler(err);
						}
						controller.handleError(err);
					} else {
						callback(data);
					}
				});
			}
		}.bind(this));
	}
	_dispatchUpdate() {
		this.dispatchEvent("connections-status", this._strip(this._connections[this.currentProject]));
	}
}