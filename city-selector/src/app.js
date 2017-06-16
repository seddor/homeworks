const
    CitySelector = require('./CitySelector'),
    $ = require('jquery'),
    $info = $('#info');
let citySelector;

$('#createCitySelector').on('click', function () {
    if(!citySelector) {
        citySelector = new CitySelector({
            elementId: 'citySelector',
            regionsUrl: 'http://localhost:3000/regions',
            localitiesUrl: 'http://localhost:3000/localities',
            saveUrl: 'http://localhost:3000/selectedRegions'
        });
    }

    $info.show();
});

$('#destroyCitySelector').on('click', function() {
    if (citySelector) {
        citySelector.destroy();
        citySelector = null;

        $info
            .hide()
            .find($('span')).text('')
            .end()
            .find($('input')).val('');
    }
});


$(document).on('region_changed', function (ev) {
    if (ev.region_id) {
        $info
            .find('#regionText').html(ev.region_id)
            .end()
            .find('#localityText').html(ev.location_name).empty();
    }
});

$(document).on('location_changed', function (ev) {
    if (ev.location_name) {
        $info.find('#localityText').html(ev.location_name);
    }
});

$.fn.loading = function(state) {
    state = state || 'show';

    if (state === 'show') {
        $('body').append('<div class="js-ajax-loading" id="ajaxloading"><div></div></div>');
    } else {
        $('#ajaxloading').remove();
    }
};

