# US 7.2.1

## 1. Context

* This user story is the base for a new BackEnd, which will hold the patients medical record along with all the supporting information.

## 2. Requirements

**US 7.2.1** As Software Architect, I want to adopt a decentralized architecture of the backoffice module, so that it is composed of the existing SPA frontend and the .Net backend, and a new module responsible for managing, namely, Patient’s Medical Records, Allergies and Medical Conditions. This module must be implemented in Node.js, Express and MongoDB SGBD.

**Acceptance Criteria:**

- Node.js + Express.
- MongoDB.
- Patient medical record, allergies and medical conditions management.

## 3. Analysis

* This BackEnd will developed using the project "bulletproof-nodejs+ddd" as guide.
	* https://bitbucket.org/nunopsilva/bulletproof-nodejs-ddd/src/master/
* It must also support JWT authorization using the same IAM platform as the other BackEnd.
* In this user story we will implement at least one of the domain entities, to serve as a base for the other ones.

## 4. Design

### Realization

* This BackEnd will have the following folder structure:
	* api:
		- Location of the route's index file.
		* middlewares:
			- Location of the middlewares used in the routes.
		* routes:
			- Location of each individual route for the domain entities.
	* controllers:
		- Location of controller interfaces and their respective implementation.
	* dataschema:
		- Location of the schemas of the domain entities for use in the repositories.
	* domain:
		- Location of the all the domain entities in their respective subfolders.
	* dto:
		- Location of the DTO for the domain entities.
	* mappers:
		- Location of the mappers classes for mapping between domain, dto and persistence.
	* persistence:
		- Location of the schemas of the domain entities for use by the MongoDB.
	* repos:
		- Location of repository interfaces and their respective implementation.
	* services:
		- Location of service interfaces and their respective implementation.

* As a base example for future domain entities, the Allergies entity will be created.

### Applied Patterns

Applied Patterns description in [DevelopmentPatterns](../../Global/DevelopmentPatterns/readme.md)

## 5. Implementation

### Required installations

* The following programs are required:
	* Node.js (with chocolatey)
	* Microsoft Build Tools (2019 or 2022 tested)
	* MongoDb Community Edition

### Build and Run

* To be able to build the new BackEnd (BackEnd2), you must run the following commands while inside the folder:
	* npm install
	* npm install -g nodemon
	* npm install ts-node
	* npm install mongoose
	* npm install request
* To run it:
	* npm run start

### JWT Authorization implementation

* A module [auth](/BackEnd2/src/api/middlewares/auth.ts) was created to be used as a middleware for the routes.
	* To validate a specific role, the module must be included in the route method.
	* Example for allergy POST with Admin role required:
		```
		import auth from '../middlewares/auth';
		...
		route.post('', auth.isAdmin,
        celebrate({
            body: Joi.object({
                code: Joi.string().required(),
                name: Joi.string().required(),
                description: Joi.string().required()
            })
        }),
        (req, res, next) => ctrl.createAllergy(req, res, next));
		```

### Entity implementation

* As mentioned in Realization, the Allergies entity was implemented.
* The below references are reminders for future implementation of domain entities, that might help with configuration problems:
	* Controllers must have a route:
		* [allergyController](/BackEnd2/src/controllers/allergyController.ts) is referenced in [allergyRoute](/BackEnd2/src/api/routes/allergyRoute.ts)
	* The routes are grouped in the router [index](/BackEnd2/src/api/index.ts)
	* The project [config](/BackEnd2/config.js) file must include the names and paths of the controllers, services and repos:
		```
		controllers: {
			allergy: {
				name: "AllergyController",
				path: "../controllers/allergyController"
			}
		},

		repos: {
			allergy: {
				name: "AllergyRepo",
				path: "../repos/allergyRepo"
			}
		},

		services: {
			allergy: {
				name: "AllergyService",
				path: "../services/allergyService"
			}
		},
		```
	* The loader [index](/BackEnd2/src/loaders/index.ts) must include the references to the controllers, services, repos and schemas configured in the previous point:
		* This loader index is used for dependency injection.
		```
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
		...
		await dependencyInjectorLoader({
			mongoConnection,
			schemas: [allergySchema],
			controllers: [allergyController],
			repos: [allergyRepo],
			services: [allergyService]
		});
		```

## 6. Integration/Demonstration

* To change the location of the database the property 'databaseURL' must be updated in the [config.js](/BackEnd2/config.js) file, or the environment variable 'MONGODB_URI' must be set. Example database URL: mongodb://127.0.0.1:27017/sem5pi 
* The same file can be used to configure the database port in the property 'port' or the environment variable 'PORT'.
* To start this backend you must use 'npm start' (while pointing to the BackEnd2 folder).
