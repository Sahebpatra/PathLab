using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PathLab.Application.DTOs
{

    public class TestDetailsDto
    {
        public long TestId { get; set; } = 0;
        public long TestDetailsID { get; set; } = 0;
        public string TestName { get; set; }
        public string FieldType { get; set; }
        public string TestMethod { get; set; }
        public string UnitFieldType { get; set; }
        public string Unit { get; set; }
        public int? ResultRangeMin { get; set; }
        public int? ResultRangeMax { get; set; }
        public string? ResultRenge { get; set; }
        public string? ResultOperator { get; set; }
        public long ParrentId { get; set; } = 0;
        public long RowId { get; set; }
        public List<TestDetailsDto>? Children { get; set; }

    }
}

