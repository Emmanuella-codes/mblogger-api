import express from "express";
import authentication from "./authentication";
import blog from "./blog";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  blog(router);
  return router;
};
