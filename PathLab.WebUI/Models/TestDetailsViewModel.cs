namespace PathLab.WebUI.Models
{
    public class TestDetailsViewModel
    {
        public long TestId { get; set; }
        public long TestDetailsID { get; set; }
        public string TestName { get; set; }
        public string TestMethod { get; set; }
        public string TestFieldType { get; set; }
        public string Unit { get; set; }
        public int? ResultRangeMin { get; set; }
        public int? ResultRangeMax { get; set; }
        public string? ResultRenge { get; set; }
        public string? ResultOperator { get; set; }
        public long ParrentId { get; set; }

        public List<TestDetailsViewModel> Children { get; set; } = new();

    }
}
