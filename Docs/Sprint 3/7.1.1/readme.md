# US 7.1.1

## 1. Context

*  Implement all the functionalities required to integrate all modules of the system in a SPA(single page application) format

## 2. Requirements

**US 7.1.1** As user, I want to have an integrated UI for all modules of the system so that I don’t need to switch between application urls.

**Acceptance criteria:**
- All US's from this sprint need to be implemented.

## 4. Implementation

## 6. Integration/Demonstration
* **Requisites**:
    * **BackEnd**
        * Install dotnet SDK, ASP.NET Core Runtime and .NET Desktop Runtime:
            * https://dotnet.microsoft.com/en-us/download/dotnet/8.0 
            
        * Install MariaDB:
            * https://mariadb.org/download/?t=mariadb&p=mariadb&r=11.5.2&os=windows&cpu=x86_64&pkg=msi&mirror=fe_up_pt
    * **BackEnd2**
        * Install nodejs
            * https://nodejs.org/en/download
        * Install MongoDB:
            * https://www.mongodb.com/try/download/community

    * **FrontEnd**
        * Have nodeJs installed:
            * https://nodejs.org/en/download/package-manager
        * Install Angular using the comand: 
            * `npm install -g @angular/cli`
        * Install msal library:
            * `npm install @azure/msal-browser @azure/msal-angular`
        * Install toaster:
            * `npm install ngx-toastr --save`
        * Install cypress:
            * `ng add @cypress/schematic`
        * Install ngx-quill:
            * `npm i ngx-quill`
            * `npm i quill`
        
* **Requirements**: 
    * Start Backend server:
        * `dotnet run`
    * Start Backend2 server:
        * `npm start`
    * Start Frontend server:
        * `npm start`
    
* **Using application**:
    * Press log in button to log in with your microsoft account on our domain, if you dont' have account press on register button. Once you are logged in you will be redirect to your corresponding menu, for example if you are a doctor you will see the doctor menu. With all that check you can use the application as you wish, if you have any problem/bug you can report to our support and we will contact you.