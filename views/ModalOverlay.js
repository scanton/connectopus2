(function() {
	var componentName = 'modal-overlay';
	var s = `
		<div class="modal-overlay" style="display: none;">
			<div class="dialog-frame">
				<div class="panel panel-default">
					<div class="panel-heading">{{dialogDetails.title}}</div>
					<div class="panel-body">
						<div class="dialog-message" v-html="dialogDetails.message"></div>
						<div class="clear"></div>
						<div class="buttons pull-right">
							<button class="btn" v-bind:class="button.class" v-on:click="button.callback" v-for="button in dialogDetails.buttons">{{button.label}}</button>
						</div>
						<div class="clear"></div>
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
				dialogDetails: {}
			}
		},
		methods: {
			show: function(options) {
				this.dialogDetails = options;
				$(".modal-overlay").fadeIn();
			},
			hide: function() {
				$(".modal-overlay").fadeOut();
			}
		}
	});
})();
