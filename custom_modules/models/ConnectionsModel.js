module.exports = class ConnectionsModel extends AbstractModel {

	constructor(fileModel, dataModel) {
		super();
		this._connections = [[]];
		this.dataModel = dataModel;
		this.fileModel = fileModel;
		this.tunnel = require('tunnel-ssh');
		this.currentProject = 0;
	}

	addConnection(con, callback) {
		if(con && con.id && !this.hasConnection(con.id)) {
			var conId = con.id;
			con = this._strip(con);
			if(this._connections[this.currentProject].length == 0) {
				con.isPrime = true;
			} else {
				con.isPrime = false;
			}
			this._connections[this.currentProject].push(con);
			this._dispatchUpdate();
			
			this.getDirectory(con, "", (data) => {
				var dbEnabled = controller.isDatabaseOptionsEnabled();
				if(dbEnabled && con.connections.length && con.connections[0].type == "MySQL") {
					this.getDataTables(con, "/", "/", (data2) => {
						callback(data);
					});
				} else {
					callback(data);
				}
			});
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
				liveConnection.getSourceFile(path, workingPath, compareSource, con.directory, (data) => {
					var primeCon = this._connections[this.currentProject][0];
					if(primeCon) {
						var primeConnection = DataSourceFactory.createConnection(primeCon);
						primeConnection.getSourceFile(path, workingPath, primeSource, primeCon.directory, (primeData) => {
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
	getDatabaseRelation(con, relation, callback) {
		var liveConnection = DataSourceFactory.createDatabaseConnection(con);
		if(liveConnection && relation) {
			var query = "SELECT * FROM " + relation.parentTable + " AS a JOIN " + relation.childTable + " AS b ON a." + relation.parentJoinColumn + " = b." + relation.childJoinColumn + " ORDER BY b." + relation.childJoinColumn + " DESC " ;
			console.log(query);
			this.setStatus(con.id, 'pending');
			liveConnection.getDirectory(query, (data) => {
				this.setStatus(con.id, 'connected');
				this.dataModel.setContents(con, relation.id, data);
				if(callback) {
					callback(data);
				}
			}, (err) => {
				controller.handleError(err);
				this.setStatus(con.id, 'error');
			});
		} else {
			controller.handleError("invalid relation at ConnectionsModel.getDatabaseRelation()");
		}
	}
	getDataTables(con, path, name, callback) {
		var liveConnection = DataSourceFactory.createDatabaseConnection(con);
		if(liveConnection) {
			this.setStatus(con.id, 'pending');
			liveConnection.getDirectory(path, (data) => {
				this.setStatus(con.id, 'connected');
				this.dataModel.setContents(con, name, data);
				if(callback) {
					callback(data);
				}
			}, (err) => {
				controller.handleError(err);
				this.setStatus(con.id, 'error');
			});
		}
	}
	getDirectory(con, directory, callback) {
		var liveConnection = DataSourceFactory.createConnection(con);
		if(liveConnection) {
			this.setStatus(con.id, 'pending');
			liveConnection.getDirectory(directory, (data) => {
				this.setStatus(con.id, 'connected');
				this.fileModel.setContents(data.con, data.path, data);
				if(callback) {
					callback(data);
				}
			}, (err) => {
				controller.handleError(err);
				this.setStatus(con.id, 'error');
			});
		}
	}
	getPrimeConnection() {
		return this.getConnection(this.getPrimeId());
	}
	getPrimeId() {
		if(this._connections[this.currentProject] && this._connections[this.currentProject][0]) {
			return this._connections[this.currentProject][0].id;
		}
	}
	handleConnectionStatus(data) {
		console.log(data);
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
	pullGitRepositories(callback) {
		var hasGitRepos = false;
		var l = this._connections[this.currentProject].length;
		var i = 0;
		var pullRepo = () => {
			if(i < l) {
				var con = this._connections[this.currentProject][i];
				var liveCon = DataSourceFactory.createConnection(con);
				this.setStatus(con.id, 'pending');
				liveCon.isRepo((bool) => {
					this.setStatus(con.id, 'connected');
					if(bool) {
						hasGitRepos = true;
						liveCon.pull(() => {
							++i;
							pullRepo();
						});
					} else {
						++i;
						pullRepo();
					}
				});
			} else {
				callback(hasGitRepos);
			}
			
		}
		pullRepo();
	}
	removeConnection(id) {
		var l = this._connections[this.currentProject].length;
		while(l--) {
			if(this._connections[this.currentProject][l].id == id) {
				this._connections[this.currentProject].splice(l, 1);
				if(this._connections[this.currentProject][0]) {
					this._connections[this.currentProject][0].isPrime = true;
				}
				this._dispatchUpdate();
				return 1;
			}
		}
		return 0;
	}
	removeProjectData(index) {
		delete this._connections[index];
		this._dispatchUpdate();
	}
	removeTableFieldData(tableName) {
		var primeCon = this._connections[this.currentProject][0];
		if(!primeCon.tableViews) {
			primeCon.tableViews = {};
		}
		delete primeCon.tableViews[tableName];
		this._dispatchUpdate();
	}
	saveDocument(connectionIds, path, documentText, callback, errorHandler) {
		var l = connectionIds.length;
		var currentId = 0;
		var _saveDocs = () => {
			if(currentId < l) {
				var con = this.getConnection(connectionIds[currentId]);
				var liveCon = DataSourceFactory.createConnection(con);
				liveCon.save(documentText, path, () => {
					++currentId;
					_saveDocs();
				});
			} else {
				if(callback) {
					callback();
				}
			}
		}
		_saveDocs();
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
	syncFiles(path, updates, deletes, callback, errorHandler) {
		var dirName = __dirname.split("/custom_modules/models")[0];
		var localDirectory = dirName + '/working_files/transfers';
		var primeId = this.getPrimeId();
		var primeConnection = this.getConnection(primeId);
		var livePrimeConnection = DataSourceFactory.createConnection(primeConnection);
		this.setStatus(primeId, 'pending');
		livePrimeConnection.copyFilesToLocalDirectory(path, updates, localDirectory, (result) => {
			this.setStatus(primeId, 'connected');
			var totalConnections = this._connections[this.currentProject].length;
			var currentConnection = 1;
			if(totalConnections > 1) {
				var pushUpdates = () => {
					var liveCon = DataSourceFactory.createConnection(this._connections[this.currentProject][currentConnection]);
					this.setStatus(liveCon._con.id, 'pending');
					liveCon.sync(path, localDirectory, updates, deletes, () => {
						this.setStatus(liveCon._con.id, 'connected');
						++currentConnection;
						if(currentConnection < totalConnections) {
							pushUpdates();
						} else {
							if(callback) {
								callback(result);
							}
						}
					});
				}
				pushUpdates();
			} else {
				callback(result);
			}
		}, errorHandler);
	}
	syncRows(rows, table, key, callback, errorHandler) {
		var dirName = __dirname.split("/custom_modules/models")[0];
		var localDirectory = dirName + '/working_files/sql';
		var primeId = this.getPrimeId();
		var primeConnection = this.getConnection(primeId);
		var livePrimeConnection = DataSourceFactory.createDatabaseConnection(primeConnection);
		this.setStatus(primeId, 'pending');
		livePrimeConnection.copyRowsToLocalDirectory(rows, table, key, localDirectory, (localFilePath) => {
			var connections = this._connections[this.currentProject];
			this.setStatus(primeId, 'connected');
			if(connections.length > 1) {
				var currentConnection = 1;
				var updateConnections = () => {
					var con = connections[currentConnection];
					var liveCon = DataSourceFactory.createDatabaseConnection(con);
					this.setStatus(con.id, "pending");
					liveCon.updateSql(localFilePath, (result) => {
						this.setStatus(con.id, "connected");
						++currentConnection;
						if(currentConnection < connections.length) {
							updateConnections();
						} else {
							if(callback) {
								callback(localFilePath);
							}
						}
					});
				}
				updateConnections();
			} else {
				if(callback) {
					callback(localFilePath);
				}
			}
		}, errorHandler);
	}
	updatePrimeTableView(tableName, viewData) {
		var primeCon = this._connections[this.currentProject][0];
		if(!primeCon.tableViews) {
			primeCon.tableViews = {};
		}
		primeCon.tableViews[tableName] = viewData;
		this._dispatchUpdate();
	}

	_dispatchUpdate() {
		if(this._connections[this.currentProject]) {
			this.dispatchEvent("connections-status", this._strip(this._connections[this.currentProject]));
		}
	}
}