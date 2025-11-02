using PathLab.Application.DTOs;

namespace PathLab.Application.Common.Interfaces
{
    public interface ICommonQueries
    {
        Task<IEnumerable<DropdownItemDto>> GetOptionItemsAsync(string dropdownType, int? LabId = null, int? serviceId = null);
    }
}
