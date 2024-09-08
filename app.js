window.onload=function(){
    
    document.querySelector('.sroll').addEventListener('click', function() {
        window.scrollBy({
          top: 20, // Défiler de 20 pixels vers le bas
          behavior: 'smooth' // Option pour un défilement en douceur
        });
      });

  }
