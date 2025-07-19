// Navbar scroll effect
        window.addEventListener('scroll', function() {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Form submission
        document.querySelector('.contact-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const project = document.getElementById('project').value;
            
            if (name && email && project) {
                // Simulate form submission
                alert('¡Gracias por tu interés! Nos pondremos en contacto contigo pronto.');
                this.reset();
            } else {
                alert('Por favor, completa todos los campos requeridos.');
            }
        });

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for animations
        document.querySelectorAll('.service-card, .stat-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Counter animation for stats
        function animateCounters() {
            const counters = document.querySelectorAll('.stat-number');
            
            counters.forEach(counter => {
                const target = counter.innerText;
                const isPercentage = target.includes('%');
                const isRating = target.includes('⭐');
                const isTime = target.includes('/');
                
                let finalNumber;
                if (isPercentage) {
                    finalNumber = parseInt(target);
                } else if (isRating || isTime) {
                    return; // Skip animation for these
                } else {
                    finalNumber = parseInt(target);
                }
                
                if (isNaN(finalNumber)) return;
                
                let current = 0;
                const increment = finalNumber / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= finalNumber) {
                        counter.innerText = target;
                        clearInterval(timer);
                    } else {
                        counter.innerText = Math.floor(current) + (isPercentage ? '%' : '+');
                    }
                }, 40);
            });
        }

        // Trigger counter animation when stats section is visible
        const statsSection = document.querySelector('.stats-grid');
        if (statsSection) {
            const statsObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounters();
                        statsObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            statsObserver.observe(statsSection);
        }



        
        
        // Función para crear partículas flotantes - MEJORADO
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            
            function createParticle() {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                // Tamaño más pequeño
                const size = Math.random() * 2 + 1;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                
                // Posición aleatoria
                particle.style.left = Math.random() * 100 + '%';
                
                // Duración más lenta
                const duration = Math.random() * 4 + 6;
                particle.style.animationDuration = duration + 's';
                
                // Retraso aleatorio
                const delay = Math.random() * 2;
                particle.style.animationDelay = delay + 's';
                
                // Opacidad reducida
                particle.style.opacity = Math.random() * 0.3 + 0.1;
                
                particlesContainer.appendChild(particle);
                
                // Remover partícula después de la animación
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, (duration + delay) * 1000);
            }
            
            // Crear menos partículas
            setInterval(createParticle, 800);
        }
        
        // Inicializar partículas cuando se carga la página
        document.addEventListener('DOMContentLoaded', createParticles);
        
        // Efecto de parallax más sutil
        document.addEventListener('mousemove', (e) => {
            const shapes = document.querySelectorAll('.shape');
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.2; // Reducido
                const x = (mouseX - 0.5) * speed;
                const y = (mouseY - 0.5) * speed;
                
                shape.style.transform += ` translate(${x}px, ${y}px)`;
            });
        });
        
        // Efecto de hover mejorado en iconos sociales
        document.querySelectorAll('.social-icons a').forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                icon.style.boxShadow = '0 0 25px rgba(0, 191, 255, 0.6)';
            });
            
            icon.addEventListener('mouseleave', () => {
                icon.style.boxShadow = '';
            });
        });
   
        // Funcionalidad del menú hamburguesa
        document.addEventListener('DOMContentLoaded', function() {
            const mobileMenuToggle = document.getElementById('mobileMenuToggle');
            const mobileMenu = document.getElementById('mobileMenu');
            const navbar = document.getElementById('navbar');

            // Toggle del menú móvil
            mobileMenuToggle.addEventListener('click', function() {
                mobileMenuToggle.classList.toggle('active');
                mobileMenu.classList.toggle('active');
            });

            // Cerrar menú al hacer click en un enlace
            const mobileNavLinks = mobileMenu.querySelectorAll('.nav-link');
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mobileMenuToggle.classList.remove('active');
                    mobileMenu.classList.remove('active');
                });
            });

            // Cerrar menú al hacer click fuera
            document.addEventListener('click', function(event) {
                if (!mobileMenuToggle.contains(event.target) && !mobileMenu.contains(event.target)) {
                    mobileMenuToggle.classList.remove('active');
                    mobileMenu.classList.remove('active');
                }
            });

            // Efecto de scroll en el navbar
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });

            // Navegación suave
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    if (href.startsWith('#')) {
                        e.preventDefault();
                        const targetId = href.substring(1);
                        const targetElement = document.getElementById(targetId);
                        if (targetElement) {
                            const offsetTop = targetElement.offsetTop - navbar.offsetHeight;
                            window.scrollTo({
                                top: offsetTop,
                                behavior: 'smooth'
                            });
                        }
                    }
                });
            });
        });


        