module.exports = class MySQLDataSource extends AbstractDataSource {

	constructor(type, con) {
		super(type, con);
		this.tunnel = require('tunnel-ssh');
		this.mysql = require('mysql');
	}

	getDirectory(directory, callback) {
		var query;
		if(directory == "/") {
			query = 'select * from information_schema.columns WHERE table_schema = \'' + this._con.connections[0].database + '\' ORDER BY table_name, ordinal_position'
		} else {
			query = directory;
		}
		var setServer = (function(context) {
			return function(server) {
				context.server = server;
			}
		})(this);
		var mySqlClient = this.mysql;
		var con = this._con;
		var dispatch = this.dispatchEvent.bind(this);
		var convertDates = this._convertDates.bind(this);

		if(this._con.connectionType == "Remote (SFTP)") {
			let dbConn = this._con.connections[0];
			let mySqlData = {
				host: dbConn.host,
				user: dbConn.username,
				password: dbConn.password,
				database: dbConn.database,
				timezone: 'utc',
				multipleStatements: true
			}
			let sshData = {
				host: this._con.host,
				port: this._con.port,
				username: this._con.username,
				password: this._con.password,
				dstHost: 'localhost',
				dstPort: 3306
			}
			let sshCon = this.tunnel(sshData, function(error, server) {
				setServer(server);
				if(error) {
					console.error(error);
					this.dispatchEvent("ssh-error", error);
				}
				var connection = mySqlClient.createConnection(mySqlData);

				var queryArray = query.split(";");
				var lineCount = queryArray.length;
				
				if(lineCount > 1) {
					var errorArray = [];
					var resultArray = [];
					var fieldArray = [];
					var callCount = 0;

					var callQuery = () => {
						console.log("call", callCount);
						let q = queryArray[callCount];
						connection.query(q, function(error, results, fields) {
							errorArray.push(error);
							resultArray.push(results);
							fieldArray.push(fields);
							++callCount;
							if(callCount < lineCount) {
								callQuery();
							} else {
								callback(errorArray, resultArray, fieldArray);
								connection.end();
								server.close();
							}
						});
					}
					callQuery();
				} else {
					connection.query(query, function(error, results, fields) {
						if(error) {
							console.error(error);
							dispatch("mysql-error", error);
							dispatch("connection-status", {id: con.id, status: "error"});
							throw error;
						} else {
							dispatch("connection-status", {id: con.id, status: 'active'});
						}
						results = convertDates(results, fields);
						callback(error, results, fields);
						server.close();
					});
					connection.end();
				}

			});
		} else {

		}
	}

	_convertDates(results, fields) {
		let l = fields.length;
		while(l--) {
			if(fields[l].type == 12) {
				let l2 = results.length;
				let name = fields[l].name;
				while(l2--) {
					results[l2][name] = this._convertLocalTimestampToMySql(results[l2][name]);
				}
			}
		}
		return results;
	}
	_convertLocalTimestampToMySql(stamp) {
		let d = new Date(stamp);
		if(d == 'Invalid Date') {
			return stamp;
		}
		let twoDigits = (d) => {
			if(0 <= d && d < 10) return "0" + d.toString();
			if(-10 < d && d < 0) return "-0" + (-1*d).toString();
			return d.toString();
		}
		return d.getUTCFullYear() + "-" + twoDigits(1 + d.getUTCMonth()) + "-" + twoDigits(d.getUTCDate()) + " " + twoDigits(d.getUTCHours()) + ":" + twoDigits(d.getUTCMinutes()) + ":" + twoDigits(d.getUTCSeconds());
	}
}