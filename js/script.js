function toggleMenu() {
  const menuIcon = document.querySelector('.menu-icon');
  const sidebar = document.querySelector('.sidebar');
  menuIcon.classList.toggle('open');
  sidebar.style.left = sidebar.style.left === '0px' ? '-200px' : '0px';
}


// Obtém uma referência ao contêiner de resultados de pesquisa
const searchResultsContainer = document.getElementById('searchResults');

// Adiciona um evento de clique na janela
window.addEventListener('click', function (event) {
  // Verifica se o clique ocorreu fora do campo de pesquisa e do contêiner de resultados
  if (event.target !== document.getElementById('searchInput') && !searchResultsContainer.contains(event.target)) {
    // Oculta o contêiner de resultados de pesquisa
    searchResultsContainer.style.display = 'none';
  }
});




let slideIndex = 0;

function moveSlide(n) {
  const slides = document.querySelectorAll('.card');
  const maxIndex = slides.length - 1;
  slideIndex += n;

  if (slideIndex < 0) {
    slideIndex = maxIndex;
  } else if (slideIndex > maxIndex) {
    slideIndex = 0;
  }

  const offset = -slideIndex * 220; // Largura do card (200px) + margem (10px)
  document.querySelector('.card-slides').style.transform = `translateX(${offset}px)`;
}

