'use strict';
require('./style.less');
// Your code...
const
    $      = require('jquery'),
    render = require('./render/render');

class CitySelector {
    constructor(params) {
        this.$element     = $(`#${params.elementId}`);
        this.regionsUrl    = params.regionsUrl;
        this.localitiesUrl = params.localitiesUrl;
        this.saveUrl       = params.saveUrl;

        this.$emptyContainer = this.$element.clone();

        this.regionBtnId            = 'region-btn';
        this.regionContainerClass   = 'regions';
        this.regionItemClass        = 'js-region-select';
        this.locationContainerClass = 'locations';
        this.locationItemClass      = 'js-location-select';
        this.submitBtnId            = 'save-btn';
        this.regionField            = 'regionInput';
        this.locationField          = 'locationInput';

        this.initElements();
    }

    initElements() {
        this.$element
            .wrap(render.renderForm('citySelectorForm', this.saveUrl))
            .append(render.renderHiddenInput(this.regionField, 'region'))
            .append(render.renderHiddenInput(this.locationField, 'locality'))
            .append(render.renderButton(this.regionBtnId, 'Select region'))
            .on('click', `#${this.regionBtnId}`, this.fetchRegions.bind(this))
            .on('click', `.${this.regionItemClass}`, this.selectRegion.bind(this))
            .on('click', `.${this.locationItemClass}`, this.selectLocation.bind(this))
        ;
    }

    fetchRegions() {
        this.sendAjaxRequest(this.regionsUrl).then(response => {
            $(`#${this.regionBtnId}`)
                .replaceWith(render.renderList(
                    response.map((item) => {
                        return new Object({
                            data: item.id,
                            text: item.title
                        });
                    }),
                    this.regionContainerClass,
                    this.regionItemClass,
                    'id')
                );
        });
    }

    selectRegion(event) {
        const
            $currentTarget = $(event.currentTarget),
            regionId = $currentTarget.data('id');

        $(`.${this.regionItemClass}`).removeClass('_active');
        $currentTarget.addClass('_active');

        $(`#${this.locationField}`).val('');
        $(`#${this.regionField}`).val(regionId);
        $(document).trigger({
            'type': 'region_changed',
            'region_id': regionId
        });
        this.fetchLocations(regionId);
    }

    fetchLocations(id) {
        const prepareItems = (items) => {
            return items.map((item) => {
                return new Object({
                    data: item,
                    text: item
                });
            });
        };
        this.sendAjaxRequest(this.localitiesUrl, 'GET', {id: id}).then(response => {
            if (this.$element.children(`.${this.locationContainerClass}:first`).length) {
                this.$element.children(`.${this.locationContainerClass}:first`).html(
                    render.renderList(
                        prepareItems(response.shift().list),
                        this.locationContainerClass,
                        this.locationItemClass,
                        'name'
                    )
                );
            } else {
                this.$element
                    .append(
                        render.renderList(
                            prepareItems(response.shift().list),
                            'locations',
                            this.locationItemClass,
                            'name'
                        )
                    );
            }
        });
    }

    selectLocation(event) {
        const
            $currentTarget = $(event.currentTarget),
            locationName = $currentTarget.data('name');
        $(`#${this.locationField}`).val(locationName);
        $(document).trigger({
            'type': 'location_changed',
            'locationName': locationName
        });
        $(`.${this.locationItemClass}`).removeClass('_active');
        $currentTarget.addClass('_active');
        if (!this.$element.find(`#${this.submitBtnId}`).length) {
            this.$element.append(
                render.renderButton(this.submitBtnId, 'Save', 'submit-btn', 'submit')
            );
        }
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
