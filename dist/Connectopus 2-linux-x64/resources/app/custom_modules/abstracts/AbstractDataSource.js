module.exports = class AbstractDataSource extends EventEmitter {

	constructor(type, con) {
		super();
		this._type = type;
		this._con = con;
	}

	copyFilesToLocalDirectory(path, files, localDirectory, callback, errorHandler) {
		console.log("implement copyFilesToLocalDirectory in child class", this._con.name);
		if(callback) {
			callback();
		}
	}
	createDirectory(path, callback, errorHandler) {
		console.log("implement createDirectory in child class", this._con.name);	
		if(callback) {
			callback();
		}
	}
	getConnection() {
		return this._strip(this._con);
	}
	getDirectory(path, callback, errorHandler) {
		console.log("implement getDirectory in child class", this._con.name);
		if(callback) {
			callback();
		}
	}
	getSourceFile(path, localPath, saveFileToPath, directory, callback, errorHandler) {
		console.log("implement getSourceFile in child class", this._con.name);
		if(callback) {
			callback(saveFileToPath);
		}
	}
	getType() {
		return this._type;
	}
	isRepo(callback) {
		//console.log("implement isRepo in child class", this._con.name);
		callback(false);
	}
	save(documentText, path, callback, errorHandler) {
		console.log("implement save in child class", this._con.name);
		if(callback) {
			callback();
		}
	}
	setConnection(con) {
		this._con = con;
		this.dispatchEvent("change", this);
	}
	setType(type) {
		this._type = type;
		this.dispatchEvent("change", this);
	}
	sync(path, localDirectory, updates, deletes, callback) {
		console.log("implement sync in child class", this._con.name);	
		if(callback) {
			callback();
		}
	}
}