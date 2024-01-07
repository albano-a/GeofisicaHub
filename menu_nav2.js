$(document).ready(function() {
    var eventType = ('ontouchstart' in window) ? 'touchstart' : 'click';

    $('#menu li:has(ul)').on(eventType, function(e) {
        e.stopPropagation();
        var submenu = $(this).find('ul');

        if ($(this).hasClass('open')) {
            $(this).removeClass('open');
            submenu.slideUp(200);
        } else {
            $(this).addClass('open');
            submenu.slideDown(200);
        }
    });
});
