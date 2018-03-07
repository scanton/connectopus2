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
								<input type="text" name="ssh-host" v-on:change="handleInputChange" v-bind:value="connectionDetails.host" />
							</div>
							<div class="input-group">
								<span class="input-group-addon">Port</span>
								<input type="text" name="ssh-port" v-on:change="handleInputChange" v-bind:value="connectionDetails.port" />
							</div>
							<div class="input-group">
								<span class="input-group-addon">Username</span>
								<input type="text" name="ssh-username" v-on:change="handleInputChange" v-bind:value="connectionDetails.username" />
							</div>
							<div class="input-group">
								<span class="input-group-addon">Password</span>
								<input type="password" name="ssh-password" v-on:change="handleInputChange" v-bind:value="connectionDetails.password" />
							</div>
							<div class="panel panel-default">
								<div class="panel-heading">
									<h3 class="panel-title">Database Connections</h3>
								</div>
								<div class="panel-body">
									<div class="panel panel-default">
										<div class="panel-heading">
											<h4 class="panel-title">{{connectionDetails.connections[0].name}}</h4>
										</div>
										<div class="panel-body">
											<div class="input-group">
												<span class="input-group-addon">Host</span>
												<input type="text" name="mysql-host" v-bind:value="connectionDetails.connections[0].host" v-on:change="handleInputChange" />
											</div>
											<div class="input-group">
												<span class="input-group-addon">Database Name</span>
												<input type="text" name="mysql-database" v-bind:value="connectionDetails.connections[0].database" v-on:change="handleInputChange" />
											</div>
											<div class="input-group">
												<span class="input-group-addon">Userame</span>
												<input type="text" name="mysql-username" v-bind:value="connectionDetails.connections[0].username" v-on:change="handleInputChange" />
											</div>
											<div class="input-group">
												<span class="input-group-addon">Password</span>
												<input type="password" name="mysql-password" v-bind:value="connectionDetails.connections[0].password" v-on:change="handleInputChange" />
											</div>
											<button class="btn btn-success pull-right connect-to-db-button" title="connect"><span class="glyphicon glyphicon-link"></span> Connect</button>
										</div>
									</div>
								</div>
							</div>
						</form>
						<button v-show="hasUnsavedEdits" class="btn btn-warning pull-right update-connection-data-button">Update Connection Data</button>
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
				isAddConnectionVisible: false
			}
		},
		methods: {
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
