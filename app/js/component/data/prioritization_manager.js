define([
	'flight/lib/component',
	'component/mixins/with_auth_token_from_hash',
	'component/mixins/repositories_urls',
	'with-request'
	], function (defineComponent, withAuthTokeFromHash, repositoriesURLs, withRequest) {
		'use strict';
		return defineComponent(prioritizationManager, withAuthTokeFromHash, repositoriesURLs, withRequest);

		function prioritizationManager() {

			this.changePriority = function(event , params){
				var newPriority ;
				if( Number(params.nextElement.priority) === 0) {
					newPriority = Number(params.previousElement.priority) + 1;
				}else{
					newPriority = (Number(params.previousElement.priority)  + Number(params.nextElement.priority) ) / 2 ;
				}

				var eventCallback = { eventCallback : 'ui:got:issues' };
				params.element.priority = newPriority;
				var data = { issue : params.element};

				this.trigger(document,'data:issue:priorityChanged', params.element );
				this.savePriority(data);
			};

			this.savePriority = function( data){
				var dataToSend = { 
					project : data.issue.project ,
					issue :  data.issue.id,
					priority : data.issue.priority
				};				

				this.put({
					url: 'priorities',
					data: JSON.stringify(dataToSend),
					contentType: 'application/json'
				});
			};

			this.loadPriority = function(event,projectIdentifiers){

				_.each(projectIdentifiers.projects, function(value, key, list){

					this.get({
						url: '/priorities?project=' + value,
						success: function (data) {
							this.trigger(document,'data:got:priority', data);
						}
					});

				}.bind(this));
				
			};



			this.after('initialize', function () {
				this.on('data:issues:issueMoved', this.changePriority);
				this.on('data:issues:priorityChanged', this.changePriority);
				this.on('ui:needs:priority', this.loadPriority);
			});
		}
	}
	);


