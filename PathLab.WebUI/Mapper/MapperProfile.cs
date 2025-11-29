using AutoMapper;
using PathLab.Application.DTOs;
using PathLab.WebUI.Models;
namespace PathLab.WebUI.Mapper
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<TestModel, TestDto>().ReverseMap();
        }
    }   
}
