// Función para crear figuras tecnológicas
        function createTechShapes() {
            const container = document.getElementById('techShapes');
            const shapes = ['hexagon', 'chip', 'circuit', 'diamond', 'gear'];
            const numberOfShapes = window.innerWidth < 768 ? 8 : 15;

            for (let i = 0; i < numberOfShapes; i++) {
                const shape = document.createElement('div');
                const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
                
                shape.className = `tech-shape ${shapeType}`;
                
                // Posición aleatoria
                shape.style.left = Math.random() * 100 + '%';
                shape.style.top = Math.random() * 100 + '%';
                
                // Delay aleatorio para la animación
                shape.style.animationDelay = Math.random() * 15 + 's';
                
                // Duración aleatoria
                shape.style.animationDuration = (12 + Math.random() * 8) + 's';
                
                container.appendChild(shape);
            }
        }

        // Función para crear partículas
        function createParticles() {
            const container = document.getElementById('particles');
            const numberOfParticles = window.innerWidth < 768 ? 15 : 30;

            for (let i = 0; i < numberOfParticles; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                // Tamaño aleatorio
                const size = Math.random() * 4 + 2;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                
                // Posición horizontal aleatoria
                particle.style.left = Math.random() * 100 + '%';
                
                // Delay aleatorio
                particle.style.animationDelay = Math.random() * 10 + 's';
                
                // Duración aleatoria
                particle.style.animationDuration = (8 + Math.random() * 4) + 's';
                
                container.appendChild(particle);
            }
        }

        // Función para recrear elementos en resize
        function handleResize() {
            const techShapes = document.getElementById('techShapes');
            const particles = document.getElementById('particles');
            
            // Limpiar contenedores
            techShapes.innerHTML = '';
            particles.innerHTML = '';
            
            // Recrear elementos
            createTechShapes();
            createParticles();
        }

        // Inicializar cuando el DOM esté listo
        document.addEventListener('DOMContentLoaded', function() {
            createTechShapes();
            createParticles();
            
            // Recrear en resize con debounce
            let resizeTimeout;
            window.addEventListener('resize', function() {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(handleResize, 250);
            });
        });

        // Agregar efecto de parallax sutil al scroll
        window.addEventListener('scroll', function() {
            const techShapes = document.querySelectorAll('.tech-shape');
            const scrolled = window.pageYOffset;
            
            techShapes.forEach((shape, index) => {
                const rate = scrolled * -0.5 * (index % 3 + 1);
                shape.style.transform = `translateY(${rate}px)`;
            });
        });