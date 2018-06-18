(function() {
	var componentName = 'radio-set';
	var s = `
		<div class="radio-set">
			<!--<span class="label">{{label}}</span>
			<ul class="radio-options" v-bind:data-selected="selectedOption">
				<li 
					v-on:click="handleChange(option)" 
					v-for="option in options"
					v-bind:class="{selected: option == selectedOption}">
					{{option}}
				</li>
			</ul>


			-->
			<div class="input-group right-style">
				<ul class="radio-options" v-bind:data-selected="selectedOption">
					<li 
						v-on:click="handleChange(option)" 
						v-for="option in options"
						v-bind:class="{selected: option == selectedOption}">
						{{option}}
					</li>
				</ul>
				
				<span class="input-group-addon">{{label}}</span>
			</div>
		</div>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		props: ["options", "label", "selectedOption"],
		template: s,
		data: function() {
			return {
			}
		},
		methods: {
			handleChange: function(option) {
				this.selectedOption = option;
				this.$emit('change-value', option);
			}
		}
	});
})();
