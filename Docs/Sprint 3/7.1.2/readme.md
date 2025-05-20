# US7.1.2 | SEM5-45

## 1. Context

* The menu and routes are dynamically adjusted for users with different roles such as Admin, Doctor or Nurse.


## 2. Requirements

**US7.1.2** 
As user I want the application menu to adjust according to my role so that it only presents me the options I may access.

**Acceptance criteria:**

* The menu should only show the options relevant to the user's role.

* Access to each route must be protected, blocking unauthorised users.


## 3. Analysis

* BackEnd2:

- The role is extracted from the token and if it doesn't exist it returns a 401 of don't authorise error.
- Each route has an authorization auth.is for each profile, for example for the doctor profile.
- auth is middleware and is called by the route.
- Token comes from the http request. 

* FrontEnd:

- The guard is implicit in the frontend

## 4. Design

### 4.2. Class Diagram

![Class Diagram](svg/CD.svg)


### 4.3. Applied Patterns

Applied Patterns description in [DevelopmentPatterns](../../Global/DevelopmentPatterns/readme.md)

## 5. Implementation

* Solid security and modularity practices are used, ensuring that the menu and routes are dynamic and secure. 


BackEnd2:

* Route to authorize as admin

![Route_Authis BackEnd2\src\api\routes\allergyRoute.ts](png/03.png)


* Getting the roles from the token

![Roles_from_Token BackEnd2\src\api\middlewares\auth.ts](png/01.png)


FronteEnd:

* Any of services, if called incorrectly, can return an unauthorized error, for example by changing the function link.

![Authorized/NotAuthorized401 FrontEnd\src\app\Allergies\services\allergy.service.ts](png/02.png)


## 6. Integration/Demonstration

* To run this feature you must log in to the system with Admin, Doctor or Nurse. 