'use strict';

module.exports = {
    renderForm: (id, action) => {
        return `<form id="${id}" action="${action}" method="post">`;
    },
    renderHiddenInput: (id, name) => {
        return `<input type="hidden" name="${name}" id="${id}">`;
    },
    renderButton: (id, text = '', btnClass, type = 'button') => {
        return `<button type="${type}" ${btnClass ? 'class="' + btnClass + '"' : '' } id="${id}">${text}</button>`;
    },
    renderList: (items, containerClass = '', jsItemClass = '', dataFiled = 'data') => {
        return `<div class="container-list ${containerClass}">` +
            items.reduce((result, current) => {
                return result + `<p class="container-list__item ${containerClass ? containerClass + '__item' : ''} ${jsItemClass}" data-${dataFiled}=${current.data}>${current.text}</p>`;
            }, '') +
            '<div/>';
    }
};
