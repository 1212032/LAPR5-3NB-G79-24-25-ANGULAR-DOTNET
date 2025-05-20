import { NextFunction, Request, Response } from "express";
import config from '../../../config';

var jwt = require('jsonwebtoken');
var request = require('request')

// Source: https://github.com/jsa2/aadjwt/tree/master

function getKeyID(kid, callback) {
    var uri = 'https://login.microsoftonline.com/common/discovery/keys'
    request(uri, { JSON: true }, (request, response) => {
        var res = JSON.parse(response.body)
        let keyMatch = res.keys.find((key) => {
            return key.kid === kid
        })
        if (!keyMatch) {
            return callback('No matching key found on ' + uri, undefined)
        }
        callback(undefined, keyMatch)
    })
}

const auth = (req: Request, res: Response, next: NextFunction, roles: string[]) => {
    if (!req.headers.authorization) {
        const err = new Error("Missing authorization header");
        err['status'] = 400;
        return next(err);
    }
    var token = req.headers.authorization.split("Bearer ")[1]
    if (!token) {
        const err = new Error("Invalid bearer token");
        err['status'] = 400;
        return next(err);
    }
    var decodedToken = jwt.decode(token, { complete: true })
    if (!decodedToken) {
        const err = new Error("Invalid bearer token");
        err['status'] = 400;
        return next(err);
    }

    getKeyID(decodedToken.header.kid, (error, data) => {
        if (error) {
            return next(error)
        }
        var key = '-----BEGIN CERTIFICATE-----' + '\n' + data.x5c + '\n' + '-----END CERTIFICATE-----'
        let tokenIssuer: string = config.issuer;
        let tokenAudience: string = config.audience;
        jwt.verify(token, key, { algorithms: 'RS256', tokenIssuer, complete: true, tokenAudience }, (error, verifiedToken) => {
            if (error) {
                const err = new Error("Token invalid or expired");
                err['status'] = 400;
                return next(err);
            }
            let foundRole: Boolean = false;
            for (let i = 0; i < decodedToken.payload.roles.length; i++) {
                if (roles.find((obj) => obj === decodedToken.payload.roles[i])) {
                    foundRole = true;
                }
            }
            if (!foundRole) {
                const err = new Error("Unauthorized");
                err['status'] = 401;
                return next(err);
            }
            return next()
        })
    })
}

const isDoctor = (req: Request, res: Response, next: NextFunction) => {
    let roles: string[] = ['Doctor'];
    auth(req, res, next, roles);
}

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    let roles: string[] = ['Admin'];
    auth(req, res, next, roles);
}

const isAdminOrDoctor = (req: Request, res: Response, next: NextFunction) => {
    let roles: string[] = ['Admin', 'Doctor'];
    auth(req, res, next, roles);
}

const isNurse = (req: Request, res: Response, next: NextFunction) => {
    let roles: string[] = ['Nurse'];
    auth(req, res, next, roles);
}

export default { isDoctor, isAdmin, isNurse, isAdminOrDoctor };
