using Microsoft.AspNetCore.Mvc;

namespace PathLab.WebUI.Controllers
{
    public class TestsController : Controller
    {
        public IActionResult TestList()
        {
            return View();
        }
        public IActionResult AddTest()
        {
            return View();
        }
    }
}
