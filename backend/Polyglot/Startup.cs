﻿using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Polyglot.Authentication;
using Polyglot.BusinessLogic;
using Polyglot.BusinessLogic.Hubs;
using Polyglot.Common;
using Polyglot.Core;
using Polyglot.Core.Authentication;
using Polyglot.DataAccess;

namespace Polyglot
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
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    builder =>
                    {
                        builder
                        .AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials();
                    });
            });
            services.AddMvc()
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1)
                .AddJsonOptions(
                    options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                    );


            services.AddFirebaseAuthentication(Configuration.GetValue<string>("Firebase:ProjectId"));

            if (Configuration.GetValue<bool>("UseLocalSignalR"))
            {
                services.AddSignalR();
            }
            else
            {
                services.AddSignalR().AddAzureSignalR();
            }

            services.AddHttpContextAccessor();
            services.AddScoped<ICurrentUser, CurrentUser>();

            BusinessLogicModule.ConfigureServices(services, Configuration);
            CommonModule.ConfigureServices(services);
            CoreModule.ConfigureServices(services);
            DataAccessModule.ConfigureServices(services, Configuration);
        }


        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {

            //if (env.IsDevelopment())
            //{
                app.UseDeveloperExceptionPage();
            //}

            BusinessLogicModule.ConfigureMiddleware(app);
            CommonModule.ConfigureMiddleware(app);
            CoreModule.ConfigureMiddleware(app);
            DataAccessModule.ConfigureMiddleware(app);

            // if (env.IsDevelopment())
            //  {
            app.UseCors("AllowAll");
            // }

            app.UseAuthentication();

            app.UseMvc();
            if (Configuration.GetValue<bool>("UseLocalSignalR"))
            {
                app.UseSignalR(options =>
                {
                    options.MapHub<WorkspaceHub>("/workspaceHub");
                    options.MapHub<ChatHub>("/chatHub");
                    options.MapHub<NavigationHub>("/navigationHub");
                });
            }
            else
            {
                app.UseAzureSignalR(options =>
                {
                    options.MapHub<WorkspaceHub>("/workspaceHub");
                    options.MapHub<ChatHub>("/chatHub");
                    options.MapHub<NavigationHub>("/navigationHub");
                });
            }
        }
    }
}
