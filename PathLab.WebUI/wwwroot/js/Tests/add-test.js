var AddTest = (function ($, commonJs) {
    $(document).ready(function () {
        console.log("AddTest initialized");

        SearchbleSelect();
        ShowHideResultRange();
        $("#UnitFieldType").change(ShowHideResultRange)
    });
    function SearchbleSelect() {
        $('.select2').select2({
            width: '100%',
            placeholder: 'Select an option',
            allowClear: true
        });
    };

    function ShowHideResultRange() {
        var input = $("#UnitFieldType").val();
        if (input === "3") {
            $("#divResultOperator").show();
            $("#divResultRangeMin").hide();
        } else {
            $("#divResultOperator").hide();
            $("#divResultRangeMin").show();
        }

    }

})(jQuery, commonJs);