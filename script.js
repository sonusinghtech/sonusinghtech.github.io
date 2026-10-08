// ===============================
// SONU SINGH PORTFOLIO
// IT NETWORK BACKGROUND + INTERACTIONS
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    // --------------------------------
    // Smooth scrolling
    // --------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (targetId === "#") return;

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


    // --------------------------------
    // Current year
    // --------------------------------
    const footerYear = document.querySelector("footer p");

    if (footerYear) {
        footerYear.innerHTML =
            "© " + new Date().getFullYear() +
            " Sonu Singh. All Rights Reserved.";
    }


    // --------------------------------
    // IT Network Background
    // --------------------------------

    const canvas = document.createElement("canvas");
    canvas.id = "network-background";

    document.body.prepend(canvas);

    const ctx = canvas.getContext("2d");

    let width;
    let height;
    let nodes = [];
    let animationFrame;


    // Mouse position
    const mouse = {
        x: null,
        y: null,
        radius: 140
    };


    function resizeCanvas() {

        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;

        createNodes();
    }


    // --------------------------------
    // Create network nodes
    // --------------------------------

    function createNodes() {

        nodes = [];

        const nodeCount =
            window.innerWidth < 768 ? 35 : 70;

        for (let i = 0; i < nodeCount; i++) {

            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,

                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,

                radius: Math.random() * 1.5 + 0.7
            });
        }
    }


    // --------------------------------
    // Mouse interaction
    // --------------------------------

    document.addEventListener("mousemove", function (event) {

        mouse.x = event.clientX;
        mouse.y = event.clientY;

    });


    document.addEventListener("mouseleave", function () {

        mouse.x = null;
        mouse.y = null;

    });


    // --------------------------------
    // Draw network
    // --------------------------------

    function drawNetwork() {

        ctx.clearRect(0, 0, width, height);

        nodes.forEach(function (node) {

            // Move nodes
            node.x += node.vx;
            node.y += node.vy;


            // Screen boundaries
            if (node.x < 0 || node.x > width) {
                node.vx *= -1;
            }

            if (node.y < 0 || node.y > height) {
                node.vy *= -1;
            }


            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {

                const dx = mouse.x - node.x;
                const dy = mouse.y - node.y;

                const distance = Math.sqrt(
                    dx * dx + dy * dy
                );

                if (distance < mouse.radius) {

                    node.x -= dx * 0.001;
                    node.y -= dy * 0.001;
                }
            }


            // Node
            ctx.beginPath();

            ctx.arc(
                node.x,
                node.y,
                node.radius,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = "rgba(0, 200, 255, 0.45)";

            ctx.fill();
        });


        // --------------------------------
        // Connecting lines
        // --------------------------------

        for (let i = 0; i < nodes.length; i++) {

            for (let j = i + 1; j < nodes.length; j++) {

                const dx =
                    nodes[i].x - nodes[j].x;

                const dy =
                    nodes[i].y - nodes[j].y;

                const distance =
                    Math.sqrt(dx * dx + dy * dy);


                if (distance < 130) {

                    const opacity =
                        1 - distance / 130;

                    ctx.beginPath();

                    ctx.moveTo(
                        nodes[i].x,
                        nodes[i].y
                    );

                    ctx.lineTo(
                        nodes[j].x,
                        nodes[j].y
                    );

                    ctx.strokeStyle =
                        `rgba(0, 180, 255, ${opacity * 0.16})`;

                    ctx.lineWidth = 1;

                    ctx.stroke();
                }
            }
        }


        animationFrame =
            requestAnimationFrame(drawNetwork);
    }


    // --------------------------------
    // Start
    // --------------------------------

    window.addEventListener("resize", resizeCanvas);

    resizeCanvas();
    drawNetwork();

});
