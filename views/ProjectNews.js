(function() {
	var componentName = 'project-news';
	var s = `
		<div class="project-news">
			<h2>Connectopus News</h2>
			<ul>
				<li v-for="newsItem in projectNews" class="news-item">
					<h3>{{newsItem.title}}</h3>
					<div class="news-item-body">
						<span v-html="newsItem.body"></span>
					</div>
				</li>
			</ul>
			<span v-show="projectStatus.length">
				<hr />
				<h2>Project Status</h2>
				{{projectStatus}}
			</span>
			<span class="milestones-list" v-show="milestones.length">
				<hr />
				<h2>Milestones</h2>
				<milestone v-for="milestone in milestones" v-bind:title="milestone.title" v-bind:status="milestone.status" v-bind:description="milestone.description"></milestone>
			</span>
		</div>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		template: s,
		data: function() {
			return {
				projectNews: [],
				projectStatus: '',
				milestones: []
			}
		},
		methods: {
			setNewsData(data) {
				if(data.projectStatus) {
					this.projectStatus = data.projectStatus;
				}
				if(data.news) {
					this.projectNews = data.news;
				}
				if(data.milestones) {
					this.milestones = data.milestones;
				}
			}
		}
	});
})();
