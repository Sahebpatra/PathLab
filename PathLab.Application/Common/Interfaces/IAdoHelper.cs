using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PathLab.Application.Common.Interfaces
{
    public interface IAdoHelper
    {
        Task<DataTable> ExecuteQueryAsync(string query, CommandType commandType, params SqlParameter[] parameters);
        Task<int> ExecuteNonQueryAsync(string query, CommandType commandType, params SqlParameter[] parameters);
    }
}
