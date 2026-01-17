// Variables globales
let allClients = [];
let currentFilter = '';
let currentPackage = '';
let currentCity = '';

// Función para obtener clientes desde Firestore (versión simplificada)
async function fetchClientsFromFirestore() {
    try {
        showLoading(true);
        
        // Siempre obtener TODOS los clientes sin filtros en Firestore
        const snapshot = await db.collection('clientes').get();
        
        allClients = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        // Aplicar TODOS los filtros localmente
        filterAndRenderClients();
        updateCitiesFilter();
        
        // Mostrar estado de conexión
        updateFirebaseStatus(true);
        
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        showError('Error al conectar con Firestore: ' + error.message);
        updateFirebaseStatus(false);
    } finally {
        showLoading(false);
    }
}

// Función para aplicar filtros y renderizar
function filterAndRenderClients() {
    const searchTerm = currentFilter.toLowerCase();
    const packageFilter = currentPackage;
    const cityFilter = currentCity;
    
    let filteredClients = allClients;
    
    // Aplicar filtro de búsqueda
    if (searchTerm) {
        filteredClients = filteredClients.filter(client =>
            client.nombre && client.nombre.toLowerCase().includes(searchTerm) ||
            (client.pueblo && client.pueblo.toLowerCase().includes(searchTerm)) ||
            (client.ciudad && client.ciudad.toLowerCase().includes(searchTerm)) ||
            (client.telefono && client.telefono && client.telefono.includes(searchTerm)) ||
            (client.ip && client.ip.includes(searchTerm))
        );
    }
    
    // Aplicar filtro de paquete
    if (packageFilter) {
        filteredClients = filteredClients.filter(client => 
            client.paquete === packageFilter
        );
    }
    
    // Aplicar filtro de ciudad
    if (cityFilter) {
        filteredClients = filteredClients.filter(client => 
            client.ciudad === cityFilter
        );
    }
    
    // Ordenar alfabéticamente
    filteredClients.sort((a, b) => {
        const nameA = a.nombre || '';
        const nameB = b.nombre || '';
        return nameA.localeCompare(nameB);
    });
    
    renderClients(filteredClients);
}

// Función para mostrar/ocultar el indicador de carga
function showLoading(show) {
    const loadingElement = document.getElementById('loading');
    if (show) {
        loadingElement.classList.add('active');
    } else {
        loadingElement.classList.remove('active');
    }
}

// Función para mostrar errores
function showError(message) {
    const clientsList = document.getElementById('clients-list');
    clientsList.innerHTML = `
        <div class="no-results">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Error de conexión</h3>
            <p>${message}</p>
            <button onclick="fetchClientsFromFirestore()" class="action-btn" style="margin-top: 20px;">
                <i class="fas fa-redo"></i> Reintentar
            </button>
        </div>
    `;
}

// Función para actualizar el estado de Firebase
function updateFirebaseStatus(connected) {
    const statusElement = document.getElementById('firebase-status');
    if (connected) {
        statusElement.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Conectado a Firebase Firestore - ${allClients.length} clientes cargados</span>
        `;
        statusElement.style.backgroundColor = '#e8f5e9';
        statusElement.style.color = '#2e7d32';
        statusElement.style.borderColor = '#4CAF50';
    } else {
        statusElement.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>Desconectado de Firebase - Modo offline</span>
        `;
        statusElement.style.backgroundColor = '#ffebee';
        statusElement.style.color = '#c62828';
        statusElement.style.borderColor = '#f44336';
    }
}

