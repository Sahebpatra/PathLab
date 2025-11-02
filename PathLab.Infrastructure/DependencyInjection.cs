using Microsoft.Extensions.DependencyInjection;
using PathLab.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using PathLab.Infrastructure.Data;

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

            return services;
        }
    }
}
