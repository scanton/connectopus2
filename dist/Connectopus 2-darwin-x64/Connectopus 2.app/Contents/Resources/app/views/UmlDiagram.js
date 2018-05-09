(function() {
	var componentName = 'uml-diagram';
	var s = `
		<div v-bind:class="{ 'is-visible': isVisible }" class="uml-diagram">
			<div class="uml-toolbar">
				<button v-on:click="toggleView" class="btn btn-danger pull-left" style="margin-right: 10px">
					<span class="glyphicon glyphicon-remove"></span>
				</button>
				<h1>Connectopus 2 Class Diagram</h1>
			</div>
			<img src="./uml/Connectopus2 UML.png" />
		</div>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		template: s,
		data: function() {
			return {
				isVisible: false
			}
		},
		methods: {
			hide: function() {
				this.isVisible = false;
			},
			show: function() {
				this.isVisible = true;
			},
			toggleView: function() {
				this.isVisible = !this.isVisible;
			}
		}
	});
})();
