module.exports = class NewsModel extends AbstractModel {

	constructor() {
		super();
		this._feedUri = "http://connectopus.org/news.php"
		this._feed = {};
		this._request = require('request');
		this._request(this._feedUri, { json: true }, function(err, res, body) {
			if(err) {
				//controller.handleError(err);
				body = {news: [{title: "Your computer is offline...", body: "Project status and news feed will appear here when you are back online."}]}
			}
			this._feed = body;
			this.dispatchEvent("data-update", this._strip(this._feed));
		}.bind(this));
	}

	getStatus() {
		return this._feed.projectStatus;
	}
	getNews() {
		return this._feed.news;
	}
	getFeed() {
		return this._strip(this._feed);
	}
}