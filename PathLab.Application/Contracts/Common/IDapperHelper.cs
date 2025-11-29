using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PathLab.Application.Contracts.Common
{
    public interface IDapperHelper
    {
        Task<IEnumerable<T>> QueryAsync<T>(string sql, object? param = null, CommandType commandType = CommandType.Text);
        Task<T?> QuerySingleAsync<T>(string sql, object? param = null, CommandType commandType = CommandType.Text);
        Task<int> ExecuteAsync(string sql, object? param = null, CommandType commandType = CommandType.Text);
    }
}
