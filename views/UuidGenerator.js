(function() {
	var componentName = 'uuid-generator';
	var s = `
		<div v-bind:class="{ 'is-visible': isVisible }" class="uuid-generator">
			<button v-on:click="toggleView" class="btn btn-danger pull-left" style="margin-right: 10px; margin-top: 20px">
				<span class="glyphicon glyphicon-remove"></span>
			</button>
			<h1>UUID/GUID Generator</h1>
			<p>When working with files and data, it is sometimes helpful to have a quick way to generate UUIDs.  This tool is just a generator of random UUIDs to give us a fast/convienent place to grab new UUIDs.</p>
			<button v-on:click="generateNewUuids" class="btn btn-success" style="margin: 15px">Generate New UUIDs</button>
			<div class="container-fluid guids">
				<div class="row">
					<div v-for="uuid in uuids" class="col-xs-12 col-sm-6 col-lg-4 uuid">
						{{uuid}}
					</div>
				</div>
			</div>
		</div>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
			this.generateNewUuids();
		},
		template: s,
		data: function() {
			return {
				isVisible: false,
				uuids: []
			}
		},
		methods: {
			generateNewUuids: function() {
				var a = [];
				var l = 42;
				while(l--) {
					a.push(getUuid());
				}
				this.uuids = a;
			},
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
