# US 03

## 1. Context

* Enable patients to register in the IAM.

## 2. Requirements

**US 03** As a Patient, I want to register for the healthcare application, so that I can create a user profile and book appointments online.

**Acceptance criteria:**
- Patients can self-register using the external IAM system.
- During registration, patients provide personal details (e.g., name, email, phone) and create a profile.
- The system validates the email address by sending a verification email with a confirmation link.
- Patients cannot list their appointments without completing the registration process.

## 5. Implementation

- **Startup - ConfigureServices(IServiceCollection services)**
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

- **Startup - ConfigureServices(IApplicationBuilder app, IWebHostEnvironment env)**
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
