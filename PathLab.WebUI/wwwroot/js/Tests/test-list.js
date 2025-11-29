var TestList = (function ($, commonJs){
    $(document).ready(function () {
        console.log("Test List initialized");
        eventHandlers();

        new DataTable('#testTable', {
            ordering: false,
            //sorting:false,
            layout: {
                //topStart: 'info',
                //bottom: 'paging',
                //bottomStart: null,
                //bottomEnd: null
            }
        });
    });
    function eventHandlers() {
        $(document).on('click', '[data-ctrl="edit-test"]', editTest);
        $(document).on('click', '#btnAddNew', addNewTest);
    }
    function editTest(e) {
        const TestId = parseInt($(this).data('testid'));
        window.location.href = "/Tests/AddEditTest?TestId=" + TestId;

    }
    function addNewTest(e) {
        const TestId = parseInt($(this).data('testid'));
        window.location.href = "/Tests/AddEditTest";

    }
})(jQuery, commonJs);