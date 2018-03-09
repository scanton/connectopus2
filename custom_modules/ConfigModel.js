module.exports = class ConfigModel extends EventEmitter {

	constructor() {
		super();
		this.fs = require('fs-extra');
		this.md5 = require('md5');
		this.loadConfig();
	}

	addConnection(connection) {
		this._config.servers.push(this._assignConnectionId(connection));
		this.fs.writeJson('./working_files/config.json', this._strip(this._config), { spaces: '\t' }, function(err) {
			if(err) {
				console.error(err);
			}
		});
		this.dispatchEvent("data", this._strip(this._config));
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
		deleteServer(this._config.servers, id);
		var j = this._config.folders.length;
		while(j--) {
			deleteServer(this._config.folders[j].servers, id);
		}
		this.fs.writeJson('./working_files/config.json', this._strip(this._config), { spaces: '\t' }, function(err) {
			if(err) {
				console.error(err);
			}
		});
		this.dispatchEvent("data", this._strip(this._config));
	}
	loadConfig() {
		this.fs.readJson('./working_files/config.json', function(err, data) {
			if(err) {
				console.error(err);
			}
			this._config = this._assignIds(data);
			this.dispatchEvent("data", this._strip(this._config));
		}.bind(this));
	}
	
	getConfig() {
		return this._strip(this._config);
	}
	getConnection(id) {
		if(this._config && id) {
			var l = this._config.servers.length;
			while(l--) {
				if(this._config.servers[l].id == id) {
					return this._config.servers[l];
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
	subscribe(event, callback) {
		this.addListener(event, callback);
	}

	_assignIds(obj) {
		obj.servers = this._assignServerIds(obj.servers);
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
		return connection;
	}
	_strip(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
}