var AddTest = (function ($, commonJs) {
    let testDetailsList = [], fetchedDetailsList = [];
    $(document).ready(function () {
        console.log("AddTest initialized");
        $("#Department").select2({width: "100%"});
        const testId = $("#hdnTestId").val();
        eventHandlers();
        searchbleSelect();
        toggleResultRange();
        toogleCriticalRange();
        ShowHideGuidlineAttchment();
        //unitTypeChange();
        if (testId != "0") {
            getTestById(testId);
            $("#submitTest").html('<i class="fa fa-sync" aria-hidden="true"></i>Update');
        }
        resetForm();

    });

    //$(window).on("load", function () {
    //    resetForm();
    //});
    function eventHandlers() {
        $("#UnitFieldType").on("change", toggleResultRange);
        $("#CriticalRange").on("change", toogleCriticalRange);
        //$("#UnitFieldType").on("change", unitTypeChange);
        //$('[name="FieldType"]').on("change", toggleFieldForm);
        $("#btnSave").on("click", addMultiTypeRow);
        $("#btnAddField").on("click", addsingleTypeRow);
        $("#submitTest").on("click", submitTest);
        $(document).on("click", ".toggle-child", toggleChild);
        //$(document).on('click', '[data-dlt="dltchild"]', removeRow);
        $(document).on('click', '[data-dlt="dltRow"]', removeRow);
        $(document).on('click', '[data-ctrl="checkEdit"]', editMultiRow);
        $(document).on("change", '#FieldType1,#FieldType2', toggleFieldForm);
        $(document).on("change", 'input[name="CollectionGuidline"]', ShowHideGuidlineAttchment);
    }
    function getTestById(TestId) {
        try {
            commonJs.ajax.Get("/Tests/GetTestList?TestId="+TestId,
                function (res) {
                    console.log("response:", res);
                    if (res.length == 1) {
                        const test = res[0];
                        $("#hdnTestId").val(test.TestId);
                        $("#TestType").val(test.TestType);
                        //$("#Department").val(test.Department);
                        $("#Department").val(test.Department).trigger("change");
                        $("#TestDesc").val(test.TestDesc);
                        $("#TestCode").val(test.TestCode);
                        $("#Price").val(test.Price);
                        $("#BarCodeSuffix").val(test.BarCodeSuffix);
                        $("#Sample").val(test.Sample);
                        $("#SampleColor").val(test.SampleColor);
                        $("[name='Gender'][value='" + test.Gender + "']").prop("checked", true);
                        $("[name='RequiredField'][value='" + test.RequiredField + "']").prop("checked", true);
                        $("[name='CollectionGuidline'][value='" + test.CollectionGuidline + "']").prop("checked", true);
                        $("#TestCode").val(test.TestCode);
                        $("#docViwer").html(`<a href="/uploads/${test.GuidlineAttachmentPath}" target="_blank">View</a>`)

                        const details = JSON.parse(test.details);
                        console.log("parse details:", details);
                        if (details) {
                            fetchedDetailsList = [...details]
                        }
                        //filterData();
                        renderTestTable();
                        //console.log("Test details:", fetchedDetailsList);
                    }
                },
                function (xhr) {
                    commonJs.notify.error("Error in fetching records.");
                }
            );
        } catch (err) {
            commonJs.notify.error("Internal server error." + err.message);
        }

    };
    function filterData() {
        testDetailsList = fetchedDetailsList
            .filter(t => t.ParrentId == 0)
            .map(p => {
                return {
                    ...p, // keep all parent properties
                    Children: fetchedDetailsList.filter(c => c.ParrentId == p.RowId).map(c => ({ ...c, Children: [] }))
                };
            });
    }
    function renderTestTable() {
        const tbody = document.getElementById("testTableBody");
        tbody.innerHTML = "";
        //filter data for Table Binding
        filterData();
        testDetailsList.forEach((parent, pIndex) => {
            const fieldTypeText = parent.FieldType === "1" ? "Single" : "Multiple";
            // Parent Row
            var prntrange = `${parent.ResultRangeMin}-${parent.ResultRangeMax}`;
            pIndex++
            let parentRow = `
            <tr class="parent-row" data-parent-id="${parent.RowId}">
                <td >
                    <input type="checkbox" id="chkselect_${parent.RowId}" data-ctrl="checkEdit" data-id="${parent.RowId}"/>
                </td>
                <td>${parent.TestName}</td>
                <td>${fieldTypeText}</td>
                <td>${parent.FieldType == "1" ? parent.Unit : ""}</td>
                <td>${parent.FieldType == "1" ? prntrange : ""}</td>
                <td>${parent.FieldType == "1" ?'<input type="checkbox" />':''}</td>
                <td>
                    <i class="far fa-trash-alt text-danger me-2" data-dlt="dltRow" data-row-id="${parent.RowId}" style="cursor:pointer"></i>
                    ${parent.FieldType == "2" ? `<i class="far fa-plus-square toggle-child" style="cursor:pointer"></i>` : ""}
                </td>
            </tr>
        `;

            tbody.innerHTML += parentRow;

            // Child Rows
            if (parent.Children && parent.Children.length > 0) {
                let childRows = `<tr class="child-table child-of-${parent.RowId}"
                style="display:none;"><td colspan="7"><table class="table mb-0"><tbody>`;

                parent.Children.forEach((child, cIndex) => {
                    const childFieldText = child.FieldType === "1" ? "Single" : "Multiple";
                    var chldrange = `${child.ResultRangeMin}-${child.ResultRangeMax}`;
                    childRows += `
                    <tr>
                        <td><input type="checkbox" id="chkselect_${child.RowId}" data-ctrl="checkEdit" data-id="${child.RowId}"/></td>
                        <td>${child.TestName}</td>
                        <td>${childFieldText}</td>
                        <td>${child.Unit}</td>
                        <td>${chldrange}</td>
                        <td><input type="checkbox" /></td>
                        <td><i class="far fa-trash-alt text-danger" data-dlt="dltRow" data-row-id="${child.RowId}" style="cursor:pointer"></i></td>
                    </tr>`;
                });

                childRows += `</tbody></table></td></tr>`;
                tbody.innerHTML += childRows;
            }
            if (parent.FieldType === "2" && parent.Children.length <= 0) {
                let childRows = `<tr class="child-table child-of-${parent.RowId}"
                style="display:none;"><td colspan="7"><table class="table mb-0" id="childTable"><tbody>`;
                childRows += `<tr><td colspan="7" class="text-center">Add child Test</td></tr></tbody></table></td></tr>`;
                tbody.innerHTML += childRows;
            }
        });
    }
    function addMultiTypeRow(e) {
        e.preventDefault();
        try {
            /*const parsedValues = commonJs.FormParser.GetFormObject("frmAddTestDetails");*/
            var isValid = validateRequiredForm("multiForm");
            if (!isValid) {
                return;
            }
            if ($("#btnSave").text() == "Update") {
                const Id = parseInt($("#hdnRowId2").val());
                const details = fetchedDetailsList.find(x => x.RowId == Id);
                details.TestName = $("#TestName2").val();
                renderTestTable();
                $(`[data-ctrl="checkEdit"][data-id="${Id}"]`).prop('checked', true);
            } else {
                $('[name="RowId"]').val(parseInt(fetchedDetailsList.length) + 1);
                const data = {
                    FieldType: $("#FieldType2").val(),
                    TestName: $("#TestName2").val(),
                    RowId: $("#hdnRowId2").val(),
                    TestId: 0,
                    TestDetailsID: 0,
                    TestMethod: "",
                    UnitFieldType: "1",
                    Unit: "",
                    ResultRangeMin: "",
                    ResultRangeMax: "",
                    //ResultRenge: $("#ResultRenge").val(),
                    ResultOperator: "",
                    ParrentId: 0
                };
                console.log(data)

                fetchedDetailsList.push(data);
                console.log(fetchedDetailsList)
                renderTestTable();
                if (data.FieldType == "2") {
                    $('[name="FieldType"]').val("1");
                    resetForm();
                }
            }
        } catch (err) {
            commonJs.notify.error("Error: " + err.message);
        }
    }
    function addsingleTypeRow(e) {
        e.preventDefault();
        var isValid = validateRequiredForm("singleForm");
        if (!isValid) {
            return;
        }
        try {
            //const parsedValues = commonJs.FormParser.GetFormObject("frmAddTestDetails");
            const data = {
                TestId: 0,
                TestDetailsID: 0,
                TestName: $("#TestName1").val(),
                FieldType: $("#FieldType1").val(),
                TestMethod: $("#TestMethod").val(),
                UnitFieldType: $("#UnitFieldType").val(),
                Unit: $("#Unit").val(),
                ResultRangeMin: $("#ResultRangeMin").val(),
                ResultRangeMax: $("#ResultRangeMax").val(),
                CriticalRange: $("#CriticalRange").prop("checked"),
                CriticalRangeMin: $("#CriticalRangeMin").val(),
                CriticalRangeMax: $("#CriticalRangeMax").val(),
                ResultOperator: $("#ResultOperator").val(),
                ParrentId: $("#FieldType2").val() == "2" ? $("#hdnParrentId1").val() : 0,
                RowId: $("#hdnRowId1").val(),
                Children: []
            };
            if ($("#btnAddField").text() == "Update Field") {
                data.RowId = $("#hdnRowId1").val();
                const details = fetchedDetailsList.find(x => x.RowId == data.RowId);
                details.TestName = data.TestName;
                details.FieldType = data.FieldType;
                details.TestMethod = data.TestMethod;
                details.UnitFieldType = data.UnitFieldType;
                details.Unit = data.Unit;
                details.ResultRangeMin = data.ResultRangeMin;
                details.ResultRangeMax = data.ResultRangeMax;
                details.CriticalRange = data.CriticalRange;
                details.CriticalRangeMin = data.CriticalRangeMin;
                details.CriticalRangeMax = data.CriticalRangeMax;
                details.ResultOperator = data.ResultOperator;
                renderTestTable();
                $(`[data-ctrl="checkEdit"][data-id="${data.RowId}"]`).prop('checked', true);
            }
            else {
                $('[name="RowId"]').val(parseInt(fetchedDetailsList.length) + 1);
                data.RowId = $("#hdnRowId1").val();
                fetchedDetailsList.push(data);
                renderTestTable();
                resetForm();
                if (data.FieldType == "2") {
                    $('[name="FieldType"]').val("1");
                    $("#FieldType1,#FieldType2").prop("disabled", false);
                    toggleFieldForm();
                }
            }
            let icon = $(`tr[data-parent-id='${data.ParrentId}'] .toggle-child`);
            if (icon.length > 0) {
                toggleChild.call(icon[0]);
            }
        } catch (err) {
            commonJs.notify.error("Error: " + err.message);
        }
    };
    function editMultiRow() {
        let isChecked = $('[data-ctrl="checkEdit"]').is(':checked');
        const Id = parseInt($(this).data('id'));
        const details = fetchedDetailsList.filter(x => x.RowId == Id);
        if (isChecked && details) {
            $("#FieldType1,#FieldType2").prop("disabled", true);
            if (details[0].FieldType == 2) {
                $("#multiForm,#singleForm").show();
                $("#btnSave").text("Update");
                $("#TestName2").val(details[0].TestName);
                $("#FieldType2").val(details[0].FieldType);
                $("#hdnParrentId1").val(Id);
                $("#hdnRowId2").val(details[0].RowId);
                $("#hdnRowId1").val(details[0].RowId);
                console.log(details);
            } else {
                $("#singleForm").show();
                $("#btnAddField").text("Update Field");
                $("#TestName1").val(details[0].TestName);
                $("#FieldType1").val(details[0].FieldType);
                $("#TestMethod").val(details[0].TestMethod);
                $("#UnitFieldType").val(details[0].UnitFieldType);
                $("#Unit").val(details[0].Unit);
                //$("#CriticalRange").val(details[0].CriticalRange);
                const isCritical = details[0].CriticalRange == "true" || details[0].CriticalRange === true;
                $("#CriticalRange").prop("checked", isCritical);
                $("#CriticalRangeMin").val(details[0].CriticalRangeMin);
                $("#CriticalRangeMax").val(details[0].CriticalRangeMax);
                $("#ResultRangeMin").val(details[0].ResultRangeMin);
                $("#ResultRangeMax").val(details[0].ResultRangeMax);
                $("#ResultOperator").val(details[0].ResultOperator);
                $("#hdnParrentId1").val(details[0].ParrentId);
                $("#hdnRowId1").val(details[0].RowId);
                //$("#hdnRowId2").val(details[0].RowId);
                //$("#FieldType2").attr("disabled", true);
                console.log(details);
            }
        } else {
            resetForm();
            $("#btnSave").html('<i class="fa fa-plus">Save');
            $("#btnAddField").html('<i class="fa fa-plus"></i>Save Field');
            $("#FieldType1,#FieldType2").prop("disabled", false);
        }
    }
    function searchbleSelect() {
        $('.select2').select2({
            width: '100%',
            placeholder: 'Select an option',
            allowClear: true
        });
    };
    function toggleFieldForm() {
        const id = $(this).attr("id");
        const fieldType = $(this).val(); // This now refers to the element that changed

        // Prevent null issues
        if (typeof fieldType === "undefined" || fieldType === null) return;

        if (id === "FieldType1") {
            $('#FieldType2').val(fieldType);
        } else if (id === "FieldType2") {
            $('#FieldType1').val(fieldType);
        }

        if (fieldType === "1") {
            $("#multiForm").hide();
            $("#singleForm").show();
        } else {
            $("#multiForm").show();
            $("#singleForm").hide();
        }
    }
    function toggleResultRange() {
        var input = $("#UnitFieldType").val();
        if (input === "3") {
            $("#divResultOperator").show();
            $("#divResultRangeMax").show();
            $("#divResultRangeMin").hide();
        }
        else if (input === "2") {
            $("#divResultOperator").hide();
            $("#divResultRangeMin").hide();
            $("#divResultRangeMax").hide();
        }
        else {
            $("#divResultOperator").hide();
            $("#divResultRangeMin").show();
        }

    }
    function toogleCriticalRange() {
        let isChecked = $('#CriticalRange').is(':checked');
        if (isChecked) {
            $(".toogle-CriticalRange").show();
        } else {
            $(".toogle-CriticalRange").hide();
        }
    }
    function ShowHideGuidlineAttchment() {
        const isAttch = $("[name='CollectionGuidline']:checked").val();
        if (isAttch == "1") {
            $("#GuidlineAttachment").prop("disabled",false);
            $("#GuidlineAttachment").prop("required", true);
            $(`label[for="GuidlineAttachment"]`).addClass("required");
        } else {
            $("#GuidlineAttachment").prop("required", false);
            $("#GuidlineAttachment").prop("disabled", true);
            $(`label[for="GuidlineAttachment"]`).removeClass("required");
        }
    }
    //function unitTypeChange() {
    //    let val = $("#UnitFieldType").val();
    //    if (val == "1" || val == "3") {

    //        $("#Unit").attr("type", "number")
    //    } else {

    //        $("#Unit").attr("type", "text")
    //    }
    //}
    function submitTest() {
        try {
            var isValid = validateRequiredForm("addTestForm");
            if (!isValid) {
                return;
            }
            const parsedValues = commonJs.FormParser.GetFormData("addTestForm");
            //parsedValues.details = fetchedDetailsList;
            parsedValues.append('details', JSON.stringify(fetchedDetailsList));
            //console.log("Parsed values:", parsedValues);
            //for console only
            const plainObj = {};
            parsedValues.forEach((value, key) => {
                plainObj[key] = value;
            });
            console.log("obj:" + JSON.stringify(plainObj));
            var url = "/Tests/SubmitTest";
            commonJs.ajax.FormPost(url, parsedValues,
                function (res) {
                    getTestById(res);
                    commonJs.toaster.success(res.message);
                },
                function (xhr) {
                    commonJs.toaster.error("Internal Server Error.");
                }
            );

        } catch (err) {
            commonJs.toaster.error("Error: " + err.message);
        }

    }
    function toggleChild() {
        var icon = $(this);
        var parentRow = icon.closest("tr");
        var parentId = parentRow.data("parent-id");
        var childTable = $(".child-of-" + parentId);

        // Toggle with animation
        childTable.toggle();

        // Change icon between + and -
        if (childTable.is(":visible")) {
            icon.removeClass("fa-plus-square").addClass("fa-minus-square");
        } else {
            icon.removeClass("fa-minus-square").addClass("fa-plus-square");
        }

    }
    function removeRow(e) {
        e.preventDefault();
        const Id = parseInt($(this).data('row-id'));
        fetchedDetailsList = fetchedDetailsList.filter(x => x.RowId != Id);
        fetchedDetailsList = fetchedDetailsList.filter(x => x.ParrentId != Id);
        //const parent = fetchedDetailsList[index - 1];
        //if (!parent) return;
        //fetchedDetailsList.splice(index - 1, 1);
        //fetchedDetailsList = fetchedDetailsList.filter(x => x.ParrentId !== index - 1);
        renderTestTable();
    }
    function removeChild() {
        const parentId = parseInt($(this).data('row-id'));
        const childId = parseInt($(this).data('child-id'));
        const parent = testDetailsList.find(x => x.TestDetailsID === parentId);
        if (parent) {
            parent.Children = parent.Children.filter(c => c.TestDetailsID !== childId);
        }
        renderTestTable();
    }
    function resetForm() {
        // Reset both forms
        $("#multiForm")[0].reset();
        $("#singleForm")[0].reset();

        // Re-run your toggle logic
        const $dropdown = $("#FieldType1").length ? $("#FieldType1") : $("#FieldType2");
        if ($dropdown.length) toggleFieldForm.call($dropdown[0]);
    }
    function validateRequiredForm(formId) {
        let isValid = true;
        const form = $("#" + formId);

        form.find("[required]").each(function () {
            const tag = $(this).prop("tagName").toLowerCase();

            if (tag === "custom-dropdown") {
                const val = $(this).attr("selected-value") || "0";
                if (val === "0" || val === "") {
                    $(this).addClass("is-invalid");
                    isValid = false;
                } else {
                    $(this).removeClass("is-invalid");
                }
            }
            // file input validation
            else if ($(this).attr("type") === "file") {
                const fileVal = $(this).val();
                const docViewer = $("#docViwer a"); // check if anchor exists inside span
                let hasLink = false;

                if (docViewer.length > 0) {
                    const href = docViewer.attr("href");
                    if (href && href.trim() !== "") {
                        hasLink = true;
                    }
                }
                if (!fileVal && !hasLink) {
                    $(this).addClass("is-invalid");
                    isValid = false;
                } else {
                    $(this).removeClass("is-invalid");
                }
            }
            // for normal input 
            else {
                if (!$(this).val()) {
                    $(this).addClass("is-invalid");
                    isValid = false;
                } else {
                    $(this).removeClass("is-invalid");
                }
            }
        });

        if (!isValid) {
            commonJs.toaster.error("Please fill all required fields!");
        }

        return isValid;
    }
    $(document).on("input change", ".is-invalid", function () {
        if ($(this).val()) {
            $(this).removeClass("is-invalid");
        }
    });

})(jQuery, commonJs);