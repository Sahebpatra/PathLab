using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Newtonsoft.Json;
using PathLab.Application.Contracts.Common;
using System.ComponentModel.DataAnnotations;


namespace PathLab.WebUI.TagHelpers
{
    [HtmlTargetElement("custom-dropdown")]
    public class DropdownTagHelper : TagHelper
    {
        private readonly ICommonQueries _queries;

        [HtmlAttributeName("dropdown-for")]
        public string DropdownType { get; set; }

        [Required]
        [HtmlAttributeName("name")]
        public string Name { get; set; }


        [HtmlAttributeName("id")]
        public string Id { get; set; }

        [HtmlAttributeName("class")]
        public string CssClass { get; set; }

        [HtmlAttributeName("lab-id")]
        public int? LabId { get; set; }

        [HtmlAttributeName("service-id")]
        public int? ServiceId { get; set; }
        [HtmlAttributeName("required")]
        public bool Required { get; set; }

        [HtmlAttributeName("disabled")]
        public bool Disabled { get; set; }

        [HtmlAttributeName("readonly")]
        public bool ReadOnly { get; set; }

        [HtmlAttributeName("selected-value")]
        public string DeafaultSelectedValue { get; set; }

        [ViewContext]
        [HtmlAttributeNotBound]
        public ViewContext ViewContext { get; set; }

        public DropdownTagHelper(ICommonQueries queries)
        {
            _queries = queries;
        }
        public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
        {
            try
            {
                output.TagName = "select";
                output.Attributes.SetAttribute("name", Name);
                output.Attributes.SetAttribute("id", Id ?? Name);
                output.Attributes.SetAttribute("class", $"{CssClass ?? ""} form-control");
                if (Required)
                    output.Attributes.SetAttribute("required", "required");
                if (Disabled)
                    output.Attributes.SetAttribute("disabled", "disabled");
                if (ReadOnly)
                    output.Attributes.SetAttribute("readonly", "readonly");


                var selectedValue = DeafaultSelectedValue ?? ViewContext.ViewData.Eval(Name ?? DropdownType)?.ToString();
                var LabId = 1;

                var items = await _queries.GetOptionItemsAsync(DropdownType ?? Name, LabId, ServiceId);
                if(string.IsNullOrWhiteSpace(selectedValue))
                    output.Content.AppendHtml($"<option value=\"\"> Select an option </option>");

                var childContent = await output.GetChildContentAsync();
                output.Content.AppendHtml(childContent);
                if (items.Count() > 0)
                {
                    foreach (var item in items)
                    {
                        var selectedAttr = item.ValueCode == selectedValue ? " selected" : "";
                        output.Content.AppendHtml($"<option value=\"{item.ValueCode}\"{selectedAttr}>{item.DisplayText}</option>");
                    }
                }

            }
            catch (Exception)
            {

                throw;
            }

        }
    }
}


