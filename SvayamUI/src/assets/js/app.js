var APP = function() {
    // PATHS
    // ======================
    this.ASSETS_PATH = './assets/';
    this.SERVER_PATH = this.ASSETS_PATH + 'demo/server/';

    // GLOBAL HELPERS
    // ======================
	this.is_touch_device = function() {
        return !!('ontouchstart' in window) || !!('onmsgesturechange' in window);
	};
};

var APP = new APP();

// APP UI SETTINGS
// ======================

APP.UI = {
	scrollTop: 0, // Minimal scrolling to show scrollTop button
};


// Hide sidebar on small screen
$(window).on('load resize scroll', function () {
    if ($(this).width() < 992) {
        $('body').addClass('sidebar-mini');
    }
});

$(function () {
    // TOGGLE THEME-CONFIG BOX   
    console.log('inside toggle') 
    $('.theme-config-toggle').on('click', function() {
        var configdiv=$(this).parents('.theme-config')[0];
        if($(configdiv).attr('class')=="theme-config"){
            $("#configcloseicon").removeClass("fa fa-cog theme-config-show").addClass("fas fa-times-circle fa-2x")
        }else{
            $("#configcloseicon").removeClass("fas fa-times-circle fa-2x").addClass("fa fa-cog theme-config-show")
        }
        $(this).parents('.theme-config').toggleClass('opened');
    });
    // LAYOUT SETTINGS
    // ======================
    
    // fixed layout
    $('#_fixedlayout').change(function(){
        console.log('inside layout change');
        if( $(this).is(':checked') ) {
           $('body').addClass('fixed-layout');
            $('#sidebar-collapse').slimScroll({
                height: '100%',
                railOpacity: '0.9',
            });
        } else {
            $('#sidebar-collapse').slimScroll({destroy: true}).css({overflow: 'visible', height: 'auto'});
            $('body').removeClass('fixed-layout');
        }
    });

    // fixed navbar
    $('#_fixedNavbar').change(function() {
        if($(this).is(':checked')) $('body').addClass('fixed-navbar');
        else $('body').removeClass('fixed-navbar');
    });
    
    // Boxed layout
    $("[name='layout-style']").change(function(){
        if(+$(this).val()) $('body').addClass('boxed-layout');
        else $('body').removeClass('boxed-layout');
    });

    // THEMES CHANGE
    // ======================

    $('.color-skin-box input:radio').change(function() {
        var val = $(this).val();
        if(val != 'default') {
            if(! $('#theme-style').length ) {
                $('head').append( "<link href='assets/css/themes/"+val+".css' rel='stylesheet' id='theme-style' >" );
            } else $('#theme-style').attr('href', 'assets/css/themes/'+val+'.css');
        } else $('#theme-style').remove();
    });


	// BACK TO TOP
	$(window).scroll(function() {
		if($(this).scrollTop() > APP.UI.scrollTop) $('.to-top').fadeIn();
        else $('.to-top').fadeOut();
	});
	$('.to-top').click(function(e) {
		$("html, body").animate({scrollTop:0},500);
	});

    // Backdrop functional

    $.fn.backdrop = function() {
	    $(this).toggleClass('shined');
	    $('body').toggleClass('has-backdrop');
        return $(this);
	};

    $('.backdrop').click(closeShined);

    function closeShined() {
        $('body').removeClass('has-backdrop');
        $('.shined').removeClass('shined');
    }

});

    

