using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PathLab.Application.Contracts.Common;
using PathLab.Application.Contracts.IRepositories;
using PathLab.Application.Services;
using PathLab.Infrastructure.Data;
using PathLab.Infrastructure.Repositories;
using System.Reflection;

namespace PathLab.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            services.AddSingleton<IConnectionFactory>(new SqlConnectionFactory(connectionString));
            //services.AddSingleton<IConnectionFactory>(provider =>
            //{
            //    var config = provider.GetRequiredService<IConfiguration>();
            //    var connectionString = config.GetConnectionString("DefaultConnection");

            //    if (string.IsNullOrWhiteSpace(connectionString))
            //        throw new InvalidOperationException("Connection string is missing or empty");

            //    return new SqlConnectionFactory(connectionString);
            //});

            services.AddScoped<IDapperHelper, DapperHelper>();
            services.AddScoped<IAdoHelper, AdoHelper>();
            services.AddScoped<ICommonQueries, CommonQueries>();

            // Application Services
            services.Scan(scan => scan
                .FromAssemblies(typeof(TestService).Assembly)
                .AddClasses(classes => classes.InNamespaces("PathLab.Application.Services"))
                .AsMatchingInterface()
                .WithScopedLifetime());

            // Repositories
            services.Scan(scan => scan
                .FromAssemblies(typeof(TestRepository).Assembly)
                .AddClasses(classes => classes.InNamespaces("PathLab.Infrastructure.Repositories"))
                .AsMatchingInterface()
                .WithScopedLifetime());

            return services;
        }
    }
}
