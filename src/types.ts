import express from "express";
export interface IUserRequest extends express.Request {
  user?: any;
}
