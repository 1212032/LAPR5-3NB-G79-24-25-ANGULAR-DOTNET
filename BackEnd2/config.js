import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
    // This error should crash whole process

    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
    /**
     * Your favorite port : optional change to 5004 by JRT
     */
    port: parseInt(process.env.PORT, 10) || 5004,

    key: "/etc/letsencrypt/live/pnttt.dyndns-home.com/privkey.pem",
    cert: "/etc/letsencrypt/live/pnttt.dyndns-home.com/fullchain.pem",

    /**
     * That long string from mlab
     */
    databaseURL: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/test",

    // Azure AD Client ID
    audience: "api://8cb4473b-fbec-4737-ac14-973ccc04d086",
    // Azure AD Tenant ID
    issuer: "https://sts.windows.net/f8da0c59-22a8-4891-bc76-7a603e362eac/",

    /**
     * Used by winston logger
     */
    logs: {
        level: process.env.LOG_LEVEL || 'info',
    },

    /**
     * API configs
     */
    api: {
        prefix: '/api',
    },

    controllers: {
        allergy: {
            name: "AllergyController",
            path: "../controllers/allergyController"
        },
        medicalCondition: {
            name: "MedicalConditionController",
            path: "../controllers/medicalConditionController"
        },
        medicalRecord: {
            name: "MedicalRecordController",
            path: "../controllers/medicalRecordController"
        }
    },

    repos: {
        allergy: {
            name: "AllergyRepo",
            path: "../repos/allergyRepo"
        },
        medicalCondition: {
            name: "MedicalConditionRepo",
            path: "../repos/medicalConditionRepo"
        },
        medicalRecord: {
            name: "MedicalRecordRepo",
            path: "../repos/medicalRecordRepo"
        }
    },

    services: {
        allergy: {
            name: "AllergyService",
            path: "../services/allergyService"
        }, medicalCondition: {
            name: "MedicalConditionService",
            path: "../services/medicalConditionService"
        },
        medicalRecord: {
            name: "MedicalRecordService",
            path: "../services/medicalRecordService"
        }
    },
};
