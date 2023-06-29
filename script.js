document.addEventListener('DOMContentLoaded', function() {
    var valeurElement = document.getElementById('valeur-score');
    var coinElement = document.getElementById('valeur-coin');
    var timeElement = document.getElementById('valeur-time');
    var coin = 0;
    var timing = 369

    function decrementer(){
        timing-=1;
        timeElement.innerText = timing;
    }

    function incrementer() {
      var date = new Date();
      var heure = date.getHours();
      var seconds = date.getSeconds();
      var val = Math.floor(Date.now() / 1000) % 100000;
      var coin_rand = Math.random()*100%10;
      if(coin_rand >0){
        coin +=1;
        if(coin%30 == 0){
            coin = 0;
        }
        coinElement.innerText = coin;
      }
      var valeur = val; // Incrémente de 0 à 11
    
      valeurElement.innerText = valeur;
    }
    
    // Appel initial de la fonction
    incrementer();
    decrementer();
    // Appel répété de la fonction toutes les secondes
    setInterval(incrementer, 1000);
    setInterval(decrementer, 1000);

  });