    // Configuración centralizada de temas
    const themeConfig = {
        obs: {
            iconPath: 'M12,18C11.11,18 10.26,17.8 9.5,17.45C11.56,16.5 13,14.42 13,12C13,9.58 11.56,7.5 9.5,6.55C10.26,6.2 11.11,6 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z',
            label: 'Tema Claro',
            next: 'bla'
        },
        bla: {
            iconPath: 'M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M12,19A7,7 0 0,1 5,12A7,7 0 0,1 12,5A7,7 0 0,1 19,12A7,7 0 0,1 12,19Z',
            label: 'Tema Oscuro',
            next: 'obs'
        }
    };

    // Estado inicial
    let currentTheme = localStorage.getItem('temaPreferido') || 'obs';

    // Elementos del DOM
    const themeElements = {
        obs: document.getElementById('estilo-obs'),
        bla: document.getElementById('estilo-bla'),
        button: document.getElementById('cambiarEstilo'),
        icon: document.querySelector('.theme-icon path'),
        label: document.querySelector('.theme-label')
    };

    // Función para aplicar el tema
    function applyTheme(theme) {
        // Desactivar todos los temas primero
        Object.values(themeElements).forEach(el => {
            if (el !== themeElements.button && el !== themeElements.icon && el !== themeElements.label && el.disabled !== undefined) {
                el.disabled = true;
            }
        });
        
        // Activar el tema seleccionado
        if (themeElements[theme]) {
            themeElements[theme].disabled = false;
        }
        
        // Actualizar botón
        const config = themeConfig[theme];
        themeElements.icon.setAttribute('d', config.iconPath);
        themeElements.label.textContent = config.label;
        
        // Guardar preferencia
        localStorage.setItem('temaPreferido', theme);
        currentTheme = theme;
    }

    // Función para alternar temas
    function toggleTheme() {
        const nextTheme = themeConfig[currentTheme].next;
        applyTheme(nextTheme);
    }

    // Inicialización
    function initTheme() {
        applyTheme(currentTheme);
        themeElements.button.addEventListener('click', toggleTheme);
        
        // Verificar preferencia del sistema
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('temaPreferido')) {
            applyTheme('obs');
        }
    }

    // Iniciar cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', initTheme);

    // Escuchar cambios en las preferencias del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('temaPreferido')) {
            applyTheme(e.matches ? 'obs' : 'bla');
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
        // Mostrar contenido principal
        document.documentElement.classList.add('fully-loaded');
        
        // Activar transiciones después de breve retraso
        setTimeout(function() {
            document.body.classList.add('loaded');
            document.querySelector('header').classList.add('loaded');
            document.querySelector('.contenido').classList.add('loaded');
            document.querySelector('.theme-switcher').classList.add('loaded');
        }, 50);
    });