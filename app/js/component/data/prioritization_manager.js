define([
	'flight/lib/component',
	'component/mixins/with_auth_token_from_hash',
	'component/mixins/repositories_urls'
	], function (defineComponent, withAuthTokeFromHash, repositoriesURLs) {
		return defineComponent(prioritizationManager, withAuthTokeFromHash, repositoriesURLs);

		function prioritizationManager() {

			this.changePriority = function(movedToTrackName , params){
				var newPriority ;
				if( Number(params.nextElement.priority) === 0) {
					newPriority = Number(params.previousElement.priority) + 1; 
				}else{
					newPriority = (Number(params.previousElement.priority)  + Number(params.nextElement.priority) ) / 2 ;
				}

				var eventCallback = { eventCallback : "ui:got:issues" } ;
				params.element.priority = newPriority;
				this.trigger(document,'data:issue:priorityChanged', params.element );
				this.trigger(document, 'data:needs:issues', eventCallback);
			};


			this.savePriority = function(event,issues){

				localStorage.setItem("issues", issues);
			};



			this.after('initialize', function () {
				this.on('data:issues:issueMoved', this.changePriority);
				this.on('data:issues:priorityChanged', this.changePriority);
				this.on('ui:got:issues', this.savePriority);
			});
		}
	}
	);