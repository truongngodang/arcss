(function ($) {
    // USE STRICT
    "use strict";

    // Global variables
    var html_body = $('html, body');


    //-------------------------------------------------------
    // Config Library
    //-------------------------------------------------------

    // Config Slick
    var slick_object = $('.js-slick');
    slick_object.each(function () {
        var option = {
            accessibility: true,
            adaptiveheight: false,
            autoplay: false,
            autoplayspeed: 5000,
            arrows: false,
            asnavfor: null,
            appendarrows: $(this),
            appenddots: $(this),
            prevarrow: '<button type="button" class="slick-prev">Previous</button>',
            nextarrow: '<button type="button" class="slick-next">Next</button>',
            centermode: false,
            centerpadding: '50px',
            cssease: 'ease',
            dots: false,
            dotsclass: 'slick-dots',
            draggable: true,
            fade: false,
            speed: 500,
            pauseonhover: false,
            lg: 1, md: this.lg, sm: this.md, xs: this.sm,
            vertical: false,
            loop: true,
            thumb: false

        };

        for (var k in option) {
            if (option.hasOwnProperty(k)) {
                if ($(this).attr('data-slick-' + k) != null) {
                    option[k] = $(this).data('slick-' + k);
                }
            }
        }

        if (option.thumb)
            $(this).slick({
                accessibility: option.accessibility,
                adaptiveHeight: option.adaptiveheight,
                autoplay: option.autoplay,
                autoplaySpeed: option.autoplayspeed,
                arrows: option.arrows,
                asNavFor: option.asnavfor,
                appendArrows: option.appendarrows,
                appendDots: option.appenddots,
                prevArrow: option.prevarrow,
                nextArrow: option.nextarrow,
                centerMode: option.centermode,
                centerPadding: option.centerpadding,
                cssease: option.cssease,
                dots: option.dots,
                dotsClass: option.dotsclass,
                draggable: option.draggable,
                pauseOnHover: option.pauseonhover,
                fade: option.fade,
                vertical: option.vertical,
                slidesToShow: option.lg,
                infinite: option.loop,
                swipeToSlide: true,
                customPaging: function(slick, index) {
                    var portrait = $(slick.$slides[index]).data('thumb');
                    return '<img src=" ' + portrait + ' "/><div class="bg-overlay"></div>';
                },

                responsive: [
                    {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: option.lg
                        }
                    },
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: option.md
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: option.sm
                        }
                    },
                    {
                        breakpoint: 576,
                        settings: {
                            slidesToShow: option.xs,
                            fade: false
                        }
                    }
                ]
            });
        else
            $(this).slick({
                accessibility: option.accessibility,
                adaptiveHeight: option.adaptiveheight,
                autoplay: option.autoplay,
                autoplaySpeed: option.autoplayspeed,
                arrows: option.arrows,
                asNavFor: option.asnavfor,
                appendArrows: option.appendarrows,
                appendDots: option.appenddots,
                prevArrow: option.prevarrow,
                nextArrow: option.nextarrow,
                centerMode: option.centermode,
                centerPadding: option.centerpadding,
                cssease: option.cssease,
                dots: option.dots,
                dotsClass: option.dotsclass,
                draggable: option.draggable,
                pauseOnHover: option.pauseonhover,
                fade: option.fade,
                vertical: option.vertical,
                slidesToShow: option.lg,
                infinite: option.loop,
                swipeToSlide: true,

                responsive: [
                    {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: option.lg
                        }
                    },
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: option.md
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: option.sm
                        }
                    },
                    {
                        breakpoint: 576,
                        settings: {
                            slidesToShow: option.xs,
                            fade: false
                        }
                    }
                ]
            });

        $(this).on('init', function() {
            var $firstAnimatingElements = $('div.hero-slide:first-child').find('[data-animation]');
            doAnimations($firstAnimatingElements);
        });
        $(this).on('beforeChange', function(e, slick, currentSlide, nextSlide) {
            var $animatingElements = $(this).find('[data-slick-index="' + nextSlide + '"]').find('[data-animation]');
            doAnimations($animatingElements);
        });


        function doAnimations(elements) {
            var animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            elements.each(function() {
                var $this = $(this);
                var $animationDelay = $this.data('animation-delay');
                var $animationType = 'animated ' + $this.data('animation');
                $this.css({
                    'animation-delay': $animationDelay,
                    '-webkit-animation-delay': $animationDelay
                });
                $this.addClass($animationType).one(animationEndEvents, function() {
                    $this.removeClass($animationType);
                });
            });
        }
    });

    // Config Animsition
    var preloader_object = $('.js-preloader')
    preloader_object.animsition({
        inClass: 'fade-in',
        outClass: 'fade-out',
        inDuration: 800,
        outDuration: 800,
        linkElement: 'a:not([target="_blank"]):not([href^="#"]):not([class^="chosen-single"])',
        loading: true,
        loadingParentElement: 'html',
        loadingClass: 'loader-wrapper',
        loadingInner: '<div class="loader"></div>',
        timeout: false,
        timeoutCountdown: 5000,
        onLoadEvent: true,
        browser: [ 'animation-duration', '-webkit-animation-duration'],
        overlay : false,
        overlayClass : 'animsition-overlay-slide',
        overlayParentElement : 'html',
        transition: function(url){ window.location.href = url; }
    });

    //-------------------------------------------------------
    // Theme JS
    //-------------------------------------------------------


    // Back To Top
    var btt_object = $(".js-btt");
    var btt_offset = 450, btt_duration = 500;
    btt_object.hide();
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > btt_offset) {
            btt_object.fadeIn(btt_duration);
        } else {
            btt_object.fadeOut(btt_duration);
        }
    });
    btt_object.on('click', function (event) {
        event.preventDefault();
        $('html, body').animate({scrollTop: 0}, btt_duration);
        return false;
    });

})(jQuery);
