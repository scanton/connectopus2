module.exports = class AbstractModel extends EventEmitter {

	constructor() {
		super();
		this.fs = require('fs-extra');
		this.md5 = require('md5');
	}
	
	subscribe(event, callback) {
		this.addListener(event, callback);
	}
	
	_strip(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
}