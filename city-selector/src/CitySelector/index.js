require('./style.less');
// Your code...
const $ = require('jquery');

class CitySelector {
    constructor(params) {
        console.log('this is constructor');
        this.elementId     = params.elementId;
        this.regionsUrl    = params.regionsUrl;
        this.localitiesUrl = params.localitiesUrl;
        this.saveUrl       = params.saveUrl;
        this.initRegionButton();
    }

    initRegionButton() {
        $(`#${this.elementId}`)
            .html('<button >Select region</button>');
    }


    fetchRegion() {

    }

}

module.exports = CitySelector;
