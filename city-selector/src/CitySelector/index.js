require('./style.less');
// Your code...
const $ = require('jquery');

class CitySelector {
    constructor(params) {
        this.$element     = $(`#${params.elementId}`);
        this.regionsUrl    = params.regionsUrl;
        this.localitiesUrl = params.localitiesUrl;
        this.saveUrl       = params.saveUrl;
        this.$infoRegion   = $(`#${params.infoRegionId}`);
        this.$infoLocation = $(`#${params.infoLocationId}`);

        this.regionBtnId = 'region-btn';
        this.regionItemClass = 'region-select-js';
        this.locationItemClass = 'location-select-js';
        this.submitBtnId = 'save-btn';

        this.initElements();
    }

    initElements() {
        this.$element
            .html(`<button id="${this.regionBtnId}">Select region</button>`)
            .on('click', `#${this.regionBtnId}`, this.fetchRegions.bind(this))
            .on('click', `.${this.regionItemClass}`, this.selectRegion.bind(this))
            .on('click', `.${this.locationItemClass}`, this.selectLocation.bind(this))
            .on('click', `#${this.submitBtnId}`, this.submitSelectedData.bind(this))
        ;
    }

    fetchRegions() {
        this.sendAjaxRequest(this.regionsUrl).then(response => {
            this.$element
                .html(
                    '<div class="regions">' +
                        response.reduce((result, current) => {
                            return result + `<p class="regions__item ${this.regionItemClass}" data-id=${current.id}>${current.title}</p>`;
                        }, '') +
                    '<div/>'
                );
        });
    }

    selectRegion(event) {
        const regionId = $(event.currentTarget).data('id');
        this.$infoRegion.html(regionId);
        this.fetchLocations(regionId);
    }

    fetchLocations(id) {
        let appendLocations = function (locations, locationItemClass) {
            return '<div class="locations">' +
                locations.reduce((result, current) => {
                    return result + `<p class="locations__item ${locationItemClass}" data-name=${current}>${current}</p>`;
                }, '') +
                '<div/>';
        };
        this.sendAjaxRequest(this.localitiesUrl, 'GET', {id: id}).then(response => {
            if (this.$element.children('.locations:first').length) {
                this.$element.children('.locations:first').html(
                    appendLocations(response.shift().list, this.locationItemClass)
                );
            } else {
                this.$element
                    .append(
                        appendLocations(response.shift().list, this.locationItemClass)
                    );
            }
        });
    }

    selectLocation(event) {
        const locationName = $(event.currentTarget).data('name');
        this.$infoLocation.html(locationName);
        if (!this.$element.children(`#${this.submitBtnId}`).length) {
            this.$element.append(`<button id="${this.submitBtnId}">Save</button>`);
        }
    }

    submitSelectedData() {
        const data = {
            'region': this.$infoRegion.html(),
            'locality': this.$infoLocation.html()
        };
        this.sendAjaxRequest(this.saveUrl, 'POST', data).then(response => {
            alert(JSON.stringify(response));
        });
    }

    sendAjaxRequest(url, type, params) {
        if (type === undefined) {
            params = 'GET';
        }
        if (params === undefined) {
            params = {};
        }
        return $.ajax(url, {
            dataType: 'json',
            type: type,
            data: params
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert('Error on Ajax request');
            console.log('Error' . errorThrown);
        });
    }
}

module.exports = CitySelector;
