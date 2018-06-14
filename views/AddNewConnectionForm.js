(function() {
	var componentName = 'add-new-connection-form';
	var s = `
		<div class="add-new-connection-form container-fluid">
			<div class="row">
				<table>
					<tr>
						<td valign="top" align="center">
							<h3>{{name}}</h3>
						</td>
						<td valign="top">
							<div class="col-xs-12">
								<form>
									<div class="text-center">
										<radio-set v-on:change-value="handleTypeChange" label="Connection Type" v-bind:selectedOption="connectionType" v-bind:options="['Local Directory', 'Remote (SFTP)']"></radio-set>
									</div>
									<div class="input-group">
										<span class="input-group-addon">Name</span>
										<input v-on:change="handleNameChange" type="text" name="name" placeholder="(e.g. MyWebsite.com in Production)" />
									</div>
									<div class="input-collection-div" v-show="connectionType != 'select connection type'">
										<div class="input-group" v-show="connectionType == 'Local Directory' || connectionType == 'Git (local)'">
											<span class="input-group-addon">Directory Path</span>
											<directory-selector name="directory-path"></directory-selector>
										</div>
										<div class="input-group" v-show="connectionType == 'Remote (SFTP)'">
											<span class="input-group-addon">Host</span>
											<input type="text" name="ssh-host" />
										</div>
										<div class="input-group" v-show="connectionType == 'Git Clone (remote)'">
											<span class="input-group-addon">URI</span>
											<input type="text" name="uri" />
										</div>
										<div class="input-group" v-show="connectionType == 'Remote (SFTP)'">
											<span class="input-group-addon">Port</span>
											<input type="text" name="ssh-port" placeholder="(optional)" />
										</div>
										<div class="input-group" v-show="connectionType == 'Remote (SFTP)'">
											<span class="input-group-addon">Root Directory</span>
											<input type="text" name="ssh-root-directory" value="" placeholder="(e.g. www)" />
										</div>
										<div class="input-group" v-show="connectionType == 'Git Clone (remote)' || connectionType == 'Remote (SFTP)'">
											<span class="input-group-addon">Username</span>
											<input type="text" name="ssh-username" />
										</div>
										<div class="input-group" v-show="connectionType == 'Git Clone (remote)' || connectionType == 'Remote (SFTP)'">
											<span class="input-group-addon">Password</span>
											<input type="password" name="ssh-password" />
										</div>

										<div v-show="isDatabaseEnabled">
											<div class="text-center">
												<radio-set v-on:change-value="handleDatabaseTypeChange" label="Database Type" v-bind:selectedOption="databaseType" v-bind:options="supportedDatabaseTypes"></radio-set>
											</div>
											
											<div class="input-collection-div" v-show="databaseType != 'None'">
												<div class="input-group database-connection-name">
													<span class="input-group-addon">Name</span>
													<input name="db-connection-name" placeholder="(e.g. MySQL on MyWebsite.com)" />
												</div>
												<div class="input-group" v-show="databaseType == 'MySQL' || databaseType == 'MS SQL Server' || databaseType == 'PostgreSQL' || databaseType == 'MongoDB'">
													<span class="input-group-addon">Host</span>
													<input name="db-connection-host" />
												</div>
												<div class="input-group" v-show="databaseType == 'MySQL' || databaseType == 'MS SQL Server' || databaseType == 'PostgreSQL' || databaseType == 'MongoDB'">
													<span class="input-group-addon">Database Name</span>
													<input name="db-connection-database" />
												</div>
												<div class="input-group" v-show="databaseType == 'MySQL' || databaseType == 'MS SQL Server' || databaseType == 'PostgreSQL' || databaseType == 'MongoDB'">
													<span class="input-group-addon">Username</span>
													<input name="db-connection-username" />
												</div>
												<div class="input-group" v-show="databaseType == 'MySQL' || databaseType == 'MS SQL Server' || databaseType == 'PostgreSQL' || databaseType == 'MongoDB'">
													<span class="input-group-addon">Password</span>
													<input type="password" name="db-connection-password" />
												</div>
												<div class="input-group" v-show="databaseType == 'REST Endpoint'">
													<span class="input-group-addon">URI</span>
													<input name="db-connection-uri" />
												</div>
												<div class="input-group" v-show="databaseType == 'REST Endpoint'">
													<span class="input-group-addon">Verb</span>
													<div class="dropdown">
														<button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
															{{verb}}
															<span class="caret"></span>
														</button>
														<ul v-on:click="handleRestVerbChange" class="dropdown-menu">
															<li><a href="#">GET</a></li>
															<li><a href="#">PUT</a></li>
															<li><a href="#">POST</a></li>
															<li><a href="#">DELETE</a></li>
														</ul>
													</div>
												</div>
												<div class="input-group" v-show="databaseType == 'REST Endpoint'">
													<span class="input-group-addon">Arguments</span>
													<input name="db-connection-rest-args" />
												</div>
												<div class="input-group" v-show="databaseType == 'JSON file' || databaseType == 'Excel Spreadsheet'">
													<span class="input-group-addon">File</span>
													<input type="file" webkitdirectory name="db-connection-file" />
												</div>
											</div>
										</div>

										<button v-on:click="handleAddNewConnection" class="btn btn-success pull-right panel-button">Add New Connection</button>
										<div class="clear"></div>
									</div>
								</form>
							</div>
						</td>
					</tr>
				</table>
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
				connectionType: 'Local Directory',
				databaseType: 'None',
				verb: 'GET',
				name: 'Add New Connection',
				supportedDatabaseTypes: controller.getSupportedDatabaseTypes(),
				isDatabaseEnabled: false
			}
		},
		methods: {
			handleNameChange: function(e) {
				var val = $(e.target).val();
				if(val && val.length) {
					this.name = $(e.target).val();
				} else {
					this.name = "Add New Connection";
				}
			},
			handleTypeChange: function(type) {
				this.connectionType = type;
			},
			handleDatabaseTypeChange: function(value) {
				this.databaseType = value;
			},
			handleAddNewConnection: function(e) {
				e.preventDefault();
				var o = {};
				var data = $(".add-new-connection-form").find("form").serializeArray();
				for (var i = 0; i < data.length; i++){
					o[data[i]['name']] = data[i]['value'];
				}
				o.connectionType = this.connectionType;
				o.databaseType = this.databaseType;
				o['db-connection-rest-verb'] = this.verb;
				var input = $("input[name='directory-path']");
				if(input && input[0] && input[0].files && input[0].files[0]) {
					o['directory-path'] = input[0].files[0].path;
				}
				var input = $("input[name='db-connection-file']");
				if(input && input[0] && input[0].files && input[0].files[0]) {
					o['db-connection-file'] = input[0].files[0].path;
				}
				controller.addNewConnection(o);
				$(".add-new-connection-form").find("input").val("");
			},
			handleRestVerbChange: function(e) {
				e.preventDefault();
				this.verb = $(e.target).text();
			},
			isNotSelected: function() {
				return this.connectionType == 'select connection type';
			},
			isDatabaseNotSelected: function() {
				return this.databaseType == 'None';
			},
			setDatabaseOptionsEnabled: function(bool) {
				this.isDatabaseEnabled = bool;
			}
		}
	});
})();
