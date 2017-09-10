(function ($) {
    var directorySlider = function (element, options, imageNames) {

        var images = JSON.parse(imageNames);
        var date = [];
        var elem = $(element),
            obj = this,
            elemId = elem[0].id;

        var config = $.extend({
            animation: 'slide',
            filebase: 'andrew',
            speed: 1500,
            timeout: 4000,
            directory: 'https://s3.amazonaws.com/pumpkinpihub/'
        }, options || {});

        $(elem).css('display', 'block');
        $(elem).css('overflow', 'hidden');

        images.forEach(function(item){
          date.push(item.name.replace('.jpg',''));
        })

        var slides = [],
            slideNumber = 0;

        while (slideNumber < 3) {
          if(images[slideNumber] != null){
            var slide = config.directory + images[slideNumber].name;
            slides.push('<div class="col-lg-12 center-block"><h2 class="center-block" style="visibility: hidden;">' +
              images[slideNumber].name.replace('.jpg', '') +
              '</h2><img src=" ' + slide + '" /></div>');
            slideNumber++;
          } else {
            break;
          }
        }
        slides.reverse();

        var slideWrap = $('<div class="' + elemId + '-slide-wrap col-lg-12" ></div>');
        slideWrap.appendTo(elem);

        $.each(slides, function (index, val) {
            $(val).css({
                position: 'absolute',
                width: '100%'
            }).appendTo(slideWrap);
        });
        var index = 2;
        setInterval(function () {

            var firstSlide = elem.find('div:first-child')[1],
                middleSlide = elem.find('div:nth-child(1)'),
                lastSlide = elem.find('div:last-child')[1];

                $(middleSlide).children('h2').css('visibility', 'hidden');
            $(lastSlide).animate({
                    opacity: 0
                },
                config.speed, function () {
                    $(this).children('h2').css('visibility', 'visible');
                    $(firstSlide).children('h2').css('visibility', 'hidden');
                    $(this).insertBefore(firstSlide).css({
                        opacity: 1,
                        position: 'absolute'

                    });

                    if (index >= images.length)
                        index = 0;

                    firstSlide.childNodes[0].childNodes[0].data == date[index];
                   firstSlide.childNodes[1].src = config.directory + images[index].name;

                    index++;
                });

        }, config.timeout);

    };

    $.fn.directorySlider = function (options, imageNames) {
        return this.each(function () {
            var element = $(this);

            // Return early if this element already has a plugin instance
            if (element.data('directoryslider')) return;

            // pass options to plugin constructor
            var directoryslider = new directorySlider(this, options, imageNames);

            // Store plugin object in this element's data
            element.data('directoryslider', directoryslider);

        });
    };
})(jQuery);

var time = '11:00 am';


$('.dropdown-menu li > a').click(function(e){
    time = $(this).text();
    getImageData(time);
    $('#time').text(time);
});
function getImageData(time) {
    $.get('/api/imageData?time=' + time, function (data) {
        $('#slideshow').directorySlider(null, data);
    });
};