// Función para renderizar los clientes
function renderClients(clientsArray) {
    const clientsList = document.getElementById('clients-list');
    clientsList.innerHTML = '';
    
    if (clientsArray.length === 0) {
        clientsList.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No se encontraron clientes</h3>
                <p>Intenta con otros términos de búsqueda o filtros</p>
            </div>
        `;
        return;
    }
    
    clientsArray.forEach(client => {
        // Determinar la clase del paquete
        let packageClass = 'package-basic';
        if (client.paquete === 'Intermedio') packageClass = 'package-premium';
        if (client.paquete === 'Premium') packageClass = 'package-business';
        
        // Formatear fecha
        let fechaFormateada = 'No disponible';
        if (client.fechaRegistro) {
            try {
                const fecha = client.fechaRegistro.toDate 
                    ? client.fechaRegistro.toDate() 
                    : new Date(client.fechaRegistro);
                fechaFormateada = fecha.toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            } catch (e) {
                fechaFormateada = 'Fecha inválida';
            }
        }
        
        const clientCard = document.createElement('div');
        clientCard.className = 'client-card';
        clientCard.innerHTML = `
            <div class="client-header">
                <div class="client-name">${client.nombre || 'Sin nombre'}</div>
                <div class="client-id">ID: ${client.id.substring(0, 8)}...</div>
            </div>
            <div class="client-details">
                <div class="detail-row">
                    <div class="detail-icon"><i class="fas fa-network-wired"></i></div>
                    <div class="detail-label">Dirección IP:</div>
                    <div class="detail-value"><span class="ip-address">${client.ip || 'No especificada'}</span></div>
                </div>
                <div class="detail-row">
                    <div class="detail-icon"><i class="fas fa-map-marker-alt"></i></div>
                    <div class="detail-label">Ubicación:</div>
                    <div class="detail-value">${client.pueblo || ''}, ${client.ciudad || ''}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-icon"><i class="fas fa-cube"></i></div>
                    <div class="detail-label">Paquete:</div>
                    <div class="detail-value"><span class="package ${packageClass}">${client.paquete || 'No especificado'}</span></div>
                </div>
                <div class="detail-row">
                    <div class="detail-icon"><i class="fas fa-phone"></i></div>
                    <div class="detail-label">Teléfono:</div>
                    <div class="detail-value">${client.telefono || 'No especificado'}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-icon"><i class="fas fa-calendar"></i></div>
                    <div class="detail-label">Registro:</div>
                    <div class="detail-value">${fechaFormateada}</div>
                </div>
                ${client.activo === false ? `
                <div class="detail-row">
                    <div class="detail-icon"><i class="fas fa-ban"></i></div>
                    <div class="detail-label">Estado:</div>
                    <div class="detail-value"><span style="color: #f44336;">Inactivo</span></div>
                </div>
                ` : ''}
            </div>
        `;
        
        clientsList.appendChild(clientCard);
    });
    
    // Actualizar contador
    document.getElementById('total-clients').textContent = clientsArray.length;
}

// Función para actualizar el filtro de ciudades
function updateCitiesFilter() {
    const ciudades = [...new Set(allClients.map(client => client.ciudad).filter(Boolean))].sort();
    
    const citySelect = document.getElementById('filter-city');
    
    // Guardar la selección actual
    const currentSelection = citySelect.value;
    
    // Limpiar y agregar opciones
    citySelect.innerHTML = '<option value="">Todas las ciudades</option>';
    
    ciudades.forEach(ciudad => {
        const option = document.createElement('option');
        option.value = ciudad;
        option.textContent = ciudad;
        citySelect.appendChild(option);
    });
    
    // Restaurar la selección anterior si existe
    if (ciudades.includes(currentSelection)) {
        citySelect.value = currentSelection;
    }
}

// Función para exportar datos como JSON
function exportToJSON() {
    const dataStr = JSON.stringify(allClients, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `clientes_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Función para agregar datos de ejemplo a Firestore
async function addSampleData() {
    try {
        const sampleData = [
            {
                nombre: "Ana García López",
                ip: "192.168.1.101",
                pueblo: "San Ángel",
                ciudad: "Ciudad de México",
                paquete: "Intermedio",
                telefono: "55-1234-5678",
                fechaRegistro: new Date(),
                activo: true
            },
            {
                nombre: "Carlos Martínez Ruiz",
                ip: "10.0.0.45",
                pueblo: "Zapopan",
                ciudad: "Guadalajara",
                paquete: "Premium",
                telefono: "33-2345-6789",
                fechaRegistro: new Date(),
                activo: true
            },
            {
                nombre: "María Fernández Torres",
                ip: "172.16.32.10",
                pueblo: "San Pedro",
                ciudad: "Monterrey",
                paquete: "Básico",
                telefono: "81-3456-7890",
                fechaRegistro: new Date(),
                activo: true
            }
        ];
        
        const batch = db.batch();
        
        sampleData.forEach((cliente) => {
            const docRef = db.collection('clientes').doc();
            batch.set(docRef, cliente);
        });
        
        await batch.commit();
        alert('Datos de ejemplo agregados exitosamente');
        fetchClientsFromFirestore();
        
    } catch (error) {
        console.error('Error al agregar datos de ejemplo:', error);
        alert('Error: ' + error.message);
    }
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', function() {
    // Configurar año actual en el footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Cargar clientes inicialmente
    fetchClientsFromFirestore();
    
    // Configurar búsqueda en tiempo real
    let searchTimeout;
    document.getElementById('search-input').addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        currentFilter = e.target.value;
        searchTimeout = setTimeout(() => {
            filterAndRenderClients();
        }, 300);
    });
    
    // Configurar filtros
    document.getElementById('filter-package').addEventListener('change', function(e) {
        currentPackage = e.target.value;
        filterAndRenderClients();
    });
    
    document.getElementById('filter-city').addEventListener('change', function(e) {
        currentCity = e.target.value;
        filterAndRenderClients();
    });
    
    // Configurar botón de actualizar
    document.getElementById('refresh-btn').addEventListener('click', function() {
        this.classList.add('rotating');
        fetchClientsFromFirestore();
        setTimeout(() => {
            this.classList.remove('rotating');
        }, 1000);
    });
    
    // Configurar botón de exportar
    document.getElementById('export-json').addEventListener('click', exportToJSON);
    
    // Configurar botón para agregar datos de ejemplo (solo mostrar en desarrollo)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const addSampleBtn = document.getElementById('add-sample');
        addSampleBtn.style.display = 'flex';
        addSampleBtn.addEventListener('click', addSampleData);
    }
    
    // Escuchar cambios en tiempo real en Firestore
    db.collection('clientes').onSnapshot((snapshot) => {
        console.log('Cambios detectados en Firestore');
        // Recargar todos los datos
        fetchClientsFromFirestore();
    }, (error) => {
        console.error('Error en listener de Firestore:', error);
    });
});