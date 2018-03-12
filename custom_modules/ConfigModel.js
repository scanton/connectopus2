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
		this.fs.outputJson('./working_files/config.json', this._strip(this._config), { spaces: '\t' }, function(err) {
			if(err) {
				console.error(err);
			}
		});
		this.dispatchEvent("data", this._strip(this._config));
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
			this.fs.outputJson('./working_files/config.json', this._strip(this._config), { spaces: '\t' }, function(err) {
				if(err) {
					console.error(err);
				}
			});
			this.dispatchEvent("data", this._strip(this._config));
		} else {
			console.error("cannot find connection: ", id);
		}
	}
	createFolder(name) {
		if(name) {
			this._config.folders.push({name: name, servers: []});
			this.fs.outputJson('./working_files/config.json', this._strip(this._config), { spaces: '\t' }, function(err) {
				if(err) {
					console.error(err);
				}
			});
			this.dispatchEvent("data", this._strip(this._config));
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
		this.fs.outputJson('./working_files/config.json', this._strip(this._config), { spaces: '\t' }, function(err) {
			if(err) {
				console.error(err);
			}
		});
		this.dispatchEvent("data", this._strip(this._config));
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
	moveConnectionToFoler(conId, name) {
		console.log(conId, name);
	}
	moveFolderTo(dragFolderName, name) {
		console.log(dragFolderName, name);
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
		if(!connection.connections[0].type) {
			connection.connections[0].type = 'MySQL';
		}
		return connection;
	}
}