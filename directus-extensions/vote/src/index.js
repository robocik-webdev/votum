export default (router, { services, exceptions }) => {
  const { ItemsService } = services;
  const { ServiceUnavailableException } = exceptions;

  router.get('/:id', (req, res, next) => {
    const recipeService = new ItemsService('votum_votes', {
      schema: req.schema,
      accountability: req.accountability
    });

    recipeService
      .readByQuery({ fields: ['*'] })
      .then(results => {
        console.log(req.params.id);
        res.json(results);
      })
      .catch(error => next(new ServiceUnavailableException(error.message)));
  });
};
