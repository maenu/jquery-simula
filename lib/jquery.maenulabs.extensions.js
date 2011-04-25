/**
 * jQuery extensions.
 *
 * @author
 *     Manuel Leuenberger
 */

(function($, undefined) {
	
	/**
	 * Checks if the other's DOM element is the same as the calling one.
	 * 
	 * @param other
	 *     A jQuery object
	 *
	 * @return
	 *     true, if the DOM elements are the same, false otherwise
	 */
	$.fn.equals = function(other) {
		return $(this).get(0) == other.get(0);
	};
	
}(jQuery));

(function($, undefined) {
	
	var check = false;
	var isRelative = true;
	
	/**
	 * Gets the DOM element from point, as in the W3C description.
	 *
	 * @param clientX
	 *     The clientX coordinate
	 * @param clientY
	 *     The clientY coordinate
	 *
	 * @return
	 *     The DOM element, if present. Null if not supported by browser
	 */
	 $.elementFromPoint = function(clientX, clientY) {
		// return null for unsupported browsers
		if (!document.elementFromPoint) {
			return null;
		}
		
		// check behaviour of elementFromPoint
		if (!check) {
			check = true;
			var scrollTop = $(document).scrollTop();
			var scrollLeft = $(document).scrollLeft();
			if (scrollTop > 0) {
				isRelative = (document.elementFromPoint(
					0,
					scrollTop + $(window).height() - 1
				) == null);
			} else if (scrollLeft >0) {
				isRelative = (document.elementFromPoint(
					scrollLeft + $(window).width() - 1,
					0
				) == null);
			} else {
				check = false;
			}
		}
		
		// adjust if browser implements elementFromPoint incorrectly
		if (!isRelative) {
			clientX += $(document).scrollLeft();
			clientY += $(document).scrollTop();
		}
		
		return document.elementFromPoint(clientX, clientY);
	};
	
}(jQuery));

(function($, undefined) {
	
	/**
	 * Check if the specified child is a child.
	 *
	 * @param child
	 *     A jQuery object that may be a child of the parent
	 *
	 * @return
	 *     true, if the specified child is really a child of the parent, false
	 *     otherwise
	 */
	$.fn.isParentOf = function(child) {
		var current = $(child);
		while (current.get(0) && !$(this).equals(current)) {
			current = current.parent();
		}
		return !$(this).equals(child) && $(this).equals(current);
	};
	
}(jQuery));