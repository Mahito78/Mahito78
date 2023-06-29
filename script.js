document.addEventListener('DOMContentLoaded', function() {
    var valeurElement = document.getElementById('valeur-score');
    var coinElement = document.getElementById('valeur-coin');
    var coin = 0;
    function incrementer() {
      var date = new Date();
      var heure = date.getHours();
      var seconds = date.getSeconds();
      var val = Math.floor(Date.now() / 1000) % 100000;
      var coin_rand = Math.random()*100%10;
      if(coin_rand >0){
        coin +=1;
        coinElement.innerText = coin;
      }
      var valeur = val; // Incrémente de 0 à 11
    
      valeurElement.innerText = valeur;
    }
    
    // Appel initial de la fonction
    incrementer();
    
    // Appel répété de la fonction toutes les secondes
    setInterval(incrementer, 1000);
  });