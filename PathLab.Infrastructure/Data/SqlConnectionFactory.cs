using Microsoft.Data.SqlClient;
using PathLab.Application.Contracts.Common;
using System.Data;

namespace PathLab.Infrastructure.Data
{
    public class SqlConnectionFactory : IConnectionFactory
    {
        private readonly string _connectionString;

        public SqlConnectionFactory(string connectionString)
        {
            Console.WriteLine($"Connection string received: {connectionString}");

            _connectionString = connectionString;
        }

        public IDbConnection CreateConnection()
        {
            return new SqlConnection(_connectionString);
        }
    }
}

