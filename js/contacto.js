// Variables globales
let currentStep = 1;
let selectedProjectType = '';
let projectData = {};

// Configuración del servicio de email (EmailJS)
const EMAIL_SERVICE_ID = 'service_o1i680s'; // Tu Service ID de EmailJS
const EMAIL_TEMPLATE_ID = 'template_y4ysf6o'; // Tu Template ID de EmailJS
const EMAIL_USER_ID = 'AP6gQhAqnDBrgMWED'; // Tu User ID de EmailJS

// Inicializar EmailJS cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si EmailJS está disponible e inicializarlo
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAIL_USER_ID);
        console.log('EmailJS inicializado correctamente');
    } else {
        console.error('EmailJS no está cargado. Verifica que incluiste el script en tu HTML.');
    }
    
    // Resto de inicializaciones...
    updateProgress();
    initializeEventListeners();
});

// Función para enviar el formulario con múltiples métodos
function submitForm() {
    // Recopilar todos los datos del formulario
    projectData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        company: document.getElementById('company').value || 'No especificado',
        projectType: selectedProjectType,
        projectTypeName: getProjectTypeName(selectedProjectType),
        projectDescription: document.getElementById('project').value,
        budget: document.getElementById('budget').value,
        timeline: document.getElementById('timeline').value,
        estimatedPrice: document.getElementById('estimatePrice').textContent || 'No calculado',
        submissionDate: new Date().toLocaleDateString('es-ES'),
        submissionTime: new Date().toLocaleTimeString('es-ES')
    };

    console.log('Datos del proyecto a enviar:', projectData);

    // Intentar envío con EmailJS primero
    if (typeof emailjs !== 'undefined') {
        console.log('Intentando envío con EmailJS...');
        sendWithEmailJS(projectData);
    } else {
        console.log('EmailJS no disponible, usando FormSubmit...');
        sendWithFormSubmit(projectData);
    }
}

// Método 1: Envío con EmailJS (CORREGIDO)
function sendWithEmailJS(data) {
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerHTML = '<div class="typing-dots"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div> Enviando...';
    submitBtn.disabled = true;
    
    const templateParams = {
        // Parámetros que deben coincidir con tu plantilla de EmailJS
        to_email: 'geckcodexoficial@gmail.com', // CORREGIDO: email válido
        from_name: data.name,
        from_email: data.email,
        reply_to: data.email,
        company: data.company,
        project_type: data.projectTypeName,
        project_description: data.projectDescription,
        budget: data.budget,
        timeline: data.timeline,
        estimated_price: data.estimatedPrice,
        submission_date: data.submissionDate,
        submission_time: data.submissionTime,
        // Mensaje completo formateado
        message: `
Nuevo proyecto recibido:

Cliente: ${data.name}
Email: ${data.email}
Empresa: ${data.company}
Tipo de proyecto: ${data.projectTypeName}
Presupuesto: ${data.budget}
Timeline: ${data.timeline}
Precio estimado: ${data.estimatedPrice}

Descripción del proyecto:
${data.projectDescription}

Enviado el: ${data.submissionDate} a las ${data.submissionTime}
        `
    };
    
    console.log('Enviando con EmailJS, parámetros:', templateParams);
    
    emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, templateParams)
        .then(function(response) {
            console.log('Email enviado exitosamente con EmailJS:', response);
            showSuccessMessage();
        })
        .catch(function(error) {
            console.error('Error al enviar con EmailJS:', error);
            console.log('Intentando método alternativo...');
            // Si EmailJS falla, intentar con FormSubmit
            sendWithFormSubmit(data);
        });
}

