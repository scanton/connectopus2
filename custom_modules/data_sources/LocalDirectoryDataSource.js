module.exports = class LocalDirectoryDataSource extends AbstractDataSource {

	constructor(type, con) {
		super(type, con);
		this.fs = require('fs-extra');
		this.md5File = require('md5-file');
	}

	getSourceFile(path, localPath, saveFileToPath, directory, callback, errorHandler) {
		var delimiter = "";
		if(directory.substr(directory.length - 1) != '/' && path.charAt(0) != '/') {
			delimiter = "/";
		}
		if(callback) {
			callback(directory + delimiter + path);
		}
	}
	createDirectory(path, callback, errorHandler) {
		this.fs.ensureDir(this._con.directory + "/" + path).then(() => {
			callback();
		}).catch((err) => {
			controller.handleError(err);
		});
	}

	getDirectory(path, callback, errorHandler) {
		var directoryAndPath;
		if(path) {
			directoryAndPath = this._con.directory + "/" + path;
		} else {
			directoryAndPath = this._con.directory;
		}
		this.fs.pathExists(directoryAndPath, function(err, exists) {
			if(err) {
				if(errorHandler) {
					errorHandler(err);
				} else {
					controller.handleError(err);
				}
			} else {
				if(!exists) {
					status = 'error';
					controller.handleMissingDirectory(this._con, path);
				} else {
					this.fs.readdir(directoryAndPath, function(err, paths) {
						var fullPath = '';
						var files = [];
						var directories = [];
						var l = paths.length;
						while(l--) {
							fullPath = directoryAndPath + '/' + paths[l];
							var stat = this.fs.lstatSync(fullPath);
							if(stat.isFile()) {
								files.unshift({path: fullPath, md5: this.md5File.sync(fullPath), name: paths[l], directory: directoryAndPath, size: stat.size});
							} else if(stat.isDirectory()) {
								directories.unshift({path: directoryAndPath, name: paths[l], directory: this._con.directory});
							}
						}
						if(err) {
							if(errorHandler) {
								errorHandler(err);
							} else {
								controller.handleError(err);
							}
						}
						if(callback) {
							var con = this._con;
							var cleanPath = directoryAndPath.split(con.directory).join("");
							if(cleanPath.charAt(0) == "/") {
								cleanPath = cleanPath.substr(1);
							}
							callback({con: con, path: cleanPath, files: files, directories: directories});
						}
					}.bind(this));
				}
			}
		}.bind(this));
	}
}