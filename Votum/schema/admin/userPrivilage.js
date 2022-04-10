const Yup = require('yup');

const userPrivilage = Yup.object({
  id: Yup.number('This value needs to be a number')
    .required('id is required')
    .positive()
    .integer(),
  rightToVote: Yup.boolean('This value needs to be a boolean').required(
    'Right to vote status is required'
  )
});
module.exports = userPrivilage;