// Método 2: Envío con FormSubmit (CORREGIDO)
function sendWithFormSubmit(data) {
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerHTML = '<div class="typing-dots"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div> Enviando...';
    submitBtn.disabled = true;
    
    const formData = new FormData();
    formData.append('_name', data.name);
    formData.append('_replyto', data.email);
    formData.append('_subject', `Nuevo proyecto: ${data.projectTypeName} - ${data.name}`);
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('company', data.company);
    formData.append('project_type', data.projectTypeName);
    formData.append('project_description', data.projectDescription);
    formData.append('budget', data.budget);
    formData.append('timeline', data.timeline);
    formData.append('estimated_price', data.estimatedPrice);
    formData.append('submission_date', `${data.submissionDate} - ${data.submissionTime}`);
    
    // Parámetros especiales de FormSubmit
    formData.append('_next', `${window.location.origin}${window.location.pathname}?success=true`);
    formData.append('_captcha', 'false');
    formData.append('_template', 'table'); // Formato de tabla para mejor presentación
    
    console.log('Enviando con FormSubmit...');
    
    // URL CORREGIDA de FormSubmit
    fetch('https://formsubmit.co/geckcodexoficial@gmail.com', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('Respuesta de FormSubmit:', response);
        if (response.ok) {
            showSuccessMessage();
        } else {
            throw new Error(`Error HTTP: ${response.status}`);
        }
    })
    .catch(error => {
        console.error('Error con FormSubmit:', error);
        // Último recurso: método con fetch a tu backend
        sendWithFetch(data);
    });
}

// Método 3: Envío directo con fetch (NUEVO)
function sendWithFetch(data) {
    console.log('Usando método de respaldo con fetch...');
    
    // Si tienes un endpoint en tu servidor
    fetch('/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Email enviado con fetch:', result);
        showSuccessMessage();
    })
    .catch(error => {
        console.error('Error con todos los métodos:', error);
        showTemporaryMessage('Error al enviar. Por favor, contáctanos directamente al email: geckcodexoficial@gmail.com', 'error');
        resetSubmitButton();
        
        // Como último recurso, abrir cliente de email del usuario
        openEmailClient(data);
    });
}

