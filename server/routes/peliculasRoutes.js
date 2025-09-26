const express = require('express');
const { check } = require('express-validator');
const passport = require('../middlewares/auth'); // Importa Passport configurado con JWT
const {
  getPeliculas,
  getPeliculaById,
  createPelicula,
  updatePelicula,
  deletePelicula
} = require('../controllers/peliculasController');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

// Proteger todas las rutas con autenticación JWT
router.use(passport.authenticate('jwt', { session: false }));

// Rutas públicas protegidas por JWT

router.get('/', getPeliculas);

router.get('/:id', getPeliculaById);

router.post('/',
  [
    check('tmdb_id').isInt().withMessage('tmdb_id debe ser un entero'),
    check('title').notEmpty().withMessage('El título es obligatorio'),
    check('year').isInt({ min: 1800, max: 2100 }).withMessage('Año inválido')
  ],
  validateRequest,
  createPelicula
);

router.put('/:id',
  [
    check('tmdb_id').optional().isInt(),
    check('title').optional().notEmpty(),
    check('year').optional().isInt()
  ],
  validateRequest,
  updatePelicula
);

router.delete('/:id', deletePelicula);

module.exports = router;
