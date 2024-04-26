function initMap() {
    // Coordenadas iniciais do mapa (Luanda, Angola)
    const initialLatLng = [-8.8368, 13.2343];
  
    // Criação do mapa
    const map = L.map('mapContainer').setView(initialLatLng, 13);
  
    // Camada de tiles (mapa base)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);
  }
  
  // Chame a função para inicializar o mapa quando o DOM estiver carregado
  document.addEventListener('DOMContentLoaded', initMap);