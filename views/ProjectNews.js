(function() {
	var componentName = 'project-news';
	var s = `
		<ul class="project-news">
			<li v-for="newsItem in projectNews" class="news-item">
				<h3>{{newsItem.title}}</h3>
				<div class="news-item-body">
					<span v-html="newsItem.body"></span>
				</div>
			</li>
		</ul>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		template: s,
		data: function() {
			return {
				projectNews: [],
				projectStatus: ''
			}
		},
		methods: {
			setProjectNews(news) {
				this.projectNews = news;
			},
			setProjectStatus(status) {
				this.projectStatus = status;
			},
			setNewsData(data) {
				if(data.projectStatus) {
					this.setProjectStatus(data.projectStatus);
				}
				if(data.news) {
					this.setProjectNews(data.news);
				}
			}
		}
	});
})();
