// Variables globales
let currentStep = 1;
let selectedProjectType = '';
let projectData = {};

// Configuración del servicio de email (puedes usar EmailJS)
const EMAIL_SERVICE_ID = 'service_1el65xk'; // Reemplazar con tu Service ID de EmailJS
const EMAIL_TEMPLATE_ID = 'template_y4ysf6o'; // Reemplazar con tu Template ID de EmailJS
const EMAIL_USER_ID = 'AP6gQhAqnDBrgMWED'; // Reemplazar con tu User ID de EmailJS

// Inicializar EmailJS (agregar este script en tu HTML: https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js)
// emailjs.init(EMAIL_USER_ID);

// Función para actualizar el progreso
function updateProgress() {
    const progress = (currentStep / 4) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    
    const motivationalMessages = [
        '¡Excelente! Sigamos conociendo tu proyecto 🚀',
        '¡Perfecto! Ya casi terminamos 💪',
        '¡Increíble! Un paso más y estaremos listos ✨',
        '¡Fantástico! Tu proyecto está listo para despegar 🎉'
    ];
    
    if (currentStep > 1) {
        showTemporaryMessage(motivationalMessages[currentStep - 2], 'info');
    }
    
    // Actualizar indicadores de paso
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 < currentStep) {
            step.classList.add('completed');
            step.querySelector('.step-number').innerHTML = '✓';
        } else if (index + 1 === currentStep) {
            step.classList.add('active');
            step.querySelector('.step-number').innerHTML = index + 1;
        } else {
            step.querySelector('.step-number').innerHTML = index + 1;
        }
    });
}

// Función para avanzar al siguiente paso
function nextStep() {
    if (validateCurrentStep()) {
        const currentStepElement = document.getElementById('step' + currentStep);
        createParticles(currentStepElement);
        
        currentStepElement.classList.remove('active');
        currentStep++;
        document.getElementById('step' + currentStep).classList.add('active');
        updateProgress();
        
        if (currentStep === 4) {
            updateConfirmation();
        }
    }
}

// Función para retroceder al paso anterior
function prevStep() {
    document.getElementById('step' + currentStep).classList.remove('active');
    currentStep--;
    document.getElementById('step' + currentStep).classList.add('active');
    updateProgress();
}

// Función para validar el paso actual
function validateCurrentStep() {
    const step = document.getElementById('step' + currentStep);
    const requiredInputs = step.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    for (let input of requiredInputs) {
        if (!input.value.trim()) {
            input.focus();
            shakeElement(input);
            showFloatingEmoji(input, '❌');
            showTemporaryMessage('Por favor completa todos los campos obligatorios', 'error');
            isValid = false;
            break;
        }
    }
    
    if (currentStep === 2 && !selectedProjectType) {
        showTemporaryMessage('Selecciona el tipo de proyecto que necesitas', 'error');
        isValid = false;
    }
    
    return isValid;
}

// Función para seleccionar tipo de proyecto
function selectProjectType(type) {
    selectedProjectType = type;
    document.querySelectorAll('.project-type-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.project-type-card').classList.add('selected');
    document.getElementById('nextBtn2').disabled = false;
    
    showFloatingEmoji(event.target, '✨');
}

