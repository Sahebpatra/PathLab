using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PathLab.Application.DTOs
{
    public class TestDto
    {
        public long TestId { get; set; } = 0;
        public string TestType { get; set; }
        public string? TestTypeText { get; set; }
        public string Department { get; set; }
        public string? DepartmentText { get; set; }
        public string? TestDesc { get; set; }
        public string? TestCode { get; set; }
        public string? Price { get; set; }
        public string? BarCodeSuffix { get; set; }
        public string? Sample { get; set; }
        public string? SampleText { get; set; }
        public string? SampleColor { get; set; }
        public string? SampleColorText { get; set; }
        public string Gender { get; set; }
        public string RequiredField { get; set; }
        public string? CollectionGuidline { get; set; }
        public string? GuidlineAttachmentPath { get; set; }
        public IFormFile? GuidlineAttachment { get; set; }
        public bool IsActive { get; set; }
        public string AddedBy { get; set; }
        public string AddedOn { get; set; }
        public string UpdatedBy { get; set; }
        public string UpdatedOn { get; set; }

        //public List<TestDetailsDto>? details { get; set; }
        public string? details { get; set; }
    }
}
