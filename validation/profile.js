const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {

    let errors = {};

    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';

    if (!Validator.isLength(data.handle, {min: 2, max: 40})) {
        errors.handle = 'Handle needs to be between 2 and 40 characters';
    }
    if (Validator.isEmpty(data.handle)) {
        errors.handle = 'Profile handle is required';
    }
    if (Validator.isEmpty(data.status)) {
        errors.status = 'Status field is required';
    }
    if (Validator.isEmpty(data.skills)) {
        errors.skills = 'Skills field is required';
    }

    const { website, youtube, twitter, facebook, linkedin, instagram } = data;
    const sites = {
        website,
        youtube,
        twitter,
        facebook,
        linkedin,
        instagram
    };
    
    for (let site in sites) {
        if (!isEmpty(sites[site])) {
            if (!Validator.isURL(sites[site])) {
                errors[site] = 'Not a valid URL';
            }
        }
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}