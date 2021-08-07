import express from "express";
export abstract class CommonRoutesConfig {
  constructor(protected app: express.Application, private name: string) {
    this.configureRoutes();
  }
  get Name(): string {
    return this.name;
  }
  abstract configureRoutes(): express.Application;
}
