(function() {
	var componentName = 'ascend-decend-selector';
	var s = `
		<div v-on:click="handleNextMode" class="ascend-decend-selector" v-bind:class="mode">
			<div class="background">
				<span v-show="mode == 'none'" class="label none-label">
					<i class="fas fa-square"></i>
				</span>
				<span v-show="mode == 'asc'" class="label asc-label">
					<i class="fas fa-caret-square-up"></i>
				</span>
				<span v-show="mode == 'desc'" class="label desc-label">
					<i class="fas fa-caret-square-down"></i>
				</span>
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
				mode: "none",
				modeOptions: ["none", "asc", "desc"],
				modeIndex: 0
			}
		},
		methods: {
			handleNextMode: function(e) {
				this.modeIndex = (this.modeIndex + 1) % this.modeOptions.length;
				this.mode = this.modeOptions[this.modeIndex];
			}
		}
	});
})();