// Función para mostrar emojis flotantes
function showFloatingEmoji(element, emoji) {
    const rect = element.getBoundingClientRect();
    const floatingEmoji = document.createElement('div');
    floatingEmoji.className = 'floating-emoji';
    floatingEmoji.textContent = emoji;
    floatingEmoji.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top}px;
        font-size: 24px;
        z-index: 1000;
        pointer-events: none;
        transform: translate(-50%, -50%);
        animation: floatUp 3s ease-out forwards;
    `;
    document.body.appendChild(floatingEmoji);
    
    setTimeout(() => {
        floatingEmoji.remove();
    }, 3000);
}

// Función para actualizar la confirmación
function updateConfirmation() {
    document.getElementById('confirmName').textContent = document.getElementById('name').value;
    document.getElementById('confirmEmail').textContent = document.getElementById('email').value;
    document.getElementById('confirmCompany').textContent = document.getElementById('company').value || 'No especificado';
    document.getElementById('confirmProjectType').textContent = getProjectTypeName(selectedProjectType);
    document.getElementById('confirmDescription').textContent = document.getElementById('project').value;
}

// Función para obtener el nombre del tipo de proyecto
function getProjectTypeName(type) {
    const names = {
        'website': 'Sitio Web',
        'ecommerce': 'E-commerce',
        'webapp': 'Aplicación Web',
        'mobile': 'App Móvil'
    };
    return names[type] || 'No especificado';
}

// Función para calcular estimación
function calculateEstimate() {
    const budget = document.getElementById('budget').value;
    const timeline = document.getElementById('timeline').value;
    const projectDescription = document.getElementById('project').value;
    
    if (budget && timeline) {
        let basePrice = 15000;
        let multiplier = 1;
        
        // Ajustar precio base según presupuesto
        if (budget.includes('5000-10000')) basePrice = 7500;
        else if (budget.includes('10000-25000')) basePrice = 17500;
        else if (budget.includes('25000-50000')) basePrice = 37500;
        else if (budget.includes('50000+')) basePrice = 75000;
        
        // Ajustar según urgencia
        if (timeline === 'asap') multiplier = 1.3;
        else if (timeline === '1-2months') multiplier = 1.1;
        else if (timeline === 'flexible') multiplier = 0.9;
        
        // Bonificaciones según tipo de proyecto
        const projectTypes = {
            'website': 1,
            'ecommerce': 1.4,
            'webapp': 1.6,
            'mobile': 1.8
        };
        
        if (selectedProjectType) {
            multiplier *= projectTypes[selectedProjectType];
        }
        
        // Análisis de complejidad basado en palabras clave
        const complexityKeywords = ['dashboard', 'crm', 'api', 'integración', 'pago', 'usuarios', 'admin'];
        const foundComplexity = complexityKeywords.filter(keyword => 
            projectDescription.toLowerCase().includes(keyword)
        ).length;
        
        multiplier += foundComplexity * 0.1;
        
        const finalPrice = Math.round(basePrice * multiplier);
        
        document.getElementById('estimatePrice').textContent = '$' + finalPrice.toLocaleString();
        document.getElementById('estimateCard').style.display = 'block';
        
        // Animar la aparición del precio
        const priceElement = document.getElementById('estimatePrice');
        priceElement.style.transform = 'scale(1.2)';
        priceElement.style.transition = 'transform 0.3s ease';
        setTimeout(() => {
            priceElement.style.transform = 'scale(1)';
        }, 300);
    }
}

// Función para mostrar mensajes temporales
function showTemporaryMessage(text, type = 'info') {
    const message = document.createElement('div');
    message.className = `temporary-message ${type}`;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'info' ? 'rgba(59, 130, 246, 0.9)' : type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        backdrop-filter: blur(10px);
    `;
    message.textContent = text;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        message.style.transform = 'translateX(400px)';
        setTimeout(() => message.remove(), 300);
    }, 3000);
}

// Función para crear efecto de partículas
function createParticles(element) {
    const colors = ['#fbbf24', '#f59e0b', '#10b981', '#3b82f6'];
    
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 6px;
            height: 6px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
        `;
        
        const rect = element.getBoundingClientRect();
        particle.style.left = rect.left + rect.width / 2 + 'px';
        particle.style.top = rect.top + rect.height / 2 + 'px';
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 6;
        const velocity = 100 + Math.random() * 50;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { 
                transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0)`, 
                opacity: 0 
            }
        ], {
            duration: 800,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
    }
}

// Función para sacudir elementos
function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

// Función para enviar el formulario
function submitForm() {
    // Recopilar todos los datos del formulario
    projectData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        company: document.getElementById('company').value,
        projectType: selectedProjectType,
        projectTypeName: getProjectTypeName(selectedProjectType),
        projectDescription: document.getElementById('project').value,
        budget: document.getElementById('budget').value,
        timeline: document.getElementById('timeline').value,
        estimatedPrice: document.getElementById('estimatePrice').textContent,
        submissionDate: new Date().toLocaleDateString('es-ES')
    };

    // Método 1: Usando EmailJS (recomendado)
    sendWithEmailJS(projectData);
    
    // Método 2: Usando FormSubmit (alternativa)
    // sendWithFormSubmit(projectData);
    
    // Método 3: Usando tu propio backend
    // sendWithBackend(projectData);
}

