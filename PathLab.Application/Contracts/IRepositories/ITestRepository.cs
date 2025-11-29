using PathLab.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PathLab.Application.Contracts.IRepositories
{
    public interface ITestRepository
    {
        Task<int> AddUpdate(TestDto dto);
        Task<List<TestDto>> GetTestList(long TestId = 0);
    }
}
