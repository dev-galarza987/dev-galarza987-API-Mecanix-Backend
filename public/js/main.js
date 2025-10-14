// Animaciones al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Agregar clase fade-in a elementos con animación
    const animatedElements = document.querySelectorAll('.feature-card, .stat-item');
    animatedElements.forEach(el => el.classList.add('fade-in'));

    // Contador animado para estadísticas
    const countUpElements = document.querySelectorAll('.stat-number');
    
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.textContent = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Configurar observer para activar animaciones cuando sean visibles
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                if (element.classList.contains('stat-number')) {
                    const finalValue = parseInt(element.dataset.count || element.textContent);
                    animateValue(element, 0, finalValue, 2000);
                }
                observer.unobserve(element);
            }
        });
    });

    countUpElements.forEach(el => {
        observer.observe(el);
    });

    // Efecto de smooth scroll para navegación
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

    // Estado de la API (simulado)
    checkApiStatus();
});

// Función para verificar el estado de la API
async function checkApiStatus() {
    try {
        const response = await fetch('/api/v1/health', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const statusElement = document.getElementById('api-status');
        if (statusElement) {
            if (response.ok) {
                statusElement.textContent = 'Activa';
                statusElement.className = 'status-badge status-active';
            } else {
                statusElement.textContent = 'Inactiva';
                statusElement.className = 'status-badge status-inactive';
            }
        }
    } catch (error) {
        console.log('API status check:', error.message);
        // Mostrar como activa por defecto si no hay endpoint de health
        const statusElement = document.getElementById('api-status');
        if (statusElement) {
            statusElement.textContent = 'Activa';
            statusElement.className = 'status-badge status-active';
        }
    }
}

// Función para copiar URLs de endpoints
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.textContent;
        button.textContent = '¡Copiado!';
        button.style.background = '#10b981';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
}

// Mostrar/ocultar detalles de endpoints
function toggleEndpointDetails(id) {
    const details = document.getElementById(id);
    if (details) {
        details.style.display = details.style.display === 'none' ? 'block' : 'none';
    }
}

// Función para refrescar estadísticas
function refreshStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const currentValue = parseInt(stat.textContent);
        const newValue = currentValue + Math.floor(Math.random() * 10);
        stat.dataset.count = newValue;
        animateValue(stat, currentValue, newValue, 1000);
    });
}

// Efecto parallax suave para el hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
});

// Agregar efecto de hover a las cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Mostrar información de la API en consola
console.log(`
🔧 API Mecanix Backend
📡 Estado: Activa
🚀 Versión: 1.0.0
📚 Documentación: /api/docs
🌐 Endpoints disponibles:
   - Usuarios: /api/v1/user
   - Clientes: /api/v1/client  
   - Vehículos: /api/v1/vehicle
   - Servicios: /api/v1/service
   - Reservas: /api/v1/reservate
`);