// Opción 1: Envío con EmailJS
function sendWithEmailJS(data) {
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerHTML = '<div class="typing-dots"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div> Enviando...';
    submitBtn.disabled = true;
    
    // Verificar si EmailJS está disponible
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS no está cargado. Asegúrate de incluir el script de EmailJS en tu HTML.');
        showTemporaryMessage('Error: Servicio de email no disponible', 'error');
        return;
    }
    
    const templateParams = {
        to_email: 'geckcodexoficial@.com', // Reemplaza con tu email
        from_name: data.name,
        from_email: data.email,
        company: data.company,
        project_type: data.projectTypeName,
        project_description: data.projectDescription,
        budget: data.budget,
        timeline: data.timeline,
        estimated_price: data.estimatedPrice,
        submission_date: data.submissionDate
    };
    
    emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, templateParams)
        .then(function(response) {
            console.log('Email enviado exitosamente:', response);
            showSuccessMessage();
        })
        .catch(function(error) {
            console.error('Error al enviar email:', error);
            showTemporaryMessage('Error al enviar el formulario. Intenta nuevamente.', 'error');
            resetSubmitButton();
        });
}




// Función para mostrar mensaje de éxito
function showSuccessMessage() {
    document.getElementById('step4').style.display = 'none';
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.add('show');
    showFloatingEmoji(successMessage, '🎉');
    
    // Enviar evento de conversión (opcional, para analytics)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
            event_category: 'contact',
            event_label: 'project_request'
        });
    }
}

// Función para resetear el botón de envío
function resetSubmitButton() {
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerHTML = '🚀 Enviar Proyecto';
    submitBtn.disabled = false;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar
    updateProgress();
    
    // Contador de caracteres para el textarea
    const projectTextarea = document.getElementById('project');
    projectTextarea.addEventListener('input', function(e) {
        const count = e.target.value.length;
        const charCount = document.getElementById('charCount');
        charCount.textContent = count + ' / 500 caracteres';
        
        if (count > 400) {
            charCount.classList.add('warning');
        } else {
            charCount.classList.remove('warning');
        }
        
        // Mostrar indicador de escritura
        if (count > 10) {
            const typingIndicator = document.getElementById('typingIndicator');
            typingIndicator.style.display = 'flex';
            
            clearTimeout(this.typingTimer);
            this.typingTimer = setTimeout(() => {
                typingIndicator.style.display = 'none';
                calculateEstimate();
            }, 1500);
        }
    });
    
    // Validación de email en tiempo real
    document.getElementById('email').addEventListener('input', function(e) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(e.target.value);
        
        if (e.target.value.length > 0) {
            if (isValid) {
                e.target.style.borderColor = '#10b981';
            } else {
                e.target.style.borderColor = '#ef4444';
            }
        } else {
            e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)';
        }
    });
    
    // Efectos de focus en inputs
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('focus', function() {
            showFloatingEmoji(this, '✨');
        });
        
        input.addEventListener('blur', function() {
            if (this.value.trim()) {
                showFloatingEmoji(this, '✅');
            }
        });
    });
    
    // Efectos de hover en las cards de proyecto
    document.querySelectorAll('.project-type-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.project-icon');
            icon.style.transform = 'scale(1.2) rotate(10deg)';
            icon.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.project-icon');
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    // Event listeners para cálculo de estimación
    document.getElementById('budget').addEventListener('change', calculateEstimate);
    document.getElementById('timeline').addEventListener('change', calculateEstimate);
    
    // Manejar envío del formulario
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitForm();
    });
});

// Agregar CSS para animaciones
const additionalCSS = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes floatUp {
        0% { transform: translate(-50%, -50%) translateY(0px); opacity: 1; }
        100% { transform: translate(-50%, -50%) translateY(-50px); opacity: 0; }
    }
    
    .character-count.warning {
        color: #ef4444;
    }
    
    .success-message.show {
        display: block;
        animation: fadeIn 0.5s ease-in;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

// Agregar el CSS adicional
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);