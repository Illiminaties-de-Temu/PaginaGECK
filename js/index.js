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