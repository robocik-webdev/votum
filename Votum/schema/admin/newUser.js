const Yup = require('yup');

const newUser = Yup.object({
  name: Yup.string().required('Name required').min(1, 'Name too short'),
  surname: Yup.string()
    .required('Surname required')
    .min(1, 'Surname too short'),
  email: Yup.string()
    .email()
    .required('E-Mail required')
    .min(5, 'E-Mail too short'),
  rightToVote: Yup.boolean().required(
    'You need to specify users right to vote'
  ),
  admin: Yup.boolean().required('You need to specify users privilages')
});
module.exports = newUser;
