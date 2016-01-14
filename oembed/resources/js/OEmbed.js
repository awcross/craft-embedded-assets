(function($, Craft)
{
	/**
	 * OEmbed Class (Singleton)
	 */
	var OEmbed = new (Garnish.Base.extend({

		init: function()
		{
			var that = this;
			var fn = Craft.AssetIndex.prototype;
			var superInit = fn.init;

			fn.init = function()
			{
				superInit.apply(this, arguments);

				that.initEmbedButton(this);
			};
		},

		parseUrl: function(url)
		{
			var params = {
				url: url
			};

			Craft.postActionRequest('oEmbed/parseUrl', params, $.proxy(function(response, textStatus)
			{
				if(textStatus == 'success')
				{
					if(response.success)
					{
						this.trigger('parseUrl', {
							media: response.media
						})
					}
					else
					{
						Craft.cp.displayError(response.error);
					}
				}
				else
				{
					Craft.cp.displayError(Craft.t('An unknown error occurred.'));
				}
			}, this));
		},

		initEmbedButton: function(assetIndex)
		{
			var $header = $('#extra-headers');
			var $buttons = assetIndex.$uploadButton.parent();
			var $buttonGroup = $('<div class="btngroup">').appendTo($header);

			assetIndex.$uploadButton.appendTo($buttonGroup);
			assetIndex.$uploadInput.appendTo($buttonGroup);
			$buttons.remove();

			var $embedButton = $('<div class="btn submit" data-icon="field">')
				.text(Craft.t('Embed link'))
				.appendTo($buttonGroup);

			this.addListener($embedButton, 'click', 'openEmbedModal');
		},

		openEmbedModal: function()
		{
			var modal = new OEmbed.EmbedModal();

			modal.show();
		}

	}))();

	window.OEmbed = OEmbed;

})(jQuery, Craft);
