using PathLab.Application.DTOs;

namespace PathLab.Application.Contracts.Common
{
    public interface ICommonQueries
    {
        Task<IEnumerable<DropdownItemDto>> GetOptionItemsAsync(string dropdownType, int? LabId = null, int? serviceId = null);
    }
}
