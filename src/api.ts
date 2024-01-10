import express from "express";
import {RootController} from "./controllers";

const api = express();
api.use(express.urlencoded({ extended: true }));
api.use('/', new RootController().router);

export default api;