# Surgical Appointment and Resource Management

The scope of this project is to develop a prototype system for chirurgic requests, appointment, and resource management. The system will enable hospitals and clinics to manage surgery appointments, and patient records. It will also offer real-time 3D visualization of resource availability within the facility and optimize scheduling and resource usage. Furthermore, the project will address GDPR compliance, ensuring the system meets data protection and consent management requirements.

Each module of the system must consider the legal aspects of the GDPR Regulation (EU) 2016/679 and guarantee that users can access the privacy policy and exercise all relevant rights under this regulation.

Since this is a prototype, not all modules will need full implementation. The project proposal must clearly specify which functionalities are implemented.

Given that the project spans 14 weeks, broken into three sprints, it is important to carefully allocate tasks, milestones, and responsibilities to ensure that the students can develop a working system by the end of the course. Each sprint will include a planning phase, development phase, testing, and review.


# sem5pi-24-25-3nb-g79

### Folders

* Docs
    * Global contains existing modules information, domain models and glossaries.
    * US folder for each User Story.
* Controllers
    * Controllers containing routes and endpoints.
* Domain
    * Contains the aggregates/entities sub-folders including:
        * Entity classes
        * Entity ID classes
        * DTO(s)
        * Service(s)
        * Repository interface
    * The shared folder contains shared objects used by the aggregates/entities.
* Infrastructure
    * Contains the aggregates/entities sub-folders including:
        * Entity type configuration
        * Implementation of repository interface
    * Configurations for database access and repositories implementations.

### Install MariaDB connector

* Execute in terminal: dotnet add package Pomelo.EntityFrameworkCore.MySql

### Change MariaDB connection

* The following JSON must be present in the "appsettings.json"/"appsettings.Development.json" file
    ```
    "ConnectionStrings": {
        "MariaDB":"server=SERVER,PORT;user=USER;password=PASSWORD;database=DATABASE",
        "MariaDBVersion":"10.7.3"
    }
    ```

### Install EntityFramework Migrations:

* Execute in terminal
    * dotnet tool install --global dotnet-ef
    * dotnet add package Microsoft.EntityFrameworkCore.Design

### Update database with domain changes:

* Execute in terminal: 
    * dotnet ef migrations add MIGRATION_NAME
    * dotnet ef database update

### Remove last domain change:

* Execute in terminal: 
    * dotnet ef migrations remove

### Build the project

* Execute in terminal: dotnet build .\BackEnd\BackEnd.csproj

### Run the project

* Execute in terminal: dotnet run --project .\BackEnd\BackEnd.csproj
