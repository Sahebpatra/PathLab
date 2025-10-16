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
            services.AddScoped<IDapperHelper, DapperHelper>();
            services.AddScoped<IAdoHelper, AdoHelper>();

            return services;
        }
    }
}
