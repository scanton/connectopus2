module.exports = class ConnectionsModel extends AbstractModel {

	constructor(fileModel) {
		super();
		this._connections = [];
		this.fileModel = fileModel;
		this.tunnel = require('tunnel-ssh');
		let Ssh2SftpClient = require('ssh2-sftp-client');
		this.sftp = new Ssh2SftpClient();
	}

	addConnection(con, callback) {
		if(con && con.id && !this.hasConnection(con.id)) {
			var conId = con.id;
			con = this._strip(con);
			con.status = 'pending';
			if(this._connections.length == 0) {
				con.isPrime = true;
			} else {
				con.isPrime = false;
			}
			this._connections.push(con);
			this._dispatchUpdate();
			if(con.connectionType == "Local Directory") {
				this.fs.pathExists(con.directory, function(err, exists) {
					if(err) {
						this.setStatus(conId, 'error');
						controller.handleError(err);
					} else {
						if(!exists) {
							status = 'error';
							controller.handleError({ description: "Directory does not exist", connection: con, scope: this });
						} else {
							this.fs.readdir(con.directory, function(err, paths) {
								var path = '';
								var files = [];
								var directories = [];
								var l = paths.length;
								while(l--) {
									path = con.directory + '/' + paths[l];
									var stat = this.fs.lstatSync(path);
									if(stat.isFile()) {
										files.unshift({path: path, md5: this.md5File.sync(path), name: paths[l], directory: con.directory, size: stat.size});
									} else if(stat.isDirectory()) {
										directories.unshift({path: path, name: paths[l], directory: con.directory});
									}
								}
								this.fileModel.setContents(con.id, con.directory,{files: files, directories: directories});
								if(err) {
									this.setStatus(conId, 'error');
									controller.handleError(err);
								}
								var status = 'connected';
								this.setStatus(conId, status);
								if(callback) {
									callback(this._strip(this._connections));
								}
							}.bind(this));
						}
					}
				}.bind(this));
			} else if(con.connectionType == "Remote (SFTP)") {
				var sshData = {
					host: con.host,
					port: con.port,
					username: con.username,
					password: con.password,
					dstHost: 'localhost',
					dstPort: 3306
				}
				var sshCon = this.tunnel(sshData, function(err, server) {
					if(err) {
						this.setStatus(conId, 'error');
						controller.handleError(err);
					} else {
						this.setStatus(conId, 'connected');
						console.log(con, server, "check for DB here ----");
						server.close();
					}
				}.bind(this));
				if(callback) {
					callback(this._strip(this._connections));
				}
			} else {
				this.setStatus(conId, 'error');
				controller.handleError({ description: "unsupported connection type: " + con.connectionType, connection: con, scope: this });
			}
		}
	}

	setStatus(id, status) {
		var l = this._connections.length;
		while(l--) {
			if(this._connections[l].id == id) {
				this._connections[l].status = status;
				this._dispatchUpdate();
				return true;
			}
		}
		return false;
	}

	removeConnection(id, callback) {
		var l = this._connections.length;
		while(l--) {
			if(this._connections[l].id == id) {
				this._connections.splice(l, 1);
				return 1;
			}
		}
		return 0;
	}

	hasConnection(id) {
		var l = this._connections.length;
		while(l--) {
			if(this._connections[l].id == id) {
				return true;
			}
		}
		return false;
	}

	_dispatchUpdate() {
		this.dispatchEvent("connections-status", this._strip(this._connections));
	}
}