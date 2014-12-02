define([
	'flight/lib/component',
	'component/mixins/with_auth_token_from_hash',
	'component/mixins/repositories_urls'
	], function (defineComponent, withAuthTokeFromHash, repositoriesURLs) {
		return defineComponent(prioritizationManager, withAuthTokeFromHash, repositoriesURLs);

		function prioritizationManager() {

			this.changePriority = function(movedToTrackName , params){
				var newPriority = (Number(params.previousElement.priority)  + Number(params.nextElement.priority) ) / 2 ;
				params.element.priority = newPriority;
				this.trigger(document,'data:issue:priorityChanged', params.element );
			};


			this.after('initialize', function () {
				this.on('data:issues:issueMoved', this.changePriority);
			});
		}
	}
	);