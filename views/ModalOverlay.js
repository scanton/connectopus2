(function() {
	var componentName = 'modal-overlay';
	var s = `
		<div class="modal-overlay" style="display: none;">
			<div class="loading-animation" v-show="loaderVisible">
				<connectopus-animation></connectopus-animation>
			</div>
			<div class="dialog-frame">
				<div class="panel panel-default">
					<div class="panel-heading">{{dialogDetails.title}}</div>
					<div class="panel-body">
						<div class="dialog-message" v-html="dialogDetails.message"></div>
						<div class="clear"></div>
						<div class="buttons pull-right">
							<button class="btn" v-bind:class="button.class" v-on:click="button.callback" v-for="button in dialogDetails.buttons">
								<span v-show="button.icon" v-bind:class="button.icon"></span>
								{{button.label}}
							</button>
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
				dialogDetails: {},
				loaderVisible: false
			}
		},
		methods: {
			showLoader: function() {
				$(".modal-overlay").find(".loading-animation").show();
			},
			show: function(options) {
				this.dialogDetails = options;
				$(".modal-overlay").find(".loading-animation").hide();
				$(".modal-overlay").fadeIn();
			},
			hide: function() {
				$(".modal-overlay").fadeOut();
			}
		}
	});
})();
