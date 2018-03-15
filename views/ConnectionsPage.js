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
						<form class="edit-connection-details-form">
							<h3 class="span-group">
								<span v-show="!isEditEnabled">{{connectionDetails.name}}</span>
								<input class="title-input-field" v-show="isEditEnabled" type="text" v-show="isEditEnabled" name="name" v-on:keyup="handleInputChange" />
							</h3>
							<div class="input-group" v-show="connectionDetails.connectionType == 'Local Directory' || connectionDetails.connectionType == 'Git (local)'">
								<span class="input-group-addon">Directory Path</span>
								<input type="text" v-show="!isEditEnabled" v-bind:value="connectionDetails.directory" readonly="readonly" />
								<input type="text" v-show="isEditEnabled" name="directory-path" v-on:keyup="handleInputChange" />
							</div>
							<div class="input-group" v-show="connectionDetails.connectionType == 'Git Clone (remote)'">
								<span class="input-group-addon">URI</span>
								<input type="text" v-show="!isEditEnabled" v-bind:value="connectionDetails.uri" readonly="readonly" />
								<input type="text" v-show="isEditEnabled" name="uri" v-on:keyup="handleInputChange" />
							</div>
							<div class="input-group" v-show="connectionDetails.connectionType == 'Remote (SFTP)'">
								<span class="input-group-addon">Host</span>
								<input type="text" v-show="!isEditEnabled" v-bind:value="connectionDetails.host" readonly="readonly" />
								<input type="text" v-show="isEditEnabled" name="ssh-host" v-on:keyup="handleInputChange" />
							</div>
							<div class="input-group" v-show="connectionDetails.connectionType == 'Remote (SFTP)'">
								<span class="input-group-addon">Root Directory</span>
								<input type="text" v-show="!isEditEnabled" v-bind:value="connectionDetails.root" readonly="readonly" />
								<input type="text" v-show="isEditEnabled" name="ssh-root-directory" v-on:keyup="handleInputChange" />
							</div>
							<div class="input-group" v-show="connectionDetails.connectionType == 'Remote (SFTP)'">
								<span class="input-group-addon">Port</span>
								<input type="text" v-show="!isEditEnabled" v-bind:value="connectionDetails.port" readonly="readonly" />
								<input type="text" v-show="isEditEnabled" name="ssh-port" v-on:keyup="handleInputChange" />
							</div>
							<div class="input-group" v-show="connectionDetails.connectionType == 'Remote (SFTP)' || connectionDetails.connectionType == 'Git Clone (remote)'">
								<span class="input-group-addon">Username</span>
								<input type="text" v-show="!isEditEnabled" v-bind:value="connectionDetails.username" readonly="readonly" />
								<input type="text" v-show="isEditEnabled" name="ssh-username" v-on:keyup="handleInputChange" />
							</div>
							<div class="input-group" v-show="connectionDetails.connectionType == 'Remote (SFTP)' || connectionDetails.connectionType == 'Git Clone (remote)'">
								<span class="input-group-addon">Password</span>
								<input type="password" v-show="!isEditEnabled" v-bind:value="connectionDetails.password" readonly="readonly" />
								<input type="password" v-show="isEditEnabled" name="ssh-password" v-on:keyup="handleInputChange" />
							</div>
							<div class="panel panel-default" v-show="connectionDetails.connections[0].name != ''">
								<div class="panel-heading">
									<h3 class="panel-title span-group">
										<span v-show="!isEditEnabled">{{connectionDetails.connections[0].name}}</span>
										<input class="title-input-field" v-show="isEditEnabled" type="text" v-show="isEditEnabled" name="db-connection-name" v-on:keyup="handleInputChange" />
									</h3>
								</div>
								<div class="panel-body">
									<div class="input-group" v-show="connectionDetails.connections[0].type == 'REST Endpoint' || connectionDetails.connections[0].type == 'Git Clone (remote)'">
										<span class="input-group-addon">URI</span>
										<input type="text" v-show="!isEditEnabled" v-bind:value="connectionDetails.connections[0].uri" readonly="readonly" />
										<input type="text" v-show="isEditEnabled" name="db-connection-uri" v-on:keyup="handleInputChange" />
									</div>
									<div class="input-group" v-show="connectionDetails.connections[0].type == 'REST Endpoint'">
										<span class="input-group-addon">Verb</span>
										<input type="text" v-show="!isEditEnabled" v-bind:value="connectionDetails.connections[0]['rest-verb']" readonly="readonly" />
										<input type="text" v-show="isEditEnabled" name="db-connection-rest-verb" v-on:keyup="handleInputChange" />
									</div>
									<div class="input-group" v-show="connectionDetails.connections[0].type == 'REST Endpoint'">
										<span class="input-group-addon">Arguments</span>
										<input type="text" v-show="!isEditEnabled" v-bind:value="connectionDetails.connections[0]['rest-args']" readonly="readonly" />
										<input type="text" v-show="isEditEnabled" name="db-connection-rest-args" v-on:keyup="handleInputChange" />
									</div>
									<div class="input-group" v-show="connectionDetails.connections[0].type == 'JSON file' || connectionDetails.connections[0].type == 'Excel Spreadsheet'">
										<span class="input-group-addon">File</span>
										<input type="text" v-show="!isEditEnabled" v-bind:value="connectionDetails.connections[0].file" readonly="readonly" />
										<input type="text" v-show="isEditEnabled" name="db-connection-file" v-on:keyup="handleInputChange" />
									</div>
									<div class="input-group" v-show="connectionDetails.connections[0].type == 'MySQL' || connectionDetails.connections[0].type == 'MS SQL Server' || connectionDetails.connections[0].type == 'PostgresSQL' || connectionDetails.connections[0].type == 'MongoDB' || connectionDetails.connections[0].type == 'MS SQL Server'">
										<span class="input-group-addon">Host</span>
										<input type="text" v-show="!isEditEnabled" v-bind:value="connectionDetails.connections[0].host" readonly="readonly" />
										<input type="text" v-show="isEditEnabled" name="db-connection-host" v-on:keyup="handleInputChange" />
									</div>
									<div class="input-group" v-show="connectionDetails.connections[0].type == 'MySQL' || connectionDetails.connections[0].type == 'MS SQL Server' || connectionDetails.connections[0].type == 'PostgresSQL' || connectionDetails.connections[0].type == 'MongoDB' || connectionDetails.connections[0].type == 'MS SQL Server'">
										<span class="input-group-addon">Database Name</span>
										<input type="text" v-show="!isEditEnabled" v-bind:value="connectionDetails.connections[0].database" readonly="readonly" />
										<input type="text" v-show="isEditEnabled" name="db-connection-database" v-on:keyup="handleInputChange" />
									</div>
									<div class="input-group" v-show="connectionDetails.connections[0].type == 'MySQL' || connectionDetails.connections[0].type == 'MS SQL Server' || connectionDetails.connections[0].type == 'PostgresSQL' || connectionDetails.connections[0].type == 'MongoDB' || connectionDetails.connections[0].type == 'MS SQL Server'">
										<span class="input-group-addon">Userame</span>
										<input type="text" v-show="!isEditEnabled" v-bind:value="connectionDetails.connections[0].username" readonly="readonly" />
										<input type="text" v-show="isEditEnabled" name="db-connection-username" v-on:keyup="handleInputChange" />
									</div>
									<div class="input-group" v-show="connectionDetails.connections[0].type == 'MySQL' || connectionDetails.connections[0].type == 'MS SQL Server' || connectionDetails.connections[0].type == 'PostgresSQL' || connectionDetails.connections[0].type == 'MongoDB' || connectionDetails.connections[0].type == 'MS SQL Server'">
										<span class="input-group-addon">Password</span>
										<input type="password" v-show="!isEditEnabled" v-bind:value="connectionDetails.connections[0].password" readonly="readonly" />
										<input type="password" v-show="isEditEnabled" name="db-connection-password" v-on:keyup="handleInputChange" />
									</div>
								</div>
							</div>
							<input type="hidden" name="id" v-bind:value="connectionDetails.id" />
							<input type="hidden" name="connectionType" v-bind:value="connectionDetails.connectionType" />
							<input type="hidden" name="databaseType" v-bind:value="connectionDetails.connections[0].type" />
						</form>
						<button v-show="!isEditEnabled" v-on:click="handleOnConnect" class="btn btn-success pull-right panel-button" title="connect"><span class="glyphicon glyphicon-record"></span> Connect</button>
						<button v-show="hasUnsavedEdits" v-on:click="handleUpdateData" class="btn btn-success pull-right panel-button">Update Connection Data</button>
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
				var $form = $(".connections-page").find("form");
				$form.find(".input-group").each(function() {
					var $inputs = $(this).find("input");
					if($inputs.length == 2) {
						$($inputs[1]).val($($inputs[0]).val());
					} 
				});
				$form.find(".span-group").each(function() {
					var $this = $(this);
					var $input = $this.find("input");
					var span = $this.find("span").text();
					$input.val(span);
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
				this.isEditEnabled = false;
			},
			showAddConnection: function() {
				this.isAddConnectionVisible = true;
				this.connectionDetails = null;
			},
			hideAddConnection: function() {
				this.isAddConnectionVisible = false;
			},
			handleInputChange: function(e) {
				this.hasUnsavedEdits = true;
			},
			handleOnConnect: function(e) {
				e.preventDefault();
				controller.connectTo($(".edit-connection-details-form").find("input[name='id']").val());
			},
			handleUpdateData: function(e) {
				e.preventDefault();
				var o = {};
				var data = $(".edit-connection-details-form").serializeArray();
				for (var i = 0; i < data.length; i++){
					o[data[i]['name']] = data[i]['value'];
				}
				controller.updateConnection(o);
				this.disableEdit(e);
			},
			resetView: function() {
				this.connectionDetails = null;
				this.hasUnsavedEdits = false;
				this.isAddConnectionVisible = false;
				this.isEditEnabled = false;
			}
		}
	});
})();
