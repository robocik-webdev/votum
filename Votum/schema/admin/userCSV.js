const Yup = require('yup');

const newUser = Yup.object({
  CSV: Yup.string().required('CSV required'),
  deleteUsers: Yup.boolean()
});
module.exports = newUser;
