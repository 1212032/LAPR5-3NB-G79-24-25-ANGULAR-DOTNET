import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';

import config from '../../config';

export default async ({ expressApp }) => {
    const mongoConnection = await mongooseLoader();
    Logger.info('✌️ DB loaded and connected!');

    const medicalConditionSchema = {
        name: 'medicalConditionSchema',
        schema: '../persistence/schemas/medicalConditionSchema'
    }
    const medicalConditionController = {
        name: config.controllers.medicalCondition.name,
        path: config.controllers.medicalCondition.path
    }
    const medicalConditionRepo = {
        name: config.repos.medicalCondition.name,
        path: config.repos.medicalCondition.path
    }
    const medicalConditionService = {
        name: config.services.medicalCondition.name,
        path: config.services.medicalCondition.path
    }

    const allergySchema = {
        name: 'allergySchema',
        schema: '../persistence/schemas/allergySchema',
    };
    const allergyController = {
        name: config.controllers.allergy.name,
        path: config.controllers.allergy.path
    }
    const allergyService = {
        name: config.services.allergy.name,
        path: config.services.allergy.path
    }
    const allergyRepo = {
        name: config.repos.allergy.name,
        path: config.repos.allergy.path
    }

    const medicalRecordSchema = {
        name: 'medicalRecordSchema',
        schema: '../persistence/schemas/medicalRecordSchema',
    };
    const medicalRecordController = {
        name: config.controllers.medicalRecord.name,
        path: config.controllers.medicalRecord.path
    }
    const medicalRecordService = {
        name: config.services.medicalRecord.name,
        path: config.services.medicalRecord.path
    }
    const medicalRecordRepo = {
        name: config.repos.medicalRecord.name,
        path: config.repos.medicalRecord.path
    }

    await dependencyInjectorLoader({
        mongoConnection,
        schemas: [
            allergySchema,
            medicalConditionSchema,
            medicalRecordSchema
        ],
        controllers: [
            allergyController,
            medicalConditionController,
            medicalRecordController
        ],
        repos: [
            allergyRepo,
            medicalConditionRepo,
            medicalRecordRepo
        ],
        services: [
            allergyService,
            medicalConditionService,
            medicalRecordService
        ]
    });
    Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

    await expressLoader({ app: expressApp });
    Logger.info('✌️ Express loaded');
};
