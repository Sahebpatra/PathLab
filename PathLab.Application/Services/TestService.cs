using PathLab.Application.Contracts.IRepositories;
using PathLab.Application.DTOs;

namespace PathLab.Application.Services
{
    public class TestService : ITestService
    {
        private readonly ITestRepository _testRepo;

        public TestService(ITestRepository testRepo)
        {
            _testRepo = testRepo;
        }

        public async Task<int> AddUpdate(TestDto dto)
        {
            return await _testRepo.AddUpdate(dto);
        }
        public async Task<List<TestDto>> GetTestList(long TestId = 0)
        {
            return await _testRepo.GetTestList(TestId);
        }
    }
}
