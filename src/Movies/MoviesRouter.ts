import { Router } from "express";
import { MoviesController } from "./MoviesController";

export const MoviesRouter = Router().get("/movies", MoviesController.getMovies)