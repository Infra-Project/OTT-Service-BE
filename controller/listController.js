require("dotenv").config();

const Movie = require("../models/movies");
const Episode = require("../models/episode");
const User = require("../models/user")

exports.getLists = async (req, res, next) => {
    try {
        const type = req.query.type; // movie, drama
        const genre = req.query.genre; // fantasy, drama, romance...
        let movieList;
        if (type) {
            if (genre) {
                // type, genre
                console.log("type, genre", type, genre)
                movieList = await Movie.findAll({ where: { type, genre } })
            } else {
                // type
                movieList = await Movie.findAll({ where: { type } })
            }
        } else {
            // genre
            movieList = await Movie.findAll({ where: { genre }})
        }
        res.status(200).json({ list: movieList})
    } catch (error) {
        next(error);
    }
}