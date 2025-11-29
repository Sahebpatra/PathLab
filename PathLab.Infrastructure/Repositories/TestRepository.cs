
using Newtonsoft.Json;
using PathLab.Application.Contracts.Common;
using PathLab.Application.Contracts.IRepositories;
using PathLab.Application.DTOs;
using System.Data;
using System.Reflection;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace PathLab.Infrastructure.Repositories
{
    public class TestRepository : ITestRepository
    {
        private readonly IDapperHelper _dapper;

        public TestRepository(IDapperHelper dapper)
        {
            _dapper = dapper;
        }

        public async Task<int> AddUpdate(TestDto dto)
        {
            try
            {
                dto.GuidlineAttachmentPath = !string.IsNullOrEmpty(dto.GuidlineAttachmentPath) ? dto.GuidlineAttachmentPath : "";
                var param = new
                {
                    dto.TestId,
                    dto.TestType,
                    dto.Department,
                    dto.TestDesc,
                    dto.TestCode,
                    dto.Price,
                    dto.BarCodeSuffix,
                    dto.Sample,
                    dto.SampleColor,
                    dto.Gender,
                    dto.RequiredField,
                    dto.CollectionGuidline,
                    dto.GuidlineAttachmentPath,
                    dto.AddedBy,

                    DetailsJson = dto.details
                };
                var result = await _dapper.QuerySingleAsync<int>("SP_AddUpdateTest", param, CommandType.StoredProcedure);
                return result!;
            }
            catch (Exception)
            {

                throw;
            }

        }

        public async Task<List<TestDto>> GetTestList(long TestId = 0)
        {
            var result = await _dapper.QueryAsync<TestDto>("SP_GetTestList", new { TestId }, CommandType.StoredProcedure);
            return result.ToList();
        }
    }
}