using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using PathLab.Application.Contracts.Common;
using PathLab.Application.DTOs;
using PathLab.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PathLab.Infrastructure
{
    public class CommonQueries : ICommonQueries
    {
        private readonly IDapperHelper _dapper;

        public CommonQueries(IConfiguration config, IDapperHelper dapper)
        {
            _dapper = dapper;
        }

        public async Task<IEnumerable<DropdownItemDto>> GetOptionItemsAsync(string dropdownType, int? labId = null, int? serviceId = null)
        {
            try
            {
                var sql = "";
                if (dropdownType == "Department")
                {
                    sql = @"SELECT DeptId AS ValueCode, DeptName AS DisplayText FROM Mst_Departments WHERE IsActive = 1 ORDER BY DeptName";
                    return await _dapper.QueryAsync<DropdownItemDto>(sql);
                }
                else
                {

                    sql = @"
                            SELECT ValueCode, DisplayText
                            FROM Mst_OptionItem
                            WHERE DropdownType = @DropdownType
                              AND IsActive = 1
                              AND (@LabId IS NULL OR LabId = @LabId OR LabId IS NULL)
                              AND (@ServiceId IS NULL OR ServiceId = @ServiceId OR ServiceId IS NULL)
                            ORDER BY SortOrder";
                }
                var param = new
                {
                    DropdownType = dropdownType,
                    LabId = labId,
                    ServiceId = serviceId
                };
                var ddl = await _dapper.QueryAsync<DropdownItemDto>(sql, param);
                return ddl;
            }
            catch (Exception)
            {

                throw;
            }

        }
    }
}
