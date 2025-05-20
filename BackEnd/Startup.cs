using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using BackEnd.Domain.Shared;
using BackEnd.Domain.Appointments;
using BackEnd.Domain.OperationRequests;
using BackEnd.Domain.OperationTypes;
using BackEnd.Domain.Patients;
using BackEnd.Domain.Specializations;
using BackEnd.Domain.Staffs;
using BackEnd.Domain.SurgeryRooms;
using BackEnd.Infrastructure;
using BackEnd.Infrastructure.Shared;
using BackEnd.Infrastructure.Appointments;
using BackEnd.Infrastructure.OperationRequests;
using BackEnd.Infrastructure.OperationTypes;
using BackEnd.Infrastructure.Patients;
using BackEnd.Infrastructure.Specializations;
using BackEnd.Infrastructure.Staffs;
using BackEnd.Infrastructure.SurgeryRooms;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.Identity.Web;
using Microsoft.Identity.Web.UI;
using BackEnd.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using BackEnd.Domain.PatientRequests;
using BackEnd.Infrastructure.PatientRequests;

namespace BackEnd
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var connectionString = Configuration.GetConnectionString("MariaDB");
            //connectionString ??= "Server=vsgate-s1.dei.isep.ipp.pt;Port=10815;Database=sem5pi_24_25_3nb_g79;User=root;Password=Th2aXNGmcUC0";
            connectionString ??= "Server=pnttt.dyndns-home.com;Port=3306;Database=sem5pi_24_25_3nb_g79;User=root;Password=Panados123!";
            var serverVersionString = Configuration.GetConnectionString("MariaDBVersion");
            //serverVersionString ??= "10.7.3";
            serverVersionString ??= "10.11.8";
            var serverVersion = new MariaDbServerVersion(new Version(serverVersionString));

            services.AddDbContext<BackEnd_DbContext>(opt =>
                opt.UseMySql(connectionString, serverVersion)
                .ReplaceService<IValueConverterSelector, StronglyEntityIdValueConverterSelector>()
                //.LogTo(Console.WriteLine)
                //.EnableSensitiveDataLogging() //to log sensitive data
                .EnableDetailedErrors()); //get detailed query exceptions

            ConfigureMyServices(services);

            services.AddControllersWithViews().AddNewtonsoftJson();

            // Setting configuration for protected web api
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddMicrosoftIdentityWebApi(Configuration);
            // Creating policies that wraps the authorization requirements
            services.AddAuthorization();

            services.AddCors(o => o.AddPolicy("default", builder =>
            {
                builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
            }));

            services.AddHttpContextAccessor();
            services.AddRazorPages().AddMicrosoftIdentityUI();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            //app.UseCors("default");

            //cors for FrontEnd to use api
            app.UseCors(options =>
                options.AllowAnyMethod()
                    .AllowAnyHeader().AllowAnyOrigin());

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

        public void ConfigureMyServices(IServiceCollection services)
        {
            services.AddTransient<IUnitOfWork, UnitOfWork>();
            services.AddTransient<IAuthzService, AuthzService>();

            services.AddTransient<IAppointmentRepository, AppointmentRepository>();
            services.AddTransient<AppointmentService>();

            services.AddTransient<IOperationRequestRepository, OperationRequestRepository>();
            services.AddTransient<OperationRequestService>();

            services.AddTransient<IOperationTypeRepository, OperationTypeRepository>();
            services.AddTransient<OperationTypeService>();

            services.AddTransient<IPatientRepository, PatientRepository>();
            services.AddTransient<PatientService>();

            services.AddTransient<ISpecializationRepository, SpecializationRepository>();
            services.AddTransient<SpecializationService>();

            services.AddTransient<IStaffRepository, StaffRepository>();
            services.AddTransient<StaffService>();

            services.AddTransient<ISurgeryRoomRepository, SurgeryRoomRepository>();
            services.AddTransient<SurgeryRoomService>();

            services.AddTransient<IPatientRequestRepository, PatientRequestRepository>();
            services.AddTransient<PatientRequestService>();

            services.AddTransient<ISystemChangeLogRepository, SystemChangeLogRepository>();
        }
    }
}