// Método de último recurso: abrir cliente de email
function openEmailClient(data) {
    const subject = encodeURIComponent(`Nuevo proyecto: ${data.projectTypeName}`);
    const body = encodeURIComponent(`
Hola,

Me gustaría solicitar un proyecto con los siguientes detalles:

Nombre: ${data.name}
Email: ${data.email}
Empresa: ${data.company}
Tipo de proyecto: ${data.projectTypeName}
Presupuesto: ${data.budget}
Timeline: ${data.timeline}
Precio estimado: ${data.estimatedPrice}

Descripción del proyecto:
${data.projectDescription}

Gracias por tu tiempo.

Saludos,
${data.name}
    `);
    
    const mailtoLink = `mailto:geckcodexoficial@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
}

// Función para mostrar mensaje de éxito
function showSuccessMessage() {
    document.getElementById('step4').style.display = 'none';
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.add('show');
    showFloatingEmoji(successMessage, '🎉');
    
    // Resetear formulario después de 5 segundos
    setTimeout(() => {
        if (confirm('¿Deseas enviar otro proyecto?')) {
            location.reload();
        }
    }, 5000);
    
    // Analytics (opcional)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
            event_category: 'contact',
            event_label: 'project_request',
            value: 1
        });
    }
}

// Función para resetear el botón de envío
function resetSubmitButton() {
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerHTML = '🚀 Enviar Proyecto';
    submitBtn.disabled = false;
}

// Función de debug para probar conexión con EmailJS
function testEmailJS() {
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS no está cargado');
        return false;
    }
    
    console.log('EmailJS está disponible');
    console.log('Service ID:', EMAIL_SERVICE_ID);
    console.log('Template ID:', EMAIL_TEMPLATE_ID);
    console.log('User ID:', EMAIL_USER_ID);
    
    // Envío de prueba
    const testParams = {
        to_email: 'geckcodexoficial@gmail.com',
        from_name: 'Test',
        from_email: 'test@test.com',
        message: 'Este es un mensaje de prueba'
    };
    
    emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, testParams)
        .then(response => console.log('Test exitoso:', response))
        .catch(error => console.error('Test falló:', error));
}

// Función para inicializar event listeners
function initializeEventListeners() {
    // Contador de caracteres para el textarea
    const projectTextarea = document.getElementById('project');
    if (projectTextarea) {
        projectTextarea.addEventListener('input', function(e) {
            const count = e.target.value.length;
            const charCount = document.getElementById('charCount');
            if (charCount) {
                charCount.textContent = count + ' / 500 caracteres';
                
                if (count > 400) {
                    charCount.classList.add('warning');
                } else {
                    charCount.classList.remove('warning');
                }
            }
            
            // Calcular estimación automáticamente
            if (count > 10) {
                const typingIndicator = document.getElementById('typingIndicator');
                if (typingIndicator) {
                    typingIndicator.style.display = 'flex';
                }
                
                clearTimeout(this.typingTimer);
                this.typingTimer = setTimeout(() => {
                    if (typingIndicator) {
                        typingIndicator.style.display = 'none';
                    }
                    calculateEstimate();
                }, 1500);
            }
        });
    }
    
    // Validación de email en tiempo real
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('input', function(e) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isValid = emailRegex.test(e.target.value);
            
            if (e.target.value.length > 0) {
                if (isValid) {
                    e.target.style.borderColor = '#10b981';
                    e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                } else {
                    e.target.style.borderColor = '#ef4444';
                    e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                }
            } else {
                e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                e.target.style.boxShadow = 'none';
            }
        });
    }
    
    // Event listeners para cálculo de estimación
    const budgetSelect = document.getElementById('budget');
    const timelineSelect = document.getElementById('timeline');
    
    if (budgetSelect) budgetSelect.addEventListener('change', calculateEstimate);
    if (timelineSelect) timelineSelect.addEventListener('change', calculateEstimate);
    
    // Manejar envío del formulario
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Formulario enviado');
            submitForm();
        });
    }
    
    // Agregar botón de prueba de EmailJS (solo en desarrollo)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const testButton = document.createElement('button');
        testButton.textContent = 'Test EmailJS';
        testButton.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 9999; background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;';
        testButton.onclick = testEmailJS;
        document.body.appendChild(testButton);
    }
}

// Resto de funciones originales (updateProgress, nextStep, etc.)
function updateProgress() {
    const progress = (currentStep / 4) * 100;
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = progress + '%';
    }
    
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
            const stepNumber = step.querySelector('.step-number');
            if (stepNumber) stepNumber.innerHTML = '✓';
        } else if (index + 1 === currentStep) {
            step.classList.add('active');
            const stepNumber = step.querySelector('.step-number');
            if (stepNumber) stepNumber.innerHTML = index + 1;
        } else {
            const stepNumber = step.querySelector('.step-number');
            if (stepNumber) stepNumber.innerHTML = index + 1;
        }
    });
}

function nextStep() {
    if (validateCurrentStep()) {
        const currentStepElement = document.getElementById('step' + currentStep);
        if (currentStepElement) {
            createParticles(currentStepElement);
            currentStepElement.classList.remove('active');
        }
        
        currentStep++;
        const nextStepElement = document.getElementById('step' + currentStep);
        if (nextStepElement) {
            nextStepElement.classList.add('active');
        }
        updateProgress();
        
        if (currentStep === 4) {
            updateConfirmation();
        }
    }
}

function prevStep() {
    const currentStepElement = document.getElementById('step' + currentStep);
    if (currentStepElement) {
        currentStepElement.classList.remove('active');
    }
    
    currentStep--;
    const prevStepElement = document.getElementById('step' + currentStep);
    if (prevStepElement) {
        prevStepElement.classList.add('active');
    }
    updateProgress();
}

function validateCurrentStep() {
    const step = document.getElementById('step' + currentStep);
    if (!step) return false;
    
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

function selectProjectType(type) {
    selectedProjectType = type;
    document.querySelectorAll('.project-type-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    if (event && event.target) {
        const card = event.target.closest('.project-type-card');
        if (card) {
            card.classList.add('selected');
            showFloatingEmoji(event.target, '✨');
        }
    }
    
    const nextBtn = document.getElementById('nextBtn2');
    if (nextBtn) {
        nextBtn.disabled = false;
    }
}

function updateConfirmation() {
    const elements = {
        'confirmName': document.getElementById('name')?.value || 'No especificado',
        'confirmEmail': document.getElementById('email')?.value || 'No especificado',
        'confirmCompany': document.getElementById('company')?.value || 'No especificado',
        'confirmProjectType': getProjectTypeName(selectedProjectType),
        'confirmDescription': document.getElementById('project')?.value || 'No especificado'
    };
    
    Object.keys(elements).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = elements[id];
        }
    });
}

function getProjectTypeName(type) {
    const names = {
        'website': 'Sitio Web',
        'ecommerce': 'E-commerce',
        'webapp': 'Aplicación Web',
        'mobile': 'App Móvil'
    };
    return names[type] || 'No especificado';
}

function calculateEstimate() {
    const budgetElement = document.getElementById('budget');
    const timelineElement = document.getElementById('timeline');
    const projectElement = document.getElementById('project');
    
    if (!budgetElement || !timelineElement || !projectElement) return;
    
    const budget = budgetElement.value;
    const timeline = timelineElement.value;
    const projectDescription = projectElement.value;
    
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
        
        if (selectedProjectType && projectTypes[selectedProjectType]) {
            multiplier *= projectTypes[selectedProjectType];
        }
        
        // Análisis de complejidad basado en palabras clave
        const complexityKeywords = ['dashboard', 'crm', 'api', 'integración', 'pago', 'usuarios', 'admin'];
        const foundComplexity = complexityKeywords.filter(keyword => 
            projectDescription.toLowerCase().includes(keyword)
        ).length;
        
        multiplier += foundComplexity * 0.1;
        
        const finalPrice = Math.round(basePrice * multiplier);
        
        const estimatePrice = document.getElementById('estimatePrice');
        const estimateCard = document.getElementById('estimateCard');
        
        if (estimatePrice) {
            estimatePrice.textContent = '$' + finalPrice.toLocaleString();
            
            // Animar la aparición del precio
            estimatePrice.style.transform = 'scale(1.2)';
            estimatePrice.style.transition = 'transform 0.3s ease';
            setTimeout(() => {
                estimatePrice.style.transform = 'scale(1)';
            }, 300);
        }
        
        if (estimateCard) {
            estimateCard.style.display = 'block';
        }
    }
}

function showTemporaryMessage(text, type = 'info') {
    const message = document.createElement('div');
    message.className = `temporary-message ${type}`;
    const colors = {
        'info': 'rgba(59, 130, 246, 0.9)',
        'error': 'rgba(239, 68, 68, 0.9)',
        'success': 'rgba(16, 185, 129, 0.9)'
    };
    
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        backdrop-filter: blur(10px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
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

function createParticles(element) {
    if (!element) return;
    
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

function shakeElement(element) {
    if (!element) return;
    
    element.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

function showFloatingEmoji(element, emoji) {
    if (!element) return;
    
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

// CSS adicional para animaciones
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
        font-weight: bold;
    }
    
    .success-message.show {
        display: block !important;
        animation: fadeIn 0.5s ease-in;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .typing-dots {
        display: inline-flex;
        gap: 4px;
    }
    
    .typing-dot {
        width: 4px;
        height: 4px;
        background: currentColor;
        border-radius: 50%;
        animation: typingDot 1.4s infinite ease-in-out;
    }
    
    .typing-dot:nth-child(2) {
        animation-delay: 0.2s;
    }
    
    .typing-dot:nth-child(3) {
        animation-delay: 0.4s;
    }
    
    @keyframes typingDot {
        0%, 80%, 100% { opacity: 0.3; }
        40% { opacity: 1; }
    }
`;

// Agregar el CSS adicional al DOM
if (!document.getElementById('email-form-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'email-form-styles';
    styleSheet.textContent = additionalCSS;
    document.head.appendChild(styleSheet);
}