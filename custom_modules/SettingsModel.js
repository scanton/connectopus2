module.exports = class SettingsModel extends AbstractModel {

	constructor() {
		super();
		this.loadSettings();
	}
	loadSettings() {
		this.fs.readJson('./working_files/settings.json', function(err, data) {
			if(err) {
				console.log("settings.json file not found");
				this._settings = { theme: 'Sunset Sherbert', maxRowsRequested: 75000 };
			} else {
				this._settings = data;
			}
			this.dispatchEvent("settings", this._strip(this._settings));
		}.bind(this));
	}
	getSettings() {
		return this._strip(this._settings);
	}
	setTheme(name) {
		if(name) {
			this._settings.theme = name;
		}
		this._saveSettings();
	}
	setMaxRowsRequested(num) {
		if(num) {
			this._settings.maxRowsRequested = num;
		}
		this._saveSettings();
	}

	_saveSettings() {
		this.fs.outputJson('./working_files/settings.json', this._strip(this._settings), { spaces: '\t' }, function(err) {
			if(err) {
				console.error(err);
			}
		});
		this.dispatchEvent("settings", this._strip(this._settings));
	}
}