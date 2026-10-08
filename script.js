// ===============================
// SONU SINGH PORTFOLIO
// Basic Website Interactions
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    // Smooth scrolling for internal navigation links
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        });

    });


    // Current year automatically updates in footer
    const footerYear = document.querySelector("footer p");

    if (footerYear) {
        footerYear.innerHTML =
            "© " + new Date().getFullYear() +
            " Sonu Singh. All Rights Reserved.";
    }

});
