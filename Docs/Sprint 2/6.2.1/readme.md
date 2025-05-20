# US 6.2.1

## 1. Context

* Enable patients to register in the IAM.

## 2. Requirements

**US 6.2.1** As a Patient, I want to register for the healthcare application, so that I can create a user profile and book appointments online.

## 3. Analysis

* The front end app should allow the patient to login/register.
* After login, the page should redirect to the patient menu with the patient options.

## 4. Design



## 5. Implementation

* Back End

  - **Startup.cs - ConfigureServices(IServiceCollection services)**
  ```
  public void ConfigureServices(IServiceCollection services){
    ...
    services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
                  .AddMicrosoftIdentityWebApp(Configuration.GetSection("AzureAd"))
                  .EnableTokenAcquisitionToCallDownstreamApi()
                  .AddInMemoryTokenCaches();
    ...
  }
  ```

  - **Startup.cs - ConfigureServices(IApplicationBuilder app, IWebHostEnvironment env)**
  ```
  public void Configure(IApplicationBuilder app, IWebHostEnvironment env){
    ...
    app.UseAuthentication();
    app.UseAuthorization();
    ...
  }
  ```

## 6. Integration/Demonstration
- Click on create account and follow the steps
![CreateAccount](./create-account.jpg)
