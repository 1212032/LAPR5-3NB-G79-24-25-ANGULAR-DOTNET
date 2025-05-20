# US 6.2.4

## 1. Context

* Implement functionality (non-authenticated) Backoffice User log in to the system.

## 2. Requirements

**US 6.2.4** As a (non-authenticated) Backoffice User, I want to log in to the system using my credentials, so that I can access the backoffice features according to my assigned role.

**Acceptance criteria:**
- Backoffice users log in using their username and password.
- Role-based access control ensures that users only have access to features appropriate to their
role (e.g., doctors can manage appointments, admins can manage users and settings).
- After five failed login attempts, the user account is temporarily locked, and a notification is
sent to the admin.
- Login sessions expire after a period of inactivity to ensure security.

## 3. Analysis

* **Q**: Can users hold multiple roles?
  * **A**: No, each user can have only one role.
* **Q**: Can a user have both patient and healthcare staff profiles?
  * **A**: No, a user cannot have both profiles. Staff and patients have separate identifications.
* **Q**: What are the system's password requirements?
  * **A**: at least 10 characters long, at least a digit, a capital letter and a special character.
***

## 5. Implementation

* Back end
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
  // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.

  public void Configure(IApplicationBuilder app, IWebHostEnvironment env){
    ...

    app.UseHttpsRedirection();
    app.UseRouting();
    app.UseAuthentication();
    app.UseAuthorization();
    app.UseEndpoints(endpoints =>
    {
        endpoints.MapControllerRoute(name: "default", pattern: "{controller=Home}/{action=Index}/{id?}");
        endpoints.MapRazorPages();
    });
  }
  ```

## 6. Integration/Demonstration
- Log in to the system using your microsoft credentials
![LogInIAM](./log-in-iam.jpg)