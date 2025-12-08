const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleBtn");
const overlay = document.getElementById("sidebarOverlay");
const contentArea = document.getElementById("contentArea");
const footer = document.querySelector(".footer");

// Toggle sidebar
toggleBtn.addEventListener("click", () => {
    if (window.innerWidth < 992) {
        if (sidebar.classList.contains("mobile-open")) {
            closeMobileSidebar();
        } else {
            openMobileSidebar();
        }
    } else {
        const isCollapsed = sidebar.classList.contains("collapsed");
        sidebar.classList.toggle("collapsed");
        contentArea?.classList.toggle("shift");
        footer?.classList.toggle("shift");

        if (!isCollapsed) {
            // Close all submenus
            document.querySelectorAll(".submenu.show").forEach(sm => {
                new bootstrap.Collapse(sm, { toggle: false }).hide();
            });
            // document.querySelectorAll(".nav-link.parent .caret").forEach(c => {
            //     c.classList.remove("fa-chevron-up");
            //     c.classList.add("fa-chevron-down");
            // });
        }
    }
});

// Mobile sidebar functions
function openMobileSidebar() {
    sidebar.classList.add("mobile-open");
    overlay.classList.add("show");
}
function closeMobileSidebar() {
    sidebar.classList.remove("mobile-open");
    overlay.classList.remove("show");
    document.querySelectorAll(".submenu.show").forEach(sm => {
        new bootstrap.Collapse(sm, { toggle: false }).hide();
    });
    // document.querySelectorAll(".nav-link.parent .caret").forEach(c => {
    //     c.classList.remove("fa-chevron-up");
    //     c.classList.add("fa-chevron-down");
    // });
}
overlay.addEventListener("click", closeMobileSidebar);
window.addEventListener("resize", () => {
    if (window.innerWidth >= 992) closeMobileSidebar();
});

// // Submenu caret rotation
// document.querySelectorAll(".nav-link.parent").forEach(parent => {
//     const target = parent.getAttribute("href");
//     const submenu = document.querySelector(target);
//     const caret = parent.querySelector(".caret");
//     if (!submenu) return;

//     submenu.addEventListener("shown.bs.collapse", () => {
//         caret.classList.remove("fa-chevron-down");
//         caret.classList.add("fa-chevron-up");
//     });
//     submenu.addEventListener("hidden.bs.collapse", () => {
//         caret.classList.remove("fa-chevron-up");
//         caret.classList.add("fa-chevron-down");
//     });
// });


// Redirect sidebar links
document.querySelectorAll(".sidebar .nav-link").forEach(link => {
    link.addEventListener("click", function (e) {
        const href = this.getAttribute("data-href");
        const isParent = this.classList.contains("parent");
        if (!href || href === "#" || isParent) return; // ignore parents or empty
        if (window.innerWidth < 992) {
            // close mobile sidebar
            closeMobileSidebar();
        }
        window.location.href = href;
    });
});