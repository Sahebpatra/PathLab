using Microsoft.Data.SqlClient;
using PathLab.Application.Common.Interfaces;
using System.Data;

namespace PathLab.Infrastructure.Data
{
    public class SqlConnectionFactory : IConnectionFactory
    {
        private readonly string _connectionString;

        public SqlConnectionFactory(string connectionString)
        {
            _connectionString = connectionString;
        }

        public IDbConnection CreateConnection()
        {
            return new SqlConnection(_connectionString);
        }
    }
}

