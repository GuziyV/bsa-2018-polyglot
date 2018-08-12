﻿using Microsoft.Extensions.DependencyInjection;
using Polyglot.BusinessLogic.Implementations;
using Polyglot.BusinessLogic.Interfaces;
using Polyglot.BusinessLogic.Services;

namespace Polyglot.BusinessLogic
{
    public static class BusinessLogicModule
    {
        /// <summary>
        /// Register DI dependencies
        /// </summary>
        /// <param name="services"></param>
        public static void ConfigureServices(IServiceCollection services)
        {
            services.AddTransient<IProjectService, ProjectService>();
            services.AddTransient<IComplexStringService, ComplexStringService>();
            services.AddTransient<IUserService, UserService>();
        }
    }
}