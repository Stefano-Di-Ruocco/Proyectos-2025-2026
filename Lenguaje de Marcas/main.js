/* -----------------------------------------------------------
   MOTOR CUÁNTICO (Lógica Principal)
   ----------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SISTEMA DE PRELOADER ---
    const preloader = document.getElementById('preloader');
    const contador = document.getElementById('contador');
    const barra = document.getElementById('barra');
    const body = document.body;
    let progreso = 0;

    // Deshabilitar scroll al inicio
    body.classList.add('no-scroll');

    const intervaloCarga = setInterval(() => {
        progreso += Math.floor(Math.random() * 5) + 1;
        
        if (progreso > 100) progreso = 100;

        // Actualizar números con ceros a la izquierda
        contador.textContent = progreso < 10 ? `00${progreso}` : progreso < 100 ? `0${progreso}` : progreso;
        barra.style.width = `${progreso}%`;

        if (progreso === 100) {
            clearInterval(intervaloCarga);
            setTimeout(() => {
                preloader.classList.add('terminado');
                body.classList.remove('no-scroll');
                body.classList.add('visible');
                revelarElementos(); // Iniciar animaciones de entrada
            }, 500);
        }
    }, 30); // Velocidad de carga


    // --- 2. SISTEMA DE CURSOR MAGNÉTICO ---
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    const linksMagneticos = document.querySelectorAll('.link-magnetico');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // El punto sigue al ratón instantáneamente
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // El círculo exterior tiene un retraso (efecto 'drag')
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Efecto magnético al pasar por enlaces
    linksMagneticos.forEach(link => {
        link.addEventListener('mouseenter', () => {
            body.classList.add('hovering');
        });
        link.addEventListener('mouseleave', () => {
            body.classList.remove('hovering');
        });
    });


    // --- 3. REVELADO DE TEXTO AL SCROLL (Intersection Observer) ---
    const observerOpciones = {
        threshold: 0.1, // Se activa cuando se ve el 10% del elemento
        rootMargin: "0px 0px -50px 0px"
    };

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('aparecer');
                observador.unobserve(entrada.target); // Dejar de observar una vez animado
            }
        });
    }, observerOpciones);

    function revelarElementos() {
        // Seleccionamos todos los elementos con la clase 'revelar-texto'
        const elementos = document.querySelectorAll('.revelar-texto');
        elementos.forEach(el => observador.observe(el));
    }


    // --- 4. PREVIEW DE PROYECTOS (Imagen Flotante) ---
    const itemsProyecto = document.querySelectorAll('.item-proyecto');
    const previewImg = document.getElementById('preview-img');

    itemsProyecto.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const imagenSrc = item.getAttribute('data-imagen');
            previewImg.style.backgroundImage = `url(${imagenSrc})`;
            previewImg.style.opacity = 1;
            previewImg.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%) scale(1) rotate(5deg)`;
        });

        item.addEventListener('mouseleave', () => {
            previewImg.style.opacity = 0;
            previewImg.style.transform = `translate(-50%, -50%) scale(0.8)`;
        });
    });


    // --- 5. RELOJ TIEMPO REAL ---
    function actualizarReloj() {
        const ahora = new Date();
        const horaString = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        const elementoHora = document.getElementById('hora-actual');
        if(elementoHora) elementoHora.textContent = horaString;
    }
    setInterval(actualizarReloj, 1000);
    actualizarReloj();


    // --- 6. CANVAS FONDO ESTRELLADO (PARTICULAS FÍSICAS) ---
    const canvas = document.getElementById('lienzo-estrellas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let stars = [];
    const numStars = 100; // Cantidad de estrellas

    // Ajustar tamaño
    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Clase Estrella
    class Star {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.z = Math.random() * width; // Profundidad
            this.size = Math.random() * 2;
        }

        update(speed) {
            this.z = this.z - speed; // Mover hacia el espectador
            
            // Si la estrella pasa la pantalla, reiniciarla al fondo
            if (this.z <= 0) {
                this.z = width;
                this.x = Math.random() * width;
                this.y = Math.random() * height;
            }
        }

        show() {
            let x, y, s;
            
            // Proyección 3D simple
            x = (this.x - width / 2) * (width / this.z);
            x = x + width / 2;
            
            y = (this.y - height / 2) * (width / this.z);
            y = y + height / 2;
            
            s = this.size * (width / this.z); // Tamaño basado en cercanía

            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.arc(x, y, s, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Inicializar estrellas
    for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
    }

    // Bucle de animación
    let speed = 2;
    // Aumentar velocidad con el ratón
    window.addEventListener('mousemove', (e) => {
        // Mapear posición X del ratón a velocidad (0 a 20)
        speed = (e.clientX / width) * 20 + 2; 
    });

    function animate() {
        ctx.fillStyle = "rgba(5, 5, 5, 0.4)"; // Rastro (trail effect)
        ctx.fillRect(0, 0, width, height);

        for (let star of stars) {
            star.update(speed);
            star.show();
        }
        requestAnimationFrame(animate);
    }
    animate();

});