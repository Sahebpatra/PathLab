using Microsoft.AspNetCore.Mvc;

namespace PathLab.WebUI.Controllers
{
    public class LoginController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
