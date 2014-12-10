define([
	'flight/lib/component',
	'component/mixins/with_auth_token_from_hash',
	'component/mixins/repositories_urls',
	'with-request'
	], function (defineComponent, withAuthTokeFromHash, repositoriesURLs, withRequest) {
		return defineComponent(prioritizationManager, withAuthTokeFromHash, repositoriesURLs, withRequest);

		function prioritizationManager() {

			this.changePriority = function(movedToTrackName , params){
				var newPriority ;
				if( Number(params.nextElement.priority) === 0) {
					newPriority = Number(params.previousElement.priority) + 1;
				}else{
					newPriority = (Number(params.previousElement.priority)  + Number(params.nextElement.priority) ) / 2 ;
				}

				var eventCallback = { eventCallback : 'ui:got:issues' };
				params.element.priority = newPriority;
				this.trigger(document,'data:issue:priorityChanged', params.element );
				this.trigger(document, 'data:needs:issues', eventCallback);
			};

			this.savePriority = function(event, issues){
				var itemKey = 'issues-' + issues.track;

				var issuesString = JSON.stringify(issues.issues);
				this.put({
					url: 'priorities',
					data: JSON.stringify(issues),
					contentType: "application/json"
				});
			};

			this.loadPriority = function(event){

				var getIssues = function(track) {
					this.get({
					    url: '/priorities?track=' + track,
					    success: function (data) {
					    	this.trigger(document,'data:got:priority', data);
					    }
					});
				}.bind(this);

				var issue0 = getIssues('0 - Backlog');
				var issue1 = getIssues('1 - Ready');
				var issue2 = getIssues('2 - Development');
				var issue3 = getIssues('3 - Quality Assurance');
			};



			this.after('initialize', function () {
				this.on('data:issues:issueMoved', this.changePriority);
				this.on('data:issues:priorityChanged', this.changePriority);
				this.on('ui:got:issues', this.savePriority);
				this.on('ui:needs:priority', this.loadPriority);
			});
		}
	}
	);


