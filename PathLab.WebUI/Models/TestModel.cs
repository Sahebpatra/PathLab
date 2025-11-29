namespace PathLab.WebUI.Models
{
    public class TestModel
    {
        public string TestType { get; set; }
        public string Department { get; set; }
        public string? TestDesc { get; set; }
        public string? TestCode { get; set; }
        public string? Price { get; set; }
        public string? BarCodeSuffix { get; set; }
        public string? Sample { get; set; }
        public string? SampleColor { get; set; }
        public string Gender { get; set; }
        public string RequiredField { get; set; }
        public string? CollectionGuidline { get; set; }
        public string? CollectionGuidlinePath { get; set; }

        public IFormFile? GuidlineAttachment { get; set; }
        public bool IsActive { get; set; }
        public string AddedBy { get; set; }
        public string AddedOn { get; set; }
        public string UpdatedBy { get; set; }
        public string UpdatedOn { get; set; }
    }

}
