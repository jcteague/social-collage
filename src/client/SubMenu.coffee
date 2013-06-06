define	 ["jquery"], ($) ->
	class SubMenu
		constructor: (@selector) ->

		show: () ->
				$(@selector).show()
		hide: () ->
			$(@selector).hide()