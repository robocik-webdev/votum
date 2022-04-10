const Yup = require('yup');

const userCSV = Yup.object({
  CSV: Yup.string().required('CSV required'),
  deleteUsers: Yup.boolean()
});
module.exports = userCSV;
