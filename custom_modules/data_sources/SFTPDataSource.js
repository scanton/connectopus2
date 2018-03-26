module.exports = class SFTPDataSource extends AbstractDataSource {

	constructor(type, con) {
		super(type, con);
		let Ssh2SftpClient = require('ssh2-sftp-client');
		this.sftp = new Ssh2SftpClient();
	}

	getDirectory(path, callback, errorHandler) {
		var con = this._con;
		var sshData = {
			host: con.host,
			port: con.port,
			username: con.username,
			password: con.password
		}

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
			if(callback) {
				var resultValue = {
					con: con, 
					data: data, 
					files: utils.sortArrayBy(files, "name"), 
					directories: utils.sortArrayBy(directories, "name"), 
					links: utils.sortArrayBy(links, "name"), 
					other: utils.sortArrayBy(other, "name"),
					path: path
				};
				callback(resultValue);
			}
		}).catch((err) => {
			if(errorHandler) {
				errorHandler(err);
			} else {
				controller.handleError(err);
			}
		});
	}
}