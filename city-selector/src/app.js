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
            saveUrl: 'http://localhost:3000/selectedRegions',
            infoRegionId: 'regionText',
            infoLocationId: 'localityText'
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
