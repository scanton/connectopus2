module.exports = class MySQLDataSource extends AbstractDataSource {

	constructor(type, con) {
		super(type, con);
		console.log(type, this._strip(con));
	}
}