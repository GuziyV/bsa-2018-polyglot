﻿using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Polyglot.BusinessLogic.Interfaces;
using Polyglot.BusinessLogic.Services;
using Polyglot.BusinessLogic.TranslationServices;

namespace Polyglot.BusinessLogic
{
    public static class BusinessLogicModule
    {
        /// <summary>
        /// Register DI dependencies
        /// </summary>
        /// <param name="services"></param>
        /// <param name="configuration"></param>
        public static void ConfigureServices(IServiceCollection services, IConfiguration configuration)
        {
            services.AddTransient<IProjectService, ProjectService>();
            services.AddTransient<IComplexStringService, ComplexStringService>();
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<ITeamService, TeamsService>();
            services.AddTransient<IRatingService, RatingService>();
            services.AddScoped<ITranslatorProvider, TranslatorProvider>(provider =>
                new TranslatorProvider("https://translation.googleapis.com/language/translate/v2",
                    configuration.GetValue<string>("google_translation_key")));
            services.AddTransient(typeof(ICRUDService<,>), typeof(CRUDService<,>));
        }

        public static void ConfigureMiddleware(IApplicationBuilder app)
        {
        }
    }
}
