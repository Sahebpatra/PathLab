using Dapper;
using PathLab.Application.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PathLab.Infrastructure.Data
{
    public class DapperHelper : IDapperHelper
    {
        private readonly IConnectionFactory _connectionFactory;

        public DapperHelper(IConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<IEnumerable<T>> QueryAsync<T>(string sql, object? param = null, CommandType commandType = CommandType.Text)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<T>(sql, param, commandType: commandType);
        }

        public async Task<T?> QuerySingleAsync<T>(string sql, object? param = null, CommandType commandType = CommandType.Text)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QuerySingleOrDefaultAsync<T>(sql, param, commandType: commandType);
        }

        public async Task<int> ExecuteAsync(string sql, object? param = null, CommandType commandType = CommandType.Text)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.ExecuteAsync(sql, param, commandType: commandType);
        }
    }
}
