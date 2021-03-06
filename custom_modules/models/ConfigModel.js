module.exports = class ConfigModel extends AbstractModel {

	constructor() {
		super();
		this.loadConfig();
	}

	addConnection(connection) {
		if(!this._config.servers) {
			this._config.servers = [];
		}
		this._config.servers.push(this._assignConnectionId(connection));
		this.saveConfig();
	}
	addConnectionAfter(con, id) {
		var found = false;
		var l = this._config.folders.length;
		while(l--) {
			var f = this._config.folders[l];
			if(f.servers) {
				var l2 = f.servers.length;
				while(l2--) {
					var s = f.servers[l2];
					if(s.id == id) {
						f.servers.splice(l2 + 1, 0, con);
						found = true;
					}
				}
			}
		}
		l = this._config.servers.length;
		while(l--) {
			var s = this._config.servers[l];
			if(s.id == id) {
				this._config.servers.splice(l + 1, 0, con);
				found = true;
			}
		}
		if(found) {
			this.saveConfig();
		} else {
			console.error("cannot find connection: ", id);
		}
	}
	addTableFieldData(conId, tableName, data) {
		var primeConnection = this.getConnection(conId);
		if(primeConnection && tableName && data) {
			if(!primeConnection.tableViews) {
				primeConnection.tableViews = {};
			}
			primeConnection.tableViews[tableName] = data;
			this.updateConnection(conId, primeConnection);
		}
	}
	removeTableFieldData(conId, tableName) {
		var primeConnection = this.getConnection(conId);
		if(primeConnection && tableName) {
			if(primeConnection.tableViews) {
				delete primeConnection.tableViews[tableName];
				this.updateConnection(conId, primeConnection);
			}
		}
	}
	createFolder(name) {
		if(name) {
			if(!this._config.folders) {
				this._config.folders = [];
			}
			this._config.folders.push({name: name, servers: []});
			this.saveConfig();
		}
	}
	createTableRelationship(id, data) {
		if(id && data && data.parentTable && data.childTable) {
			var relationId = this.md5(data.parentTable + data.childTable);
			var con = this.getConnection(id);
			if(con) {
				if(!con.tableRelationships) {
					con.tableRelationships = {};
				}
				con.tableRelationships[relationId] = data;
				this.updateConnection(id, con);
			}
		}
	}
	deleteConnection(id) {
		var deleteServer = function(servers, id) {
			var l = servers.length;
			while(l--) {
				if(servers[l].id == id) {
					servers.splice(l, 1);
				}
			}
		}
		if(this._config.servers) {
			deleteServer(this._config.servers, id);
		}
		if(this._config.folders) {
			var j = this._config.folders.length;
			while(j--) {
				deleteServer(this._config.folders[j].servers, id);
			}
		}
		this.saveConfig();
	}
	deleteFolder(name) {
		var l = this._config.folders.length;
		while(l--) {
			if(this._config.folders[l].name == name) {
				this._config.folders.splice(l, 1);
				break;
			}
		}
		this.saveConfig();
	}
	getRelations(id) {
		if(id) {
			var con = this.getConnection(id);
			if(con) {
				return con.tableRelationships;
			}
		}
	}
	hasTableRelationship(id, data) {
		if(id && data) {
			var con = this.getConnection(id);
			var relationId = this.md5(data.parentTable + data.childTable);
			if(con && con.tableRelationships && con.tableRelationships[relationId]) {
				return true;
			}
		}
		return false;
	}
	loadConfig() {
		var path = __dirname.split("custom_modules/models")[0] + "working_files/config.json";
		this.fs.readJson(path, function(err, data) {
			if(err) {
				console.log("config.json file not found");
				this._config = {};
			} else {
				this._config = this._assignIds(data);
			}
			this.dispatchEvent("data", this._strip(this._config));
		}.bind(this));
	}
	moveConnectionToFolder(conId, name) {
		var con = this.getConnection(conId);
		if(con) {
			var l = this._config.folders.length;
			while(l--) {
				if(this._config.folders[l].name == name) {
					this.deleteConnection(conId);
					this._config.folders[l].servers.push(con);
					this.saveConfig();
					return;
				}
			}
		}
	}
	moveFolderTo(dragFolderName, name) {
		if(dragFolderName && name) {
			var folder = this.getFolder(dragFolderName);
			if(folder) {
				this.removeFolder(dragFolderName);
				var l = this._config.folders.length;
				while(l--) {
					if(this._config.folders[l].name == name) {
						this._config.folders.splice(l + 1, 0, folder);
						this.saveConfig();
						return;
					}
				}
			}
		}
	}
	moveTo(moveId, toId) {
		if(moveId != toId) {
			var con = this.getConnection(moveId);
			this.deleteConnection(moveId);
			this.addConnectionAfter(con, toId);
		}
	}
	
	getConfig() {
		return this._strip(this._config);
	}
	getConnection(id) {
		if(this._config && id) {
			var l = this._config.servers.length;
			while(l--) {
				if(this._config.servers[l].id == id) {
					return this._strip(this._config.servers[l]);
				}
			}
			l = this._config.folders.length;
			while(l--) {
				if(this._config.folders[l].servers) {
					let l2 = this._config.folders[l].servers.length;
					while(l2--) {
						if(this._config.folders[l].servers[l2].id == id) {
							return this._strip(this._config.folders[l].servers[l2]);
						}
					}
				}
			}
		}
	}
	getConnectionLike(query) {
		if(this._config && query) {
			if(this._config.servers) {
				var l = this._config.servers.length;
				var isMatch;
				while(l--) {
					isMatch = true;
					for(var i in query) {
						if(this._config.servers[l][i] != query[i]) {
							isMatch = false;
						}
					}
					if(isMatch) {
						return this._config.servers[l];
					}
				}
			}
			if(this._config.folders) {
				l = this._config.folders.length;
				while(l--) {
					if(this._config.folders[l].servers) {
						let l2 = this._config.folders[l].servers.length;
						while(l2--) {
							isMatch = true;
							for(var i in query) {
								if(this._config.folders[l].servers[l2][i] != query[i]) {
									isMatch = false;
								}
							}
							if(isMatch) {
								return this._strip(this._config.folders[l].servers[l2]);
							}
						}
					}
				}
			}
		}
	}
	getFolder(name) {
		if(this._config.folders) {
			var l = this._config.folders.length;
			while(l--) {
				if(this._config.folders[l].name == name) {
					return this._config.folders[l];
				}
			}
		}
	}
	removeFolder(name) {
		var l = this._config.folders.length;
		while(l--) {
			if(this._config.folders[l].name == name) {
				this._config.folders.splice(l, 1);
			}
		}
	}
	removeRelation(conId,  relationId) {
		var con = this.getConnection(conId);
		if(con.tableRelationships && con.tableRelationships[relationId]) {
			delete con.tableRelationships[relationId];
			this.updateConnection(conId, con);
		}
	}
	saveConfig() {
		var path = __dirname.split("custom_modules/models")[0] + "working_files/config.json";
		this.fs.outputJsonSync(path, this._strip(this._config), { spaces: '\t' });
		this.dispatchEvent("data", this._strip(this._config));
	}
	updateConnection(id, connection) {
		var l = this._config.folders.length;
		while(l--) {
			if(this._config.folders[l].servers) {
				var servers = this._config.folders[l].servers;
				var l2 = servers.length;
				while(l2--) {
					if(servers[l2].id == id) {
						servers[l2] = connection;
						this.saveConfig();
						return;
					}
				}
			}
		}
		var l = this._config.servers.length;
		while(l--) {
			if(this._config.servers[l].id == id) {
				this._config.servers[l] = connection;
				this.saveConfig();
				return;
			}
		}
	}

	_assignIds(obj) {
		if(obj.servers) {
			obj.servers = this._assignServerIds(obj.servers);
		}
		if(obj.folders) {
			var l = obj.folders.length;
			while(l--) {
				obj.folders[l].servers = this._assignServerIds(obj.folders[l].servers);
			}
		}
		return obj;
	}
	_assignServerIds(servers) {
		var l = servers.length;
		while(l--) {
			servers[l] = this._assignConnectionId(servers[l]);
		}
		return servers;
	}
	_assignConnectionId(connection) {
		if(!connection.id) {
			connection.id = this.md5(JSON.stringify(connection));
			if(!connection.connectionType) {
				connection.connectionType = 'Remote (SFTP)';
			}
			if(connection && connection.connections && connection.connections[0] && !connection.connections[0].type) {
				connection.connections[0].type = 'MySQL';
			}
		}
		return connection;
	}
}