module.exports = class AbstractDataSource extends EventEmitter {

	constructor(type, con) {
		super();
		this._type = type;
		this._con = con;
	}

	getType() {
		return this._type;
	}
	setType(type) {
		this._type = type;
		this.dispatchEvent("change", this);
	}
	getConnection() {
		return this._strip(this._con);
	}
	setConnection(con) {
		this._con = con;
		this.dispatchEvent("change", this);
	}
	getDirectory(path, callback, errorHandler) {
		console.log("implement get directory in child class", path);
	}
}