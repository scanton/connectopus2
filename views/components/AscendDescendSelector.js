(function() {
	var componentName = 'ascend-decend-selector';
	var s = `
		<div v-on:click="handleNextMode" class="ascend-decend-selector" v-bind:class="mode">
			<div class="background">
				<span v-show="mode == 'none'" class="label none-label">
					<i class="fas fa-square"></i>
				</span>
				<span v-show="mode == 'asc'" class="label asc-label" title="Sort Ascending">
					<i class="fas fa-caret-square-up"></i>
				</span>
				<span v-show="mode == 'desc'" class="label desc-label" title="Sort Descending">
					<i class="fas fa-caret-square-down"></i>
				</span>
			</div>
		</div>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		mounted: function() {
			if(this.state) {
				this.mode = this.state;
			}
		},
		watch: {
			state: function(val) {
				console.log(val);
				this.mode = val;
			}
		},
		template: s,
		props: ["id", "state"],
		data: function() {
			return {
				mode: "asc",
				modeOptions: ["asc", "desc"],
				modeIndex: 0
			}
		},
		methods: {
			handleNextMode: function(e) {
				this.modeIndex = (this.modeIndex + 1) % this.modeOptions.length;
				this.mode = this.modeOptions[this.modeIndex];
				this.$emit("change", {id: this.id, mode: this.mode});
			}
		}
	});
})();
