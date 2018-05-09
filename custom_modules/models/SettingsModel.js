module.exports = class SettingsModel extends AbstractModel {

	constructor() {
		super();
		this.loadSettings();
	}
	loadSettings() {
		var path = __dirname.split("custom_modules/models")[0] + "working_files/settings.json";
		this.fs.readJson(path, function(err, data) {
			if(err) {
				console.log("settings.json file not found");
				this._settings = { theme: 'Sunset Sherbert', maxRowsRequested: 75000, hideFilesInSync: false, maximizeContrast: false };
			} else {
				this._settings = data;
			}
			this.dispatchEvent("settings", this._strip(this._settings));
		}.bind(this));
	}
	getSettings() {
		return this._strip(this._settings);
	}
	setHideFilesInSync(bool) {
		this._settings.hideFilesInSync = bool;
		this._saveSettings();
	}
	setMaxRowsRequested(num) {
		if(num) {
			this._settings.maxRowsRequested = num;
		}
		this._saveSettings();
	}
	setMaximizeContrast(bool) {
		this._settings.maximizeContrast = bool;
		this._saveSettings();
	}
	setTheme(name) {
		if(name) {
			this._settings.theme = name;
		}
		this._saveSettings();
	}

	_saveSettings() {
		var path = __dirname.split("custom_modules/models")[0] + "working_files/settings.json";
		this.fs.outputJson(path, this._strip(this._settings), { spaces: '\t' }, function(err) {
			if(err) {
				controller.handleError(err);
			}
		});
		this.dispatchEvent("settings", this._strip(this._settings));
	}
}