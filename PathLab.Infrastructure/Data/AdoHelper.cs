using Microsoft.Data.SqlClient;
using PathLab.Application.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PathLab.Infrastructure.Data
{
    public class AdoHelper : IAdoHelper
    {
        private readonly IConnectionFactory _connectionFactory;

        public AdoHelper(IConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<DataTable> ExecuteQueryAsync(string query, CommandType commandType, params SqlParameter[] parameters)
        {
            var dt = new DataTable();
            using var connection = (SqlConnection)_connectionFactory.CreateConnection();
            using var cmd = new SqlCommand(query, connection) { CommandType = commandType };
            if (parameters != null) cmd.Parameters.AddRange(parameters);

            await connection.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            dt.Load(reader);
            return dt;
        }

        public async Task<int> ExecuteNonQueryAsync(string query, CommandType commandType, params SqlParameter[] parameters)
        {
            using var connection = (SqlConnection)_connectionFactory.CreateConnection();
            using var cmd = new SqlCommand(query, connection) { CommandType = commandType };
            if (parameters != null) cmd.Parameters.AddRange(parameters);

            await connection.OpenAsync();
            return await cmd.ExecuteNonQueryAsync();
        }
    }
}
