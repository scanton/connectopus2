(function() {
	var componentName = 'modal-overlay';
	var s = `
		<div class="modal-overlay" style="display: none;">
			<div class="loading-animation" v-show="loaderVisible">
				<connectopus-animation></connectopus-animation>
			</div>
			<div class="dialog-frame" ref="el">
				<div class="panel panel-default">
					<div class="panel-heading">{{dialogDetails.title}}</div>
					<div class="panel-body" v-on:keydown="handleKeyDown">
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
				loaderVisible: false,
				speed: "fast"
			}
		},
		methods: {
			showOverlay: function() {
				controller.setIsModalVisible(true);
				var $modal = $(".modal-overlay");
				$modal.find(".loading-animation").hide(this.speed);
				$modal.find(".dialog-frame").hide(this.speed);
				$modal.fadeIn("fast");
			},
			showLoader: function() {
				controller.setIsModalVisible(true);
				var $modal = $(".modal-overlay");
				$modal.find(".loading-animation").show(this.speed);
				$modal.find(".dialog-frame").hide(this.speed);
				$modal.fadeIn(this.speed);
			},
			show: function(options) {
				controller.setIsModalVisible(true);
				this.dialogDetails = options;
				var $modal = $(".modal-overlay");
				$modal.find(".loading-animation").hide(this.speed);
				$modal.find(".dialog-frame").show(this.speed);
				$modal.fadeIn(this.speed);
			},
			hide: function() {
				controller.setIsModalVisible(false);
				$(".modal-overlay").fadeOut();
			},
			handleKeyDown(e) {
				if(e.keyCode == 13) {
					$(this.$refs.el).find(".btn-success").click();
				}
			}
		}
	});
})();
