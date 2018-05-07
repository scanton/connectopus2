(function() {
	var componentName = 'welcome-page';
	var s = `
		<div class="welcome-page container-fluid">
			<div class="row main-header">
				<div class="col-xs-12 bare-container text-center">
					<img src="assets/connectopus-logo.svg" style="max-width: 180px; margin-top: 2em" />
					<h1 class="word-connectopus"><strong>Connect</strong>opus 2</h1>
					<h2>Diff / Merge / Sync</h2>
				</div>
			</div>
			<div class="row welcome-info">
				<div class="col-xs-12 col-sm-6">
					<div class="info-panel">
						<h2>Quick Compare</h2>
						<p>Get started right away by quickly comparing local files or folders.</p>
						<div v-on:click="handleQuickCompareFiles" class="quick-start-option compare-files-option">
							<span class="glyphicon glyphicon-duplicate"></span> Compare Files
						</div>
						<div v-on:click="handleQuickCompareFolders" class="quick-start-option compare-folders-option">
							<span class="glyphicon glyphicon-folder-open"></span> Compare Folders
						</div>
						<hr />
					</div>
					<div v-show="savedProjects.length" class="info-panel">
						<h2>Saved Projects</h2>
						<p>Click a project name below to load the project.</p>
						<span  v-for="proj in savedProjects" title="Open Project">
							<div v-on:click="handleLoadProject" v-bind:class="{'is-active': isActiveProject(proj)}" class="saved-project" v-bind:data-file="proj">
								<button v-bind:data-file="proj" v-on:click="handleDeleteProject" class="btn btn-danger" title="Delete Project">
									<span class="glyphicon glyphicon-remove"></span>
								</button>
								<span class="glyphicon glyphicon-briefcase"></span> {{dropExtension(proj)}}
							</div>
						</span>
					</div>
					<div class="info-panel">
						<hr />
						<h2>Getting Started</h2>
						<h3>Start By Creating a Connection</h3>
						<p>Click the <span class="connections-tab-example"><span class="glyphicon glyphicon-globe"></span> Connections Tab</span> on the tool bar to the left to create and organize your connections.</p>
						<hr />
						<h3>Understanding Projects</h3>
						<p>Projects are a way of organizing your live connections.</p>
						<p>Connection data (the information about how to connect to a particular data source) is shared between projects.  You only have to create a connection once, and you will be able to use it in any project.</p>
						<p>You can have live connections to the same data source in more than one project at the same time.</p>
						<hr />
						<h3>Documentation</h3>
						<p>Documentation will be produced and available at <a target="_blank" href="http://connectopus.org/docs">Connectopus.org/docs</a></p>
					</div>
				</div>
				<div class="col-xs-12 col-sm-6">
					<div class="info-panel">
						<project-news></project-news>
					</div>
				</div>
			</div>
		</div>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		template: s,
		data: function() {
			return {
				savedProjects: [],
				activeProjects: []
			}
		},
		methods: {
			dropExtension: function(str) {
				return str.split(".json")[0];
			},
			isActiveProject: function(name) {
				var name = name.split(".json")[0];
				for(var i in this.activeProjects) {
					if(this.activeProjects[i].name == name) {
						return true;
					}
				}
				return false;
			},
			handleLoadProject: function(e) {
				e.preventDefault();
				var $target = $(e.target);
				if($target.is("div")) {
					controller.openProject(controller.projectsDirectory + "/" + $target.attr("data-file"));
				}
			},
			handleDeleteProject: function(e) {
				var $target = $(e.target);
				if(!$target.is("button")) {
					$target = $target.closest("button");
				}
				controller.deleteProject($target.attr("data-file"));
			},
			handleQuickCompareFiles: function(e) {
				controller.handleExternalCall({method: "openFileDiff"});
			},
			handleQuickCompareFolders: function(e) {
				controller.handleExternalCall({method: "openFolderDiff"});
			},
			setActiveProjects: function(projects) {
				this.activeProjects = projects;
			},
			setSavedProjects: function(projects) {
				this.savedProjects = projects.sort((a, b) => {
					if(a < b) {
						return -1;
					} else if(b < a) {
						return 1;
					}
					return 0;
				}).filter((str) => {
					return str.indexOf(".json") > -1;
				});
			}
		}
	});
})();
