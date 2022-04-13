const Yup = require('yup');

const userCSV = Yup.object({
  csv: Yup.string().required('CSV required'),
  deleteUsers: Yup.boolean().default(false),
  head: Yup.boolean().default(false)
});
module.exports = userCSV;
