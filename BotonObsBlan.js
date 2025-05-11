// Script para manejar el cambio de tema y la funcionalidad del menú
document.addEventListener('DOMContentLoaded', function() {
    // Elementos
    const cambiarEstiloBtn = document.getElementById('cambiarEstilo');
    const estiloObs = document.getElementById('estilo-obs');
    const estiloBla = document.getElementById('estilo-bla');
    const menuMarcador = document.querySelector('.menu');
    const navegacion = document.querySelector('.navegacion');
    
    // Verificar si existe una preferencia guardada
    const temaOscuro = localStorage.getItem('temaOscuro') === 'true';
    
    // Función para cambiar el tema
    function cambiarTema(oscuro) {
        if (oscuro) {
            estiloObs.removeAttribute('disabled');
            estiloBla.setAttribute('disabled', '');
            document.body.classList.add('tema-oscuro');
            document.body.classList.remove('tema-claro');
            localStorage.setItem('temaOscuro', 'true');
        } else {
            estiloObs.setAttribute('disabled', '');
            estiloBla.removeAttribute('disabled');
            document.body.classList.add('tema-claro');
            document.body.classList.remove('tema-oscuro');
            localStorage.setItem('temaOscuro', 'false');
        }
    }
    
    // Aplicar tema guardado o predeterminado
    cambiarTema(temaOscuro);
    
    // Evento para cambiar tema al hacer clic en el botón
    cambiarEstiloBtn.addEventListener('click', function() {
        const esTemaOscuroActual = localStorage.getItem('temaOscuro') === 'true';
        cambiarTema(!esTemaOscuroActual);
        
        // Actualizar ícono del botón si es necesario
        const temaIcono = cambiarEstiloBtn.querySelector('.theme-icon');
        if (temaIcono) {
            temaIcono.innerHTML = !esTemaOscuroActual 
                ? '<path d="M12 3a9 9 0 0 0 0 18 9 9 0 0 0 0-18z"></path>' 
                : '<path d="M12 2L2 12l10 10 10-10-10-10z"></path>';
        }
    });
    
    // Evento para el menú móvil
    if (menuMarcador) {
        menuMarcador.addEventListener('click', function() {
            menuMarcador.classList.toggle('active');
            if (navegacion) {
                navegacion.classList.toggle('active');
            }
        });
    }
});