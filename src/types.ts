import express from "express";
export interface IUserRequest extends express.Request {
  userID?: any;
  username?: any;
}
