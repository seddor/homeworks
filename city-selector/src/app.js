const CitySelector = require('./CitySelector');
const $ = require('jquery');

$('#createCitySelector').on('click', function () {
    const citySelector = new CitySelector({
        elementId: 'citySelector',
        regionsUrl: 'http://localhost:3000/regions',
        localitiesUrl: 'http://localhost:3000/localities',
        saveUrl: 'http://localhost:3000/selectedRegions',
        infoRegionId: 'regionText',
        infoLocationId: 'localityText'
    });

    $('#info').show();
});

// $('#destroyCitySelector').on('click', function () {
//     $(citySelector).detach();
// });

