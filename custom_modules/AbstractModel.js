module.exports = class AbstractModel extends EventEmitter {

	constructor() {
		super();
		this.fs = require('fs-extra');
		this.md5 = require('md5');
	}
	
}