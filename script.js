document.addEventListener("DOMContentLoaded", function () {


    /* ================= MOBILE MENU ================= */

    const menuToggle =
        document.getElementById("menuToggle");

    const navMenu =
        document.getElementById("navLinks");


    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", function () {

            const isOpen =
                navMenu.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        });


        window.addEventListener(
            "resize",
            function () {

                if (
                    window.innerWidth > 760 &&
                    navMenu.classList.contains("open")
                ) {

                    navMenu.classList.remove("open");

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }
        );

    }



    /* ================= SMOOTH SCROLL ================= */

    const navLinks =
        document.querySelectorAll(
            '.nav-links a[href^="#"]'
        );


    navLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const targetId =
                    this.getAttribute("href");

                const target =
                    document.querySelector(targetId);


                if (target) {

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }


                /* Close mobile menu */

                if (
                    navMenu &&
                    navMenu.classList.contains("open")
                ) {

                    navMenu.classList.remove("open");

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }
        );

    });



    /* ================= FOOTER YEAR ================= */

    const footerText =
        document.querySelector("footer p");


    if (footerText) {

        footerText.textContent =
            "© " +
            new Date().getFullYear() +
            " Sonu Singh. All Rights Reserved.";

    }



    /* ================= NETWORK BACKGROUND ================= */

    const canvas =
        document.getElementById(
            "network-background"
        );


    if (!canvas) return;


    const ctx =
        canvas.getContext("2d");


    let width = 0;
    let height = 0;

    let nodes = [];


    const mouse = {

        x: null,
        y: null,

        radius: 150

    };



    /* ================= RESIZE ================= */

    function resizeCanvas() {

        const ratio =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );


        width =
            window.innerWidth;

        height =
            window.innerHeight;


        canvas.width =
            width * ratio;

        canvas.height =
            height * ratio;


        canvas.style.width =
            width + "px";

        canvas.style.height =
            height + "px";


        ctx.setTransform(
            ratio,
            0,
            0,
            ratio,
            0,
            0
        );


        createNodes();

    }



    /* ================= CREATE NODES ================= */

    function createNodes() {

        const pageHeight =
            document.body.scrollHeight;


        const count =
            window.innerWidth < 600
                ? Math.max(
                    40,
                    Math.floor(
                        pageHeight / 350
                    )
                )
                : Math.max(
                    90,
                    Math.floor(
                        pageHeight / 170
                    )
                );


        nodes = [];


        for (
            let i = 0;
            i < count;
            i++
        ) {

            nodes.push({

                x:
                    Math.random() *
                    width,

                y:
                    Math.random() *
                    pageHeight,

                vx:
                    (Math.random() - 0.5)
                    * 0.16,

                vy:
                    (Math.random() - 0.5)
                    * 0.10,

                radius:
                    Math.random()
                    * 1.35
                    + 0.55

            });

        }

    }



    /* ================= MOUSE ================= */

    document.addEventListener(
        "mousemove",
        function (event) {

            mouse.x =
                event.clientX;

            mouse.y =
                event.clientY +
                window.scrollY;

        }
    );


    document.addEventListener(
        "mouseleave",
        function () {

            mouse.x = null;
            mouse.y = null;

        }
    );



    /* ================= DRAW NETWORK ================= */

    function drawNetwork() {

        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        const pageHeight =
            document.body.scrollHeight;

        const scrollY =
            window.scrollY;



        /* Nodes */

        nodes.forEach(
            function (node, index) {


                node.x += node.vx;
                node.y += node.vy;


                if (
                    node.x < -20 ||
                    node.x > width + 20
                ) {

                    node.vx *= -1;

                }


                if (
                    node.y < 0 ||
                    node.y > pageHeight
                ) {

                    node.vy *= -1;

                }


                const screenY =
                    node.y - scrollY;


                if (
                    screenY < -40 ||
                    screenY > height + 40
                ) {

                    return;

                }


                /* Node */

                ctx.beginPath();

                ctx.arc(
                    node.x,
                    screenY,
                    node.radius,
                    0,
                    Math.PI * 2
                );


                ctx.fillStyle =
                    "rgba(0, 200, 255, 0.50)";


                ctx.fill();



                /* Circuit branch */

                if (
                    index % 5 === 0
                ) {

                    ctx.beginPath();

                    ctx.moveTo(
                        node.x,
                        screenY
                    );

                    ctx.lineTo(
                        node.x + 18,
                        screenY
                    );

                    ctx.lineTo(
                        node.x + 18,
                        screenY + 18
                    );


                    ctx.strokeStyle =
                        "rgba(0, 190, 255, 0.12)";

                    ctx.lineWidth = 1;

                    ctx.stroke();

                }

            }
        );



        /* Network connections */

        for (
            let i = 0;
            i < nodes.length;
            i++
        ) {

            const a =
                nodes[i];

            const ay =
                a.y - scrollY;


            if (
                ay < -50 ||
                ay > height + 50
            ) {

                continue;

            }


            for (
                let j = i + 1;
                j < nodes.length;
                j++
            ) {

                const b =
                    nodes[j];

                const by =
                    b.y - scrollY;


                if (
                    by < -50 ||
                    by > height + 50
                ) {

                    continue;

                }


                const dx =
                    a.x - b.x;

                const dy =
                    ay - by;


                const distance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                if (
                    distance < 135
                ) {

                    const opacity =
                        (
                            1 -
                            distance / 135
                        ) * 0.16;


                    ctx.beginPath();

                    ctx.moveTo(
                        a.x,
                        ay
                    );

                    ctx.lineTo(
                        b.x,
                        by
                    );


                    ctx.strokeStyle =
                        `rgba(
                            0,
                            175,
                            255,
                            ${opacity}
                        )`;


                    ctx.lineWidth = 1;

                    ctx.stroke();

                }

            }

        }



        /* Mouse connection effect */

        if (
            mouse.x !== null &&
            mouse.y !== null
        ) {

            nodes.forEach(
                function (node) {

                    const dx =
                        mouse.x -
                        node.x;


                    const dy =
                        mouse.y -
                        node.y;


                    const distance =
                        Math.sqrt(
                            dx * dx +
                            dy * dy
                        );


                    if (
                        distance <
                        mouse.radius
                    ) {

                        const opacity =
                            (
                                1 -
                                distance /
                                mouse.radius
                            ) * 0.20;


                        ctx.beginPath();

                        ctx.moveTo(
                            node.x,
                            node.y -
                            window.scrollY
                        );

                        ctx.lineTo(
                            mouse.x,
                            mouse.y -
                            window.scrollY
                        );


                        ctx.strokeStyle =
                            `rgba(
                                0,
                                200,
                                255,
                                ${opacity}
                            )`;


                        ctx.lineWidth = 1;

                        ctx.stroke();

                    }

                }
            );

        }

    }



    /* ================= ANIMATION ================= */

    function animate() {

        drawNetwork();

        requestAnimationFrame(
            animate
        );

    }



    window.addEventListener(
        "resize",
        resizeCanvas
    );


    resizeCanvas();

    animate();

});
