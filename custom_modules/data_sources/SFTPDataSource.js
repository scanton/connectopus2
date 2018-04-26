module.exports = class SFTPDataSource extends AbstractDataSource {

	constructor(type, con) {
		super(type, con);
		this.fs = require('fs-extra');
		this.remote = require('remote-exec');
		let Ssh2SftpClient = require('ssh2-sftp-client');
		this.sftp = new Ssh2SftpClient();
	}

	createDirectory(path, callback, errorHandler) {
		var con = this._con;
		var sshData = this._getSshData(con);

		this.sftp.connect(sshData).then(() => {
			var root = con.root ? con.root : '.';
			var fullPath = root;
			if(path) {
				fullPath = root + '/' + path;
			}
			return this.sftp.mkdir(fullPath, 1);
		}).then((data) => {
			if(callback) {
				callback(data);
			}
		}).catch((err) => {
			if(err.toString() == "Error: Unable to create directory '" + path + "'.") {
				controller.handleMissingDirectory(this._con, path);
			} else {
				if(errorHandler) {
					errorHandler(err);
				} else {
					controller.handleError(err);
				}
			}
		});
	}
	getDirectory(path, callback, errorHandler) {
		var con = this._con;
		var sshData = this._getSshData(con);

		this.sftp.connect(sshData).then(() => {
			var root = con.root ? con.root : '.';
			var fullPath = root;
			if(path) {
				fullPath = root + '/' + path;
			}
			return this.sftp.list(fullPath);
		}).then((data) => {
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
			var resultValue = {
				con: con, 
				data: data, 
				files: utils.sortArrayBy(files, "name"), 
				directories: utils.sortArrayBy(directories, "name"), 
				links: utils.sortArrayBy(links, "name"), 
				other: utils.sortArrayBy(other, "name"),
				path: path
			};

			// /this.sftp.end();
			sshData.stdout = this.fs.createWriteStream('./working_files/out.txt');
			sshData.stderr = this.fs.createWriteStream('./working_files/err.txt');
			
			var root = con.root ? con.root : '.';
			var fullPath = root;
			if(path) {
				fullPath = root + '/' + path;
			}

			var remoteCommand = ""; 
			var l = files.length;
			
			for(var i = 0; i < l; i++) {
				remoteCommand += "md5sum '" + fullPath + "/" + files[i].name + "'; "
			}
			if(remoteCommand == "") {
				callback(resultValue);
			} else {
				this.remote(sshData.host, remoteCommand, sshData, function(err) {
					if(err) {
						if(errorHandler) {
							errorHandler(err);
						} else {
							controller.handleError(err);
						}
					} else {
						setTimeout(function() {
							this.fs.readFile('./working_files/out.txt', 'utf8', (err, data) => {
								if(err) {
									if(errorHandler) {
										errorHandler(err);
									} else {
										controller.handleError(err);
									}
								} else {
									var a = data.split("\n");
									var l = a.length;
									while(l--) {
										a[l] = a[l].split("  ");
										if(a[l].length != 2) {
											a.splice(l, 1);
										} else {
											a[l][1] = a[l][1].split(fullPath + '/').join("");
										}
									}
									var l = files.length;
									while(l--) {
										var n = files[l].name;
										var l2 = a.length;
										while(l2--) {
											if(a[l2][1] == n) {
												files[l].md5 = a[l2][0];
											}
										}
									}
									callback(resultValue);
								}
							});
						}.bind(this), 250);
						
					}
				}.bind(this));
			}
		}).catch((err) => {
			if(err.toString() == "Error: No such file") {
				controller.handleMissingDirectory(this._con, path);
			} else {
				if(errorHandler) {
					errorHandler(err);
				} else {
					controller.handleError(err);
				}
			}
		});
	}
	getSourceFile(path, localPath, fileName, directory, callback, errorHandler) {
		var con = this._con;
		var sshData = this._getSshData(con);
		this.sftp.connect(sshData).then(() => {
			var root = con.root ? con.root : '.';
			var fullPath = root;
			if(path) {
				fullPath = root + '/' + path;
			}
			this.sftp.get(fullPath).then((stream) => {
				this.fs.ensureDirSync(localPath);
				stream.pipe(this.fs.createWriteStream(localPath + fileName)).on("finish", () => {
					callback(localPath + fileName);
				});
			})
		})
	}
	sync(path, localDirectory, updates, deletes, callback) {
		var con = this._con;
		var sshData = this._getSshData(con);
		var splitFile = (str) => {
			var a = str.split("/");
			return a.pop();
		}

		this.sftp.connect(sshData).then(() => {
			var root = con.root ? con.root : '.';
			var fullPath = root;
			if(path) {
				fullPath = root + '/' + path;
			}
			var ul = updates.length;
			var updateFile = () => {
				ul--;
				if(ul >= 0) {
					this.sftp.put(localDirectory + "/" + updates[ul], fullPath + "/" + splitFile(updates[ul])).then(() => {
						updateFile();
					}).catch((err) => {
						console.log(err);
						updateFile();
					});
				} else {
					callback();
				}
			}
			var dl = deletes.length;
			var deleteFile = () => {
				dl--;
				if(dl >= 0) {
					this.sftp.delete(fullPath + '/' + splitFile(deletes[dl])).then(() => {
						deleteFile();
					}).catch((err) => {
						console.log(err);
						deleteFile();
					});
				} else {
					updateFile();
				}
			}
			deleteFile();
		})
	}
	_getSshData(con) {
		var sshData = {
			host: con.host,
			port: con.port,
			username: con.username,
			password: con.password
		}
		return sshData;
	}
}