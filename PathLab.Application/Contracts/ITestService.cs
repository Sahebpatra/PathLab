using PathLab.Application.DTOs;

namespace PathLab.Application.Services
{
    public interface ITestService
    {
        Task<int> AddUpdate(TestDto dto);
        Task<List<TestDto>> GetTestList(long TestId = 0);
    }
}
