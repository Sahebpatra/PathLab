var commonJs = (function ($) {
    $(document).ready(function () {
        console.log("Common Js Ready");
    });

    const LocalStorage = {
        set: function (key, value) {
            const isObject = typeof value === 'object' && value !== null;
            localStorage.setItem(key, isObject ? JSON.stringify(value) : value);
        },
        get: function (key) {
            const raw = localStorage.getItem(key);
            try {
                return JSON.parse(raw);
            } catch {
                return raw;
            }
        },
        remove: function (key) {
            localStorage.removeItem(key);
        },
        clear: function () {
            localStorage.clear();
        }
    };

    const Session = {
        set: function (key, value) {
            const isObject = typeof value === 'object' && value !== null;
            sessionStorage.setItem(key, isObject ? JSON.stringify(value) : value);
        },
        get: function (key) {
            const raw = sessionStorage.getItem(key);
            try {
                return JSON.parse(raw);
            } catch {
                return raw;
            }
        },
        remove: function (key) {
            sessionStorage.removeItem(key);
        },
        clear: function () {
            sessionStorage.clear();
        }
    };

    const Toaster = {
        info: function (msg, title = 'Info') {
            //toastr.info(msg, title);
            toastr["info"](msg, title);
        },
        success: function (msg, title = 'Success') {
            toastr["success"](msg, title);
            //toastr.success(msg, title);
        },
        warning: function (msg, title = 'Warning') {
            toastr.warning(msg, title);
            toastr["warning"](msg, title);
        },
        error: function (msg, title = 'Error') {
            //toastr.error(msg, title);
            toastr["error"](msg, title);
        }
    };

    toastr.options = {
        "closeButton": true,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut":4000,
        "extendedTimeOut": 0,
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut",
        "tapToDismiss": false
    }

    const FormParser = {
        GetFormData: function (formId) {
            const form = document.getElementById(formId);
            if (!form) throw new Error(`Form with ID '${formId}' not found.`);
            const plainObj = {};

            const formData = new FormData();

            const inputs = form.querySelectorAll("[name]");

            inputs.forEach(input => {
                const name = input.name;
                const type = input.type;

                if (type === "file") {
                    const files = input.files;
                    if (input.multiple) {
                        for (let i = 0; i < files.length; i++) {
                            formData.append(name, files[i]);
                        }
                        if (files.length === 0) {
                            formData.append(name, "");
                        }
                    } else {
                        formData.append(name, files[0] || "");
                    }
                } else if (type === "checkbox") {
                    formData.append(name, input.checked ? input.value : "");
                } else if (type === "radio") {
                    const selected = form.querySelector(`input[name="${name}"]:checked`);
                    if (!formData.has(name)) {
                        formData.append(name, selected ? selected.value : "");
                    }
                } else {
                    formData.append(name, input.value || "");
                }
            });
            //for console only
            formData.forEach((value, key) => {
                plainObj[key] = value;
            });
            console.log("obj:" + JSON.stringify(plainObj));
            return formData;
        },
        GetFormObject: function (formId) {
            const form = document.getElementById(formId);
            if (!form) throw new Error(`Form with ID '${formId}' not found.`);

            const plainObj = {};
            const elements = form.querySelectorAll("[name]");

            elements.forEach(el => {
                const name = el.name;
                const type = el.type;

                if (type === "file") {
                    if (el.multiple) {
                        plainObj[name] = Array.from(el.files);
                    } else {
                        plainObj[name] = el.files[0] || null;
                    }
                }
                else if (type === "checkbox") {
                    const checkboxes = form.querySelectorAll(`input[type="checkbox"][name="${name}"]`);

                    if (checkboxes.length > 1) {
                        if (!plainObj[name]) plainObj[name] = [];
                        if (el.checked) plainObj[name].push(el.value);
                    } else {
                        plainObj[name] = el.checked;
                    }
                }
                else if (type === "radio") {
                    if (el.checked) {
                        plainObj[name] = el.value;
                    } else if (plainObj[name] === undefined) {
                        plainObj[name] = "";
                    }
                }
                else if (el.tagName === "SELECT" && el.multiple) {
                    plainObj[name] = Array.from(el.selectedOptions).map(opt => opt.value);
                }
                else {
                    plainObj[name] = el.value || "";
                }
            });

            console.log("Form Parsed Object:", plainObj);
            return plainObj;
        }

    };

    const ajaxCall = {
        Get: function (url, successCallback, errorCallback, options = {}) {
            showLoader();
            $.ajax({
                url: url,
                type: 'GET',
                headers: options.headers || {},
                success: function (response) {
                    hideLoader();
                    if (successCallback) successCallback(response);
                },
                error: function (xhr) {
                    hideLoader();
                    if (errorCallback) errorCallback(xhr);
                    else defaultErrorHandler(xhr);
                }
            });
        },
        Post: function (url, data, successCallback, errorCallback, options = {}) {
            showLoader();
            $.ajax({
                url: url,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                headers: options.headers || {},
                success: function (response) {
                    hideLoader();
                    if (successCallback) successCallback(response);
                },
                error: function (xhr) {
                    hideLoader();
                    if (errorCallback) errorCallback(xhr);
                    else defaultErrorHandler(xhr);
                }
            });
        },
        FormPost: function (url, formData, successCallback, errorCallback, options = {}) {
            showLoader();
            //const formData = new FormData(formElement);

            $.ajax({
                url: url,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                headers: options.headers || {},
                success: function (response) {
                    hideLoader();
                    if (successCallback) successCallback(response);
                },
                error: function (xhr) {
                    hideLoader();
                    if (errorCallback) errorCallback(xhr);
                    else defaultErrorHandler(xhr);
                }
            });
        }

    }

    const SwalWrapper = {
        success: function (msg, title = "Success") {
            Swal.fire({ icon: 'success', title, text: msg });
        },
        error: function (msg, title = "Error") {
            Swal.fire({ icon: 'error', title, text: msg });
        },
        info: function (msg, title = "Info") {
            Swal.fire({ icon: 'info', title, text: msg });
        },
        warning: function (msg, title = "Warning") {
            Swal.fire({ icon: 'warning', title, text: msg });
        },
        confirm: function (msg, title = "Are you sure?", callback) {
            Swal.fire({
                title,
                text: msg,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            }).then(result => {
                if (result.isConfirmed && typeof callback === 'function') {
                    callback();
                }
            });
        }
    };

    const Notify = {
        success: function (msg, title = "Success") {
            $.notify({
                title: `<strong>${title}</strong><br>`,
                message: msg
            }, {
                type: 'success',
                placement: { from: "top", align: "right" },
                delay: 3000,
                allow_dismiss: true
            });
        },
        error: function (msg, title = "Error") {
            $.notify({
                title: `<strong>${title}</strong><br>`,
                message: msg
            }, {
                type: 'danger',
                placement: { from: "top", align: "right" },
                delay: 5000,
                allow_dismiss: true
            });
        },
        info: function (msg, title = "Info") {
            $.notify({
                title: `<strong>${title}</strong><br>`,
                message: msg
            }, {
                type: 'info',
                placement: { from: "top", align: "right" },
                delay: 4000,
                allow_dismiss: true
            });
        },
        warning: function (msg, title = "Warning") {
            $.notify({
                title: `<strong>${title}</strong><br>`,
                message: msg
            }, {
                type: 'warning',
                placement: { from: "top", align: "right" },
                delay: 4000,
                allow_dismiss: true
            });
        }
    };

    function defaultErrorHandler(xhr) {
        const msg = xhr.responseJSON?.message || xhr.statusText || "Unexpected error";
        Toaster.error(msg);
        console.error("AJAX Error:", xhr);
    }
    function showLoader() {
        $('#globalLoader').fadeIn();
    }
    function hideLoader() {
        $('#globalLoader').fadeOut();
    }

    return {
        localStorage: LocalStorage,
        session: Session,
        toaster: Toaster,
        FormParser,
        ajax: ajaxCall,
        swal: SwalWrapper,
        notify: Notify
    };
})(jQuery);