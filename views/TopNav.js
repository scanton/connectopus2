(function() {
  var componentName = 'top-nav';
  var s = `
    <nav class="navbar navbar-inverse">
    	<div class="container-fluid">
    		<div class="navbar-header">
    			<button type="button" class="navbar-toggle collapsed" aria-expanded="false">
    				<span class="sr-only">Toggle navigation</span>
    				<span class="icon-bar"></span>
    				<span class="icon-bar"></span>
    				<span class="icon-bar"></span>
    			</button>
    		</div>
    		<div class="collapse navbar-collapse">
    			<ul class="nav navbar-nav navbar-right">
    				<li class="refresh-browser-link" title="Refresh"><a href="#" v-on:click="refresh"><span class="glyphicon glyphicon-refresh"></span></a></li>
    				<li class="toggle-dev-tools-link" title="Developer Tools"><a href="#" v-on:click="toggleDevTools"><span class="glyphicon glyphicon-wrench"></span></a></li>
            <li class="toggle-dev-tools-link" title="Settings" v-on:click="onToggleSettings"><a href="#"><span class="glyphicon glyphicon-option-horizontal"></span></a></li>
    			</ul>
    		</div>
    	</div>
    </nav>
  `;

  Vue.component(componentName, {
    created: function() {
      viewController.registerView(componentName, this);
    },
    template: s,
    data: function() {
      return {
        title: 'Connectopus 2',
        dropDown1: {
          title: 'Connectopus 2',
          icon: 'glyphicon glyphicon-globe',
          childLinks: [{
              title: 'New Project',
              clickHandler: 'controller.createNewProject()'
            },
            {
              title: 'Open Project...',
              clickHandler: 'controller.openProject()'
            },
            {
              type: 'line-break'
            },
            {
              title: 'Import Project...',
              clickHandler: 'controller.showImportProjectView()'
            }
          ]
        },
        projectName: null
      }
    },
    methods: {
      onToggleSettings: function(e) {
        e.preventDefault();
        viewController.callViewMethod("work-area", "toggleSettings");
      },
      setProjectName: function(name) {
        this.projectName = name;
      },
      refresh: function() {
        location.reload();
      },
      toggleDevTools: function() {
        remote.getCurrentWindow().toggleDevTools();
      }
    }
  });
})();
