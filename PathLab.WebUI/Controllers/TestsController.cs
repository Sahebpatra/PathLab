using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using PathLab.Application.DTOs;
using PathLab.Application.Services;
using PathLab.WebUI.Models;
using System.Net;
using System.Reflection;

namespace PathLab.WebUI.Controllers
{
    public class TestsController : Controller
    {
        private readonly ITestService _testService;
        private readonly IMapper _mapper;
        //List<TestDetailsDto> detaillist = new();

        public TestsController(ITestService testService, IMapper mapper)
        {
            _testService = testService;
            //_mapper = mapper;
        }
        public async Task<IActionResult> TestList()
        {
            try
            {
                var data = await _testService.GetTestList();
                return View(data);
            }
            catch (Exception)
            {
                throw;
            }

        }
        public IActionResult AddEditTest(long TestId = 0)
        {
            try
            {
                ViewBag.TestId = TestId;
                return View();
            }
            catch (Exception)
            {
                throw;
            }

        }
        [HttpPost]
        public async Task<IActionResult> SubmitTest([FromForm] TestDto model, [FromForm] string details)
        {
            try
            {
                model.AddedBy = "1";//Need to add logged in user id
                //model.details = JsonConvert.DeserializeObject<List<TestDetailsDto>>(details);
                model.details = details;

                if (model.CollectionGuidline == "1" && model.GuidlineAttachment != null && model.GuidlineAttachment.Length > 0)
                {
                    var fileName = await UploadFile(model.GuidlineAttachment, model.TestCode);

                    //var fileName = Path.GetFileName(model.GuidlineAttachment.FileName);
                    //var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                    //if (!Directory.Exists(path))
                    //{
                    //    Directory.CreateDirectory(path);
                    //}
                    //var currentTime = DateTime.Now.ToString("yyyyMMddHHmmss");
                    //fileName = $"{model.TestCode}_{currentTime}";
                    //var savePath = Path.Combine(path, fileName);

                    //using (var stream = new FileStream(savePath, FileMode.Create))
                    //{
                    //    await model.GuidlineAttachment.CopyToAsync(stream);
                    //}
                    model.GuidlineAttachmentPath = fileName;
                }
                var result = await _testService.AddUpdate(model);
                var msg = model.TestId > 0 ? "Updated" : "Submitted";
                if (result > 0)
                    return Ok(new { success = true, message = $"Test {msg} successfully." });
                return Ok(new { success = false, message = "Submission failed." });
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<JsonResult> GetTestList(long TestId = 0)
        {
            try
            {
                var data = await _testService.GetTestList(TestId);
                return Json(data);
            }
            catch (Exception)
            {
                throw;
            }

        }

        private async Task<string> UploadFile(IFormFile file, string fileNamePrefix)
        {
            try
            {
                var fileName = Path.GetFileName(file.FileName);
                var ext = Path.GetExtension(fileName);
                var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }
                var currentTime = DateTime.Now.ToString("yyyyMMddHHmmss");
                fileName = $"{fileNamePrefix ?? "TestDoc"}_{currentTime}{ext}";
                var savePath = Path.Combine(path, fileName);

                using (var stream = new FileStream(savePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                return fileName;
            }
            catch (Exception)
            {
                throw;
            }
        }
        //public async Task<IActionResult> TestDetailsPartial()
        //{
        //    var data = await GetTestDetailsList();
        //    TempData["TestDetailsList"] = JsonConvert.SerializeObject(data);
        //    TempData.Keep("TestDetailsList");

        //    return PartialView("_AddTestDetailsPartial", data);
        //}

        //[HttpPost]
        //public async Task<IActionResult> AddTestDetails(TestDetailsDto obj)
        //{
        //    List<TestDetailsDto> list = new();

        //    if (TempData["TestDetailsList"] != null)
        //        list = JsonConvert.DeserializeObject<List<TestDetailsDto>>(TempData["TestDetailsList"].ToString());
        //    else
        //        list = await GetTestDetailsList();

        //    list.Add(obj);

        //    TempData["TestDetailsList"] = JsonConvert.SerializeObject(list);
        //    TempData.Keep("TestDetailsList");
        //    return PartialView("_AddTestDetailsPartial", list);
        //}

        //public async Task<List<TestDetailsDto>> GetTestDetailsList()
        //{
        //    var data = await _testService.GetTestDetailsList();

        //    var parents = data
        //        .Where(t => t.ParrentId == 0)
        //        .Select(p => new TestDetailsDto
        //        {
        //            TestDetailsID = p.TestDetailsID,
        //            ParrentId = p.ParrentId,
        //            TestName = p.TestName,
        //            FieldType = p.FieldType,
        //            Unit = p.Unit,
        //            ResultRenge = p.ResultRenge,
        //            Children = data.Where(c => c.ParrentId == p.TestDetailsID).ToList()
        //        })
        //        .ToList();

        //    return parents;
        //}

        //[HttpPost]
        //public IActionResult RemoveTestDetails(int id)
        //{
        //    var list = new List<TestDetailsDto>();
        //    if (TempData["TestDetailsList"] != null)
        //    {
        //        list = JsonConvert.DeserializeObject<List<TestDetailsDto>>(TempData["TestDetailsList"].ToString());
        //    }
        //    var itemToRemove = list.FirstOrDefault(x => x.TestDetailsID == id);
        //    if (itemToRemove != null)
        //    {
        //        list.Remove(itemToRemove);
        //    }
        //    TempData["TestDetailsList"] = JsonConvert.SerializeObject(list);
        //    TempData.Keep("TestDetailsList");

        //    return PartialView("_AddTestDetailsPartial", list);
        //}

    }
}
