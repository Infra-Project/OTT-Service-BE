require("dotenv").config();
const Movie = require("../models/movies");
const Episode = require("../models/episode");
const User = require("../models/user");

exports.getMovie = async (req, res, next) => {
    try {
        const movieId = req.params.id;
        const movie = await Movie.findOne({ where: { id: movieId } })
        if(!movie) {
            const error = new Error("do not have a movie with " + movieId);
            error.statusCode = 403;
            throw error;
        }
        res.status(200).json({ movie })

    } catch (error) {
        next(error);
    }
}