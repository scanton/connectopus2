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
	createFolder(name) {
		if(name) {
			if(!this._config.folders) {
				this._config.folders = [];
			}
			this._config.folders.push({name: name, servers: []});
			this.saveConfig();
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
	loadConfig() {
		this.fs.readJson('./working_files/config.json', function(err, data) {
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
	saveConfig() {
		this.fs.outputJson('./working_files/config.json', this._strip(this._config), { spaces: '\t' }, function(err) {
			if(err) {
				console.error(err);
			}
		});
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
		connection.id = '';
		connection.id = this.md5(JSON.stringify(connection));
		if(!connection.connectionType) {
			connection.connectionType = 'Remote (SFTP)';
		}
		if(connection && connection.connections && connection.connections[0] && !connection.connections[0].type) {
			connection.connections[0].type = 'MySQL';
		}
		return connection;
	}
}