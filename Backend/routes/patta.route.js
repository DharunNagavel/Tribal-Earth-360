import { Router } from "express";
import { Individual,Community,CommunityResource } from "../controller/patta.controller.js";

const pattaRouter = Router();

pattaRouter.post('/individual',Individual);

pattaRouter.post('/community',Community);

pattaRouter.post('/communityresource',CommunityResource);

export default pattaRouter;