import { Router as expressRouter } from "express";
import { passportStrategiesEnum } from "../config/enums.js";
import passport from "passport";

export default class Router{
    constructor() {
        this.router = expressRouter();
        this.init();
    }

    getRouter(){
        return this.router;
    }

    init(){}

    get(path, policies, passportStrategy, ...callbacks) {
        this.router.get(
            path,
            this.applyCustomPassportCall(passportStrategy),
            this.handlePolicies(policies),
            this.generateCustomReponse,
            this.applyCallbacks(callbacks)
        );
    }

    post(path, policies, passportStrategy, ...callbacks){
        this.router.post(
            path,
            this.applyCustomPassportCall(passportStrategy),
            this.handlePolicies(policies), 
            this.generateCustomReponse, 
            this.applyCallbacks(callbacks)
            );
    }

    put(path, policies, passportStrategy, ...callbacks){
        this.router.put(
            path,
            this.applyCustomPassportCall(passportStrategy),
            this.handlePolicies(policies),
            this.generateCustomReponse, 
            this.applyCallbacks(callbacks)
            );
    }

    delete(path, policies, passportStrategy, ...callbacks){
        this.router.delete(
            path,
            this.applyCustomPassportCall(passportStrategy),
            this.handlePolicies(policies),
            this.generateCustomReponse, 
            this.applyCallbacks(callbacks)
            );
    }

    applyCallbacks(callbacks){
        return callbacks.map((callback) => async(...params) => {
            try {
                await callback.apply(this, params);
            } catch (error) {
                params[1].status(500).json({error: error.message});
            }
        })
    }

    handlePolicies = (policies) => (req, res, next) => {
        if(policies[0] === 'PUBLIC') return next();
        
        const user = req.user;

        if(!policies.includes(user.role.toUpperCase()))
            return res.status(403).json({ message: 'Acceso no autorizado' })

        next();
    }

    generateCustomReponse = (req, res, next) => {
        res.sendSuccess = (data) => {
            res.status(200).json({ data });
        };
        res.sendServerError = (error) => {
            res.status(500).json({ error });
        };
        res.sendClientError = (error) => {
            res.status(400).json({ error });
        };
        next();
    }

    applyCustomPassportCall = (strategy) => (req, res, next) => {
            if(strategy === passportStrategiesEnum.JWT){
                passport.authenticate(strategy, function (err, user, info) {
                    if(err) return next(err);

                    if(!user) 
                        return res.status(401).send({error: info.messages ? info.messages : info.toString()});
                    
                    req.user = user;
                    next();
                }) (req, res, next);
            } else if(strategy === passportStrategiesEnum.GITHUB){                
                passport.authenticate(strategy, {scope: ["user:email"]}, function(err, user, info) {
                    if(err) return next(err);

                    if(!user)
                    return res.status(401).send({error: info.messages ? info.messages : info.toString()});
                    req.user = user;
                    next();
                }) (req, res, next);
            } else  {
                next();
            }
        }
    }