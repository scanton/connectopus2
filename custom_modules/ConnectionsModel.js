module.exports = class ConnectionsModel extends AbstractModel {

	constructor(fileModel) {
		super();
		this._connections = [];
		this.fileModel = fileModel;
		this.tunnel = require('tunnel-ssh');
		let Ssh2SftpClient = require('ssh2-sftp-client');
		this.sftp = new Ssh2SftpClient();
		this.remote = require('remote-exec');
		//this.shell = require('shelljs');
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
				this._getLocalDirectory(con, con.directory, function(data) {
					if(callback) {
						callback(data);
					}
				}.bind(this));
			} else if(con.connectionType == "Remote (SFTP)") {
				var sshData = {
					host: con.host,
					port: con.port,
					username: con.username,
					password: con.password
				}

				this.sftp.connect(sshData).then(() => {
					var root = con.root ? con.root : '.';
					return this.sftp.list(root);
				}).then((data) => {
					this.setStatus(conId, 'connected');
					var l = data.length;
					var files = [];
					var directories = [];
					var links = [];
					var other = [];
					var d;
					while(l--) {
						d = data[l];
						if(d.type == "-") {
							files.unshift(d);
						} else if(d.type == "d") {
							directories.unshift(d);
						} else if(d.type == "l") {
							links.unshift(d);
						} else {
							other.unshift(d);
						}
					}
					console.log({
						con: con, 
						data: data, 
						files: sortArrayBy(files, "name"), 
						directories: sortArrayBy(directories, "name"), 
						links: sortArrayBy(links, "name"), 
						other: sortArrayBy(other, "name")
					});
				}).catch((err) => {
					this.setStatus(conId, 'error');
					controller.handleError(err);
				});
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

	_getLocalDirectory(con, path, callback, errorHandler) {
		
		this.fs.pathExists(path, function(err, exists) {
			if(err) {
				this.setStatus(conId, 'error');
				controller.handleError(err);
				if(errorHandler) {
					errorHandler(err);
				}
			} else {
				if(!exists) {
					status = 'error';
					controller.handleError({ description: "Directory '" + path + "' does not exist", scope: this });
				} else {
					this.fs.readdir(path, function(err, paths) {
						var fullPath = '';
						var files = [];
						var directories = [];
						var l = paths.length;
						while(l--) {
							fullPath = path + '/' + paths[l];
							var stat = this.fs.lstatSync(fullPath);
							if(stat.isFile()) {
								files.unshift({path: fullPath, md5: this.md5File.sync(fullPath), name: paths[l], directory: path, size: stat.size});
							} else if(stat.isDirectory()) {
								directories.unshift({path: path, name: paths[l], directory: path});
							}
						}
						this.fileModel.setContents(con.id, path, {files: files, directories: directories});
						if(err) {
							this.setStatus(con.id, 'error');
							controller.handleError(err);
							if(errorHandler) {
								errorHandler(err);
							}
						}
						this.setStatus(con.id, 'connected');
						if(callback) {
							callback(this._strip(this._connections));
						}
					}.bind(this));
				}
			}
		}.bind(this));
	}
	_getLocalDataSource(con, callback, errorHandler) {

	}
	_getRemoteDirectory(con, path, callback, errorHandler) {

	}
	_getRemoteDataSource(con, callback, errorHandler) {

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
		this.dispatchEvent("connections-status", this._strip(this._connections));
	}
}