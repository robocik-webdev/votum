const Yup = require('yup');

const loginSchema = Yup.object({
  token: Yup.string()
    .required('Token required')
    .min(8, 'Token too short')
    .max(28, 'Token too long!')
});
module.exports = loginSchema;
