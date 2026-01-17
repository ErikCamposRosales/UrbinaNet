// Navegación entre secciones con efectos modernos
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar navegación
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    // Hacer showSection accesible globalmente para enlaces
    window.showSection = function(sectionId) {
        // Efecto de desvanecimiento para sección actual
        const currentActive = document.querySelector('section.active');
        if (currentActive) {
            currentActive.style.opacity = '0';
            currentActive.style.transform = 'translateY(20px)';
            setTimeout(() => {
                currentActive.classList.remove('active');
            }, 300);
        }
        
        // Mostrar nueva sección con efecto
        const activeSection = document.getElementById(sectionId);
        if (activeSection) {
            setTimeout(() => {
                activeSection.classList.add('active');
                activeSection.style.opacity = '0';
                activeSection.style.transform = 'translateY(20px)';
                
                // Forzar reflow para reiniciar animación
                void activeSection.offsetWidth;
                
                activeSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                activeSection.style.opacity = '1';
                activeSection.style.transform = 'translateY(0)';
                
                // Ejecutar animaciones específicas de la sección
                if (sectionId === 'paquetes') {
                    setTimeout(() => {
                        animatePackageElements();
                    }, 300);
                }
            }, 300);
        }
        
        // Actualizar navegación activa
        navLinks.forEach(navLink => {
            navLink.classList.remove('active');
            if (navLink.getAttribute('data-section') === sectionId) {
                navLink.classList.add('active');
            }
        });
        
        // Scroll suave al inicio de la sección
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }, 100);
    };
    
    // Función para animar elementos de paquetes
    function animatePackageElements() {
        // Agregar etiquetas a los paquetes
        const paquetes = document.querySelectorAll('.paquete');
        paquetes.forEach((paquete, index) => {
            // Verificar si ya tiene etiqueta
            if (!paquete.querySelector('.paquete-label')) {
                const label = document.createElement('div');
                label.className = 'paquete-label';
                
                if (index === 0) label.textContent = 'Popular';
                else if (index === 1) label.textContent = 'Recomendado';
                else if (index === 2) label.textContent = 'Premium';
                
                paquete.appendChild(label);
            }
            
            // Verificar si ya tiene características
            if (!paquete.querySelector('.caracteristicas')) {
                const caracteristicas = document.createElement('div');
                caracteristicas.className = 'caracteristicas';
                
                let features = [];
                if (index === 0) {
                    features = ['WiFi 5GHz', 'Soporte 24/7', '1 dispositivo'];
                } else if (index === 1) {
                    features = ['WiFi 6', 'Soporte prioritario', '3 dispositivos', 'Router incluido'];
                } else {
                    features = ['WiFi 6E', 'Soporte VIP', '5+ dispositivos', 'Router premium', 'Antivirus incluido'];
                }
                
                features.forEach(feature => {
                    const div = document.createElement('div');
                    div.className = 'caracteristica';
                    div.textContent = feature;
                    caracteristicas.appendChild(div);
                });
                
                paquete.appendChild(caracteristicas);
            }
            
            // Verificar y actualizar estructura del paquete
            const speedInfo = paquete.querySelector('p:nth-of-type(1)');
            const priceInfo = paquete.querySelector('p:nth-of-type(2)');
            
            if (speedInfo && priceInfo) {
                // Agregar clases CSS a los elementos
                speedInfo.classList.add('speed-info');
                priceInfo.classList.add('price-info');
                
                // Verificar si ya tiene contenedor de imagen
                if (!paquete.querySelector('.paquete-image-container')) {
                    const img = paquete.querySelector('img');
                    if (img) {
                        // Crear contenedor de imagen
                        const imgContainer = document.createElement('div');
                        imgContainer.className = 'paquete-image-container';
                        imgContainer.appendChild(img.cloneNode(true));
                        
                        // Reemplazar la imagen original con el contenedor
                        img.parentNode.insertBefore(imgContainer, img);
                        img.remove();
                    }
                }
            }
        });
        
        // Animar entrada de elementos
        const packageElements = document.querySelectorAll('.paquete');
        packageElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px) scale(0.95)';
            
            setTimeout(() => {
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0) scale(1)';
            }, index * 200);
        });
    }
    
    // Agregar event listeners a los enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Solo prevenir default si no es un enlace externo
            if (!this.getAttribute('href') || this.getAttribute('href') === '#') {
                e.preventDefault();
                const sectionId = this.getAttribute('data-section');
                if (sectionId) {
                    showSection(sectionId);
                    
                    // Guardar la sección actual en localStorage
                    localStorage.setItem('currentSection', sectionId);
                    
                    // Efecto de ripple en el botón
                    createRippleEffect(e);
                }
            }
        });
    });
    
    // Función para efecto ripple
    function createRippleEffect(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
        circle.classList.add('ripple');
        
        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }
        
        button.appendChild(circle);
    }
    
    // Restaurar la última sección vista (si existe)
    const savedSection = localStorage.getItem('currentSection');
    if (savedSection && document.getElementById(savedSection)) {
        showSection(savedSection);
    } else {
        // Mostrar animación de bienvenida
        animateWelcome();
    }
    
    // Manejo del formulario de contratar - MODIFICADO
    const contratarForm = document.getElementById('contratar-form');
    if (contratarForm) {
        // El formulario ahora usa la función enviarWhatsApp directamente desde el HTML
        // con onsubmit="enviarWhatsApp(event)", pero mantenemos validación adicional
        
        // Agregar validación en tiempo real
        const inputs = contratarForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.value.trim() !== '') {
                    this.classList.add('valid');
                } else {
                    this.classList.remove('valid');
                }
            });
        });
        
        // Validar teléfono
        const telefonoInput = document.getElementById('telefono');
        if (telefonoInput) {
            telefonoInput.addEventListener('input', function() {
                // Limpiar el valor para solo números
                this.value = this.value.replace(/\D/g, '');
            });
        }
        
        // Efecto visual al enviar el formulario
        contratarForm.addEventListener('submit', function(e) {
            // La función enviarWhatsApp se encarga del envío
            // Solo agregamos efectos visuales aquí
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            const originalIcon = '<i class="fab fa-whatsapp"></i>';
            
            // Efecto de carga
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            // Restaurar después de 2 segundos (en caso de que WhatsApp no se abra)
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    // MANEJO DEL FORMULARIO DE LOGIN
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener datos del formulario
            const formData = new FormData(this);
            const email = formData.get('email');
            const password = formData.get('password');
            
            // Contraseña correcta
            const CONTRASEÑA_CORRECTA = "Pastelazul1";
            
            const confirmacion = document.getElementById('login-confirmacion');
            
            // Verificar si la contraseña es correcta
            if (password === CONTRASEÑA_CORRECTA) {
                // Mostrar mensaje de éxito
                confirmacion.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <strong>¡Inicio de sesión exitoso!</strong><br>
                    <small>Redirigiendo a gestión de clientes...</small>
                `;
                confirmacion.classList.remove('error');
                confirmacion.classList.add('show', 'success');
                
                // Redirigir a clientes.html después de 1 segundo
                setTimeout(() => {
                    window.location.href = 'clientes.html';
                }, 1000);
            } else {
                // Mostrar mensaje de error
                confirmacion.innerHTML = `
                    <i class="fas fa-exclamation-triangle"></i>
                    <strong>¡Contraseña incorrecta!</strong><br>
                    <small>Por favor, intenta nuevamente.</small>
                `;
                confirmacion.classList.remove('success');
                confirmacion.classList.add('show', 'error');
                
                // Agregar animación de error al formulario
                loginForm.classList.add('shake');
                setTimeout(() => {
                    loginForm.classList.remove('shake');
                }, 500);
                
                // Limpiar el campo de contraseña
                this.querySelector('input[name="password"]').value = '';
                this.querySelector('input[name="password"]').focus();
                
                // Ocultar mensaje después de 5 segundos
                setTimeout(() => {
                    confirmacion.classList.remove('show');
                }, 5000);
            }
        });
    }
    
    // Validación en tiempo real para contraseña
    const passwordInput = document.querySelector('input[name="password"]');
    if (passwordInput) {
        const passwordError = document.createElement('div');
        passwordError.className = 'password-error';
        passwordError.textContent = 'Contraseña incorrecta';
        passwordInput.parentNode.appendChild(passwordError);
        
        passwordInput.addEventListener('input', function() {
            if (this.value && this.value !== "Pastelazul1") {
                this.classList.add('error-border');
                passwordError.classList.add('show');
            } else {
                this.classList.remove('error-border');
                passwordError.classList.remove('show');
            }
        });
        
        // También ocultar el mensaje cuando el campo está vacío
        passwordInput.addEventListener('blur', function() {
            if (this.value === '') {
                passwordError.classList.remove('show');
            }
        });
    }
    
    // Función para animación de bienvenida
    function animateWelcome() {
        const welcomeText = document.querySelector('header h1');
        if (welcomeText) {
            welcomeText.style.opacity = '0';
            welcomeText.style.transform = 'translateY(-30px)';
            
            setTimeout(() => {
                welcomeText.style.transition = 'opacity 1s ease, transform 1s ease';
                welcomeText.style.opacity = '1';
                welcomeText.style.transform = 'translateY(0)';
            }, 500);
        }
    }
    
    // Efectos de hover para tarjetas
    const cards = document.querySelectorAll('.bloque, .paquete');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Validación en tiempo real para formularios
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            if (this.value.trim() !== '') {
                this.classList.add('filled');
            } else {
                this.classList.remove('filled');
            }
        });
        
        // Validación de email
        if (input.type === 'email') {
            input.addEventListener('input', function() {
                const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value);
                this.style.borderColor = isValid ? '#28a745' : '#dc3545';
            });
        }
    });
    
    // Efecto de partículas decorativas
    createParticles();
    
    // Inicializar paquetes si están visibles al cargar
    if (document.getElementById('paquetes').classList.contains('active')) {
        animatePackageElements();
    }
});

// Función para crear partículas decorativas
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    
    document.body.appendChild(particlesContainer);
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 60 + 20;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const opacity = Math.random() * 0.05 + 0.02;
        const blur = Math.random() * 10 + 5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${posX}%;
            top: ${posY}%;
            background: radial-gradient(circle at center, rgba(26, 58, 143, ${opacity}) 0%, transparent 70%);
            filter: blur(${blur}px);
            border-radius: 50%;
            animation: float ${Math.random() * 20 + 10}s infinite ease-in-out;
            animation-delay: ${Math.random() * 5}s;
        `;
        
        particlesContainer.appendChild(particle);
    }
}

// Función para enviar formulario a WhatsApp - NUEVA FUNCIÓN
function enviarWhatsApp(event) {
    event.preventDefault();
    
    // Obtener valores del formulario
    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;
    const direccion = document.getElementById("direccion").value;
    const referencias = document.getElementById("referencias").value;
    
    // Validar que todos los campos estén completos
    if (!nombre || !telefono || !direccion || !referencias) {
        // Mostrar error si falta algún campo
        const confirmacion = document.getElementById("contratar-confirmacion");
        confirmacion.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Por favor, complete todos los campos requeridos.`;
        confirmacion.classList.add("show", "error");
        
        setTimeout(() => {
            confirmacion.classList.remove("show");
        }, 3000);
        return false;
    }
    
    // Número de WhatsApp (formato internacional sin +)
    const numeroTrabajo = "524981046381"; 
    
    // Crear mensaje con formato
    const mensaje = `Hola, quiero contratar el servicio de internet.%0A%0A` +
                   `*Nombre:* ${nombre}%0A` +
                   `*Teléfono:* ${telefono}%0A` +
                   `*Dirección:* ${direccion}%0A` +
                   `*Referencias:* ${referencias}%0A%0A` +
                   `*Fecha:* ${new Date().toLocaleDateString('es-MX')}`;
    
    // Crear URL de WhatsApp
    const url = `https://wa.me/${numeroTrabajo}?text=${mensaje}`;
    
    // Mostrar confirmación
    const confirmacion = document.getElementById("contratar-confirmacion");
    confirmacion.innerHTML = `<i class="fab fa-whatsapp"></i> ¡Solicitud enviada! Se abrirá WhatsApp para completar el proceso.`;
    confirmacion.classList.remove("error");
    confirmacion.classList.add("show", "success");
    
    // Abrir WhatsApp en nueva pestaña después de breve delay
    setTimeout(() => {
        window.open(url, "_blank");
        
        // Limpiar formulario después de 3 segundos
        setTimeout(() => {
            document.getElementById("contratar-form").reset();
            confirmacion.classList.remove("show");
            
            // Remover clases de validación
            const inputs = document.querySelectorAll('#contratar-form input, #contratar-form textarea');
            inputs.forEach(input => input.classList.remove('valid'));
        }, 3000);
    }, 1000);
    
    // Prevenir el comportamiento por defecto del formulario
    return false;
}

// Añadir estilos CSS dinámicamente
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
    }
    
    .filled {
        background: linear-gradient(135deg, rgba(26, 58, 143, 0.05) 0%, rgba(42, 74, 176, 0.05) 100%);
        border-color: #1a3a8f !important;
    }
    
    .valid {
        border-color: #28a745 !important;
        background: linear-gradient(135deg, rgba(40, 167, 69, 0.05) 0%, rgba(40, 167, 69, 0.02) 100%);
    }
    
    .paquete-image-container,
    .paquete img,
    .speed-info,
    .price-info,
    .caracteristica {
        transition: all 0.3s ease;
    }
    
    @keyframes pricePulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    .paquete:hover .price-info {
        animation: pricePulse 2s infinite;
    }
    
    .caracteristica:hover {
        transform: translateX(10px);
        color: #1a3a8f;
        font-weight: 500;
    }
    
    .caracteristica:hover::before {
        transform: scale(1.2);
        color: #2ecc71;
    }
    
    .paquete:hover .paquete-image-container {
        transform: scale(1.1);
    }
    
    .paquete:hover .paquete img {
        transform: scale(1.1) rotate(5deg);
    }
    
    .paquete-label {
        animation: slideInRight 0.5s ease-out;
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .caracteristica {
        animation: fadeInUp 0.5s ease-out forwards;
        opacity: 0;
        transform: translateY(10px);
    }
    
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .caracteristica:nth-child(1) { animation-delay: 0.1s; }
    .caracteristica:nth-child(2) { animation-delay: 0.2s; }
    .caracteristica:nth-child(3) { animation-delay: 0.3s; }
    .caracteristica:nth-child(4) { animation-delay: 0.4s; }
    .caracteristica:nth-child(5) { animation-delay: 0.5s; }
    
    /* Estilos para mensajes de login */
    .confirmation.success {
        background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
        color: #155724;
        border-left: 5px solid #28a745;
    }
    
    .confirmation.error {
        background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
        color: #721c24;
        border-left: 5px solid #dc3545;
    }
    
    .confirmation.success i {
        color: #28a745 !important;
    }
    
    .confirmation.error i {
        color: #dc3545 !important;
    }
    
    /* Estilos específicos para WhatsApp */
    .confirmation.success i.fa-whatsapp {
        color: #25D366 !important;
    }
    
    /* Animación de error (shake) */
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .shake {
        animation: shake 0.5s ease-in-out;
    }
    
    /* Estilo para campo de contraseña con error */
    .error-border {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
    }
    
    /* Mensaje de error debajo del campo de contraseña */
    .password-error {
        color: #dc3545;
        font-size: 0.9rem;
        margin-top: 5px;
        display: none;
    }
    
    .password-error.show {
        display: block;
    }
    
    /* Estilos para el botón de WhatsApp */
    #contratar-form button {
        background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        transition: all 0.3s ease;
    }
    
    #contratar-form button:hover {
        background: linear-gradient(135deg, #128C7E 0%, #0a6e5f 100%);
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(37, 211, 102, 0.3);
    }
    
    #contratar-form button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none !important;
    }
    
    #contratar-form button i {
        font-size: 1.2rem;
    }
    
    /* Spinner para botón de envío */
    .fa-spinner.fa-spin {
        animation: fa-spin 1s infinite linear;
    }
    
    @keyframes fa-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* Estilos para textarea */
    textarea {
        min-height: 100px;
        resize: vertical;
        font-family: inherit;
        transition: all 0.3s ease;
    }
    
    textarea:focus {
        border-color: #1a3a8f;
        box-shadow: 0 0 0 3px rgba(26, 58, 143, 0.1);
    }
    
    textarea.valid {
        border-color: #28a745 !important;
    }
`;

document.head.appendChild(dynamicStyles);