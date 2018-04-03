module.exports = class LocalDirectoryDataSource extends AbstractDataSource {

	constructor(type, con) {
		super(type, con);
		this.fs = require('fs-extra');
		this.md5File = require('md5-file');
	}

	getDirectory(path, callback, errorHandler) {
		if(path) {
			path = this._con.directory + "/" + path;
		} else {
			path = this._con.directory;
		}
		this.fs.pathExists(path, function(err, exists) {
			if(err) {
				if(errorHandler) {
					errorHandler(err);
				} else {
					controller.handleError(err);
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
						if(err) {
							if(errorHandler) {
								errorHandler(err);
							} else {
								controller.handleError(err);
							}
						}
						if(callback) {
							var con = this._con;
							var cleanPath = path.split(con.directory).join("");
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