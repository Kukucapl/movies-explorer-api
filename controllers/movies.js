const Movie = require('../models/movie');
const BadRequest = require('../middlewares/errors/badrequest');
const NotFound = require('../middlewares/errors/notfound');
const Forbidden = require('../middlewares/errors/forbidden');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        next(new NotFound('Фильм не найден'));
      } else if (movie.owner.toString() !== req.user._id) {
        next(new Forbidden('Ошибка доступа'));
      } else {
        Movie.findByIdAndRemove(req.params.movieId)
          .then((findedMovie) => {
            res.status(200).send({ data: findedMovie });
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Ошибка в id фильма'));
      } else {
        next(err);
      }
    });
};
