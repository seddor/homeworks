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

        this.$emptyContainer = this.$element.clone();

        this.regionBtnId       = 'region-btn';
        this.regionItemClass   = 'js-region-select';
        this.locationItemClass = 'js-location-select';
        this.submitBtnId       = 'save-btn';

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
                    '<div class="container-list regions">' +
                        response.reduce((result, current) => {
                            return result + `<p class="container-list__item regions__item ${this.regionItemClass}" data-id=${current.id}>${current.title}</p>`;
                        }, '') +
                    '<div/>'
                );
        });
    }

    selectRegion(event) {
        const
            $currentTarget = $(event.currentTarget),
            regionId = $currentTarget.data('id');
        $(`.${this.regionItemClass}`).removeClass('_active');
        $currentTarget.addClass('_active');
        $(document).trigger({
            'type': 'region_changed',
            'region_id': regionId
        });
        this.fetchLocations(regionId);
    }

    fetchLocations(id) {
        let appendLocations = function (locations, locationItemClass) {
            return '<div class="container-list locations">' +
                locations.reduce((result, current) => {
                    return result + `<p class="container-list__item locations__item ${locationItemClass}" data-name=${current}>${current}</p>`;
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
        const
            $currentTarget = $(event.currentTarget),
            locationName = $currentTarget.data('name');
        $(document).trigger({
            'type': 'location_changed',
            'location_name': locationName
        });
        $(`.${this.locationItemClass}`).removeClass('_active');
        $currentTarget.addClass('_active');
        if (!this.$element.find(`#${this.submitBtnId}`).length) {
            this.$element.append(
                `<div class="container-list">
                    <button class="btn" id="${this.submitBtnId}">Save</button>
                </div>`);
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

    sendAjaxRequest(url, type = 'GET', params = {}) {
        return $.ajax(url, {
            dataType: 'json',
            type: type,
            data: params,
            beforeSend: function () {
                $(document).loading('show');
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert('Error on Ajax request');
            console.log('Error' . errorThrown);
        }).always(function () {
            $(document).loading('hide');
        });
    }

    destroy() {
        this.$element.replaceWith(this.$emptyContainer);

        $(document).triggerHandler('citySelector:destroy');
    }
}

module.exports = CitySelector;
