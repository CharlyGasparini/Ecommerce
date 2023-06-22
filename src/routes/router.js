import { Router as expressRouter } from "express";

export default class Router{
    constructor() {
        this.router = expressRouter();
        this.init();
    }

    init(){}

    getRouter(){
        return this.router;
    }

    get(path, ...callbacks){
        this.router.get(
            path, 
            this.generateCustomResponses, 
            this.applyCallbacks(callbacks)
            );
    }
    
    post(path, ...callbacks){
        this.router.post(
            path,
            this.generateCustomResponses, 
            this.applyCallbacks(callbacks)
            );
    }

    put(path, ...callbacks){
        this.router.put(
            path,
            this.generateCustomResponses, 
            this.applyCallbacks(callbacks)
            );
    }

    delete(path, ...callbacks){
        this.router.delete(
            path,
            this.generateCustomResponses, 
            this.applyCallbacks(callbacks)
            );
    }

    param(path, ...callbacks){
        this.router.param(
            path,
            this.generateCustomResponses, 
            this.applyCallbacks(callbacks)
            );
    }

    applyCallbacks(callbacks){
        return callbacks.map(callback => async(...params) => {
            try {
                await callback.apply(this.params);
            } catch (error) {
                params[1].status(500).send(error);
            }
        })
    }

    generateCustomResponses(req, res, next) {
        res.sendSuccess = payload => res.status(200).json({payload});
        res.sendServerError = error => res.status(500).json({error});
        res.sendUserError = error => res.status(400).json({error});
        next();
    }
}
