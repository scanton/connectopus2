module.exports = class ThemesModel extends AbstractModel {

	constructor() {
		super();
		this._themes = [];
		this._themePath = "css/themes"
	}
	loadThemes(callback) {
		this.fs.pathExists(this._themePath, function(err, exists) {
			if(err) {
				controller.handleError(err);
			} else {
				if(exists) {
					this.fs.readdir(this._themePath, function(err, files) {
						this._themes = this._strip(files);
						if(err) {
							controller.handleError(err);
						}
						if(callback) {
							callback(this._format(files));
						}
					}.bind(this));
				}
			}
		}.bind(this));
	}
	getThemes() {
		return this._strip(this._themes);
	}
	getPaths() {
		var a = [];
		var l = this._themes.length;
		for(var i = 0; i < l; i++) {
			a.push(this._themePath + "/" + this._themes[i]);
		}
		return a;
	}
	_format(themes) {
		var a, t, l2, word;
		var l = themes.length;
		while(l--) {
			t = themes[l];
			a = t.split(".")[0].split("-");
			l2 = a.length;
			while(l2--) {
				word = a[l2];
				a[l2] = word.charAt(0).toUpperCase() + word.slice(1);
			}
			themes[l] = a.join(" ");
		}
		return this._filter(themes);
	}
	_filter(themes) {
		var s;
		var a = [];
		var l = themes.length;
		while(l--) {
			s = themes[l];
			if(s.charAt(0) != "_") {
				a.unshift(s);
			}
		}
		return a;
	}
}