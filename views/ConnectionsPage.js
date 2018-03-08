(function() {
	var componentName = 'connections-page';
	var s = `
		<div class="connections-page container-fluid">
			<div class="row" v-if="isAddConnectionVisible">
				<div class="col-xs-12">
					<div class="add-connection-page">
						<add-new-connection-form></add-new-connection-form>
					</div>
				</div>
			</div>
			<div class="row" v-if="connectionDetails">
				<div class="col-xs-12">
					<div class="connection-details">
						<h3>{{connectionDetails.name}}</h3>
						<form>
							<div class="input-group">
								<span class="input-group-addon">Host</span>
								<input type="text" v-show="!isEditEnabled" v-bind:value="connectionDetails.host" readonly="readonly" />
								<input type="text" v-show="isEditEnabled" name="ssh-host" v-on:keyup="handleInputChange" />
							</div>
							<div class="input-group">
								<span class="input-group-addon">Port</span>
								<input type="text" v-show="!isEditEnabled" v-bind:value="connectionDetails.port" readonly="readonly" />
								<input type="text" v-show="isEditEnabled" name="ssh-port" v-on:keyup="handleInputChange" />
							</div>
							<div class="input-group">
								<span class="input-group-addon">Username</span>
								<input type="text" v-show="!isEditEnabled" v-bind:value="connectionDetails.username" readonly="readonly" />
								<input type="text" v-show="isEditEnabled" name="ssh-username" v-on:keyup="handleInputChange" />
							</div>
							<div class="input-group">
								<span class="input-group-addon">Password</span>
								<input type="password" v-show="!isEditEnabled" v-bind:value="connectionDetails.password" readonly="readonly" />
								<input type="password" v-show="isEditEnabled" name="ssh-password" v-on:keyup="handleInputChange" />
							</div>
							<div class="panel panel-default">
								<div class="panel-heading">
									<h3 class="panel-title">{{connectionDetails.connections[0].name}}</h3>
								</div>
								<div class="panel-body">
									<div class="input-group">
										<span class="input-group-addon">Host</span>
										<input type="text" v-show="!isEditEnabled" v-bind:value="connectionDetails.connections[0].host" readonly="readonly" />
										<input type="text" v-show="isEditEnabled" name="mysql-host" v-on:keyup="handleInputChange" />
									</div>
									<div class="input-group">
										<span class="input-group-addon">Database Name</span>
										<input type="text" v-show="!isEditEnabled" v-bind:value="connectionDetails.connections[0].database" readonly="readonly" />
										<input type="text" v-show="isEditEnabled" name="mysql-database" v-on:keyup="handleInputChange" />
									</div>
									<div class="input-group">
										<span class="input-group-addon">Userame</span>
										<input type="text" v-show="!isEditEnabled" v-bind:value="connectionDetails.connections[0].username" readonly="readonly" />
										<input type="text" v-show="isEditEnabled" name="mysql-username" v-on:keyup="handleInputChange" />
									</div>
									<div class="input-group">
										<span class="input-group-addon">Password</span>
										<input type="password" v-show="!isEditEnabled" v-bind:value="connectionDetails.connections[0].password" readonly="readonly" />
										<input type="password" v-show="isEditEnabled" name="mysql-password" v-on:keyup="handleInputChange" />
									</div>
								</div>
							</div>
						</form>
						<button v-show="!isEditEnabled" class="btn btn-success pull-right panel-button" title="connect"><span class="glyphicon glyphicon-record"></span> Connect</button>
						<button v-show="hasUnsavedEdits" class="btn btn-success pull-right panel-button">Update Connection Data</button>
						<button v-show="!isEditEnabled" v-on:click="enableEdit" class="btn btn-default pull-right panel-button">Edit Connection</button>
						<button v-show="isEditEnabled" v-on:click="disableEdit" class="btn btn-default pull-right panel-button">Discard Edits</button>
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
				connectionDetails: null,
				hasUnsavedEdits: false,
				isAddConnectionVisible: false,
				isEditEnabled: false
			}
		},
		methods: {
			enableEdit: function(e) {
				e.preventDefault();
				this.isEditEnabled = true;
				$(".connections-page").find("form").find(".input-group").each(function() {
					var $inputs = $(this).find("input");
					if($inputs.length == 2) {
						$($inputs[1]).val($($inputs[0]).val());
					}
				});
			},
			disableEdit: function(e) {
				e.preventDefault();
				this.hasUnsavedEdits = this.isEditEnabled = false;
			},
			setConnectionDetails: function(data) {
				this.connectionDetails = data;
				this.hasUnsavedEdits = false;
				this.isAddConnectionVisible = false;
			},
			handleInputChange: function(e) {
				this.hasUnsavedEdits = true;
			},
			showAddConnection: function() {
				this.isAddConnectionVisible = true;
				this.connectionDetails = null;
			},
			hideAddConnection: function() {
				this.isAddConnectionVisible = false;
			}
		}
	});
})();
