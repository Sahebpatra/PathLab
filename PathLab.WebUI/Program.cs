using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using PathLab.Infrastructure;
using PathLab.WebUI.Mapper;
using System.Text.Json;


var builder = WebApplication.CreateBuilder(args);

// Add Infrastructure
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddAutoMapper(typeof(MapperProfile));

// Add services to the container.
builder.Services.AddControllersWithViews().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = null;
});
builder.Services.AddRazorPages();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
