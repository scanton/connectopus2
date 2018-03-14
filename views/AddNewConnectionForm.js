(function() {
	var componentName = 'add-new-connection-form';
	var s = `
		<div class="add-new-connection-form container-fluid">
			<div class="row">
				<div class="col-xs-12">
					<h3>Add New Connection</h3>
					<form>
						<div class="input-group">
							<span class="input-group-addon">Name</span>
							<input type="text" name="name" />
						</div>
						<div class="input-group" v-bind:class="{'is-not-selected': isNotSelected()}">
							<span class="input-group-addon">Connection Type</span>
							<div class="dropdown">
								<button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
									{{connectionType}}
									<span class="caret"></span>
								</button>
								<ul v-on:click="handleConnectionTypeChange" class="dropdown-menu">
									<li><a href="#">Local Directory</a></li>
									<li><a href="#">Remote (SFTP)</a></li>
									<!--
									<li><a href="#">Git (local)</a></li>
									<li><a href="#">Git Clone (remote)</a></li>
									-->
								</ul>
							</div>
						</div>
						<div class="input-collection-div" v-show="connectionType != 'select connection type'">
							<div class="input-group" v-show="connectionType == 'Local Directory' || connectionType == 'Git (local)'">
								<span class="input-group-addon">Directory Path</span>
								<input type="file" webkitdirectory name="directory-path" />
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
								<input type="text" name="ssh-port" />
							</div>
							<div class="input-group" v-show="connectionType == 'Remote (SFTP)'">
								<span class="input-group-addon">Root Directory</span>
								<input type="text" name="ssh-root-directory" value="" placeholder="www" />
							</div>
							<div class="input-group" v-show="connectionType == 'Git Clone (remote)' || connectionType == 'Remote (SFTP)'">
								<span class="input-group-addon">Username</span>
								<input type="text" name="ssh-username" />
							</div>
							<div class="input-group" v-show="connectionType == 'Git Clone (remote)' || connectionType == 'Remote (SFTP)'">
								<span class="input-group-addon">Password</span>
								<input type="password" name="ssh-password" />
							</div>
								<div class="panel panel-default">
									<div class="panel-heading">
										<h4 class="panel-title">{{databaseType}}</h4>
									</div>
									<div class="panel-body">	
										<div class="input-group" v-bind:class="{'is-not-selected': isDatabaseNotSelected()}">
											<span class="input-group-addon">Data Type</span>
											<div class="dropdown">
												<button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
													{{databaseType}}
													<span class="caret"></span>
												</button>
												<ul v-on:click="handleDatabaseTypeChange" class="dropdown-menu">
													<li><a href="#">MySQL</a></li>
													<li><a href="#">JSON file</a></li>
													<li><a href="#">REST Endpoint</a></li>
													<!--
													<li><a href="#">PostgreSQL</a></li>
													<li><a href="#">MongoDB</a></li>
													<li><a href="#">MS SQL Server</a></li>
													<li><a href="#">Excel Spreadsheet</a></li>
													-->
												</ul>
											</div>
										</div>
										<div class="input-collection-div" v-show="databaseType != 'select database type'">
											<div class="input-group">
												<span class="input-group-addon">Name</span>
												<input name="db-connection-name" />
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
								</div>
							<button v-on:click="handleAddNewConnection" class="btn btn-success pull-right panel-button">Add New Connection</button>
							<div class="clear"></div>
						</div>
					</form>
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
				connectionType: 'select connection type',
				databaseType: 'select database type',
				verb: 'GET'
			}
		},
		methods: {
			isNotSelected: function() {
				return this.connectionType == 'select connection type';
			},
			isDatabaseNotSelected: function() {
				return this.databaseType == 'select database type';
			},
			handleConnectionTypeChange: function(e) {
				e.preventDefault();
				this.connectionType = $(e.target).text();
			},
			handleDatabaseTypeChange: function(e) {
				e.preventDefault();
				this.databaseType = $(e.target).text();
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
				var input = $("input[name='directory-path']");
				if(input && input[0] && input[0].files && input[0].files[0]) {
					o['ssh-root-directory'] = input[0].files[0].path;
				}
				var input = $("input[name='db-connection-file']");
				if(input && input[0] && input[0].files && input[0].files[0]) {
					o['db-connection-file'] = input[0].files[0].path;
				}
				controller.addNewConnection(o);
			},
			handleRestVerbChange: function(e) {
				e.preventDefault();
				this.verb = $(e.target).text();
			}
		}
	});
})();
