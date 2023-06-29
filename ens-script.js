const gm = document.querySelector('#game_map')
const pr = document.querySelector('#preview_radius')
const tb = document.querySelector('#towers_box')
const iso = document.querySelector('#iso_btn')
var blocks = 49,
    level = 0,
    tile_size = 45,
    gold = 5,
    en_num = 0,
    enn = 0,
    hit;

const towers = [
  fast={
    name: 'rapid',
    range: 2.5,
    rate: 4.5,
    damage: 1,
    cost: 10
  },
  long={
    name: 'long',
    range: 4,
    rate: 2.5,
    damage: 2,
    cost: 10
  }
]

const levels = [
  one={
    start: [0,5],
    map: [0,0,0,0,0,0,0,
          0,1,1,1,1,1,0,
          0,1,0,0,0,1,0,
          0,1,0,0,0,1,0,
          0,1,0,0,0,1,0,
          2,1,0,0,0,1,9,
          0,0,0,0,0,0,0],
    towers: 1,
    path: 15,
    baddies: 5
  },
  two={
    start: [1,6],
    map: [0,0,0,0,0,0,0,
          0,1,1,1,1,1,0,
          0,1,0,0,0,1,0,
          0,1,0,9,0,1,0,
          0,1,0,1,0,1,0,
          0,1,0,1,1,1,0,
          0,2,0,0,0,0,0],
    towers: 1,
    path: 18,
    baddies: 10
  },
  three={
    start: [0,5],
    map: [0,0,0,0,0,0,0,
          0,1,1,1,1,1,9,
          0,1,0,0,0,0,0,
          0,1,1,1,1,1,0,
          0,0,0,0,0,1,0,
          2,1,1,1,1,1,0,
          0,0,0,0,0,0,0],
    towers: 1,
    path: 19,
    baddies: 15
  }
]

function buildMap() {
  gm.dataset.level = level
  en_num = levels[level].baddies

  for(var i=0;i<levels[level].map.length;i++){
    var b = document.createElement('div')
    if(levels[level].map[i] == 0){
      b.className = 'game_ground'
    }
    if(levels[level].map[i] == 1){
      b.className = 'game_path'
    }
    if(levels[level].map[i] == 2){
      b.className = 'game_path start'
    }
    if(levels[level].map[i] == 9){
      b.className = 'game_gold'
      b.dataset.hp = gold
      b.innerHTML = `<div id='gold_hp'>${gold}</div>`
    }
    gm.appendChild(b)
  }

  var b = gm.querySelectorAll('.game_ground')
  b.forEach(function(elm){
    elm.addEventListener('click', placeTower)

    elm.addEventListener('mouseenter', function(){      
      if(document.querySelector('.selected')) {
        var pr_size = document.querySelector('.selected').dataset.range * tile_size
        var b_loc = elm.getBoundingClientRect()
        var x = b_loc.x + (tile_size*.5)
        var y = b_loc.y + (tile_size*.5)
        pr.style.left = x + 'px'
        pr.style.top = y + 'px'
        pr.style.width = pr_size + 'px'
        pr.style.height = pr_size + 'px'
        pr.style.display = 'block'
      }
    })
    elm.addEventListener('mouseleave', function(){
      pr.style.display = 'none'
    })

    if(Math.random() < .2) {
      elm.classList.add('tree')
    }
  })
}

buildMap()

function addTowers() {
  for(var i=0;i<levels[level].towers;i++) {
    var t = document.createElement('div')
    var num = Math.floor(Math.random()*towers.length)
    t.className = 'tower ' + towers[num].name    
    t.dataset.range = towers[num].range
    t.dataset.rate = towers[num].rate
    t.dataset.name = towers[num].name
    t.dataset.damage = towers[num].damage
    t.onclick = function() {    
      if(document.querySelector('.selected')) {
        document.querySelector('.selected').classList.remove('selected')
      }
      this.classList.add('selected')
    }
    tb.appendChild(t)
  }
}

addTowers()

const colors =['#FF3100','#00FCFF','#FFA1CD','#FFCC00']
function addEnemy() {
  var e = document.createElement('div')
  e.className = 'enemy'
  e.dataset.hp = '5'
  e.innerHTML = '5'
  e.style.left = levels[level].start[0] * tile_size + 'px'
  e.style.top = levels[level].start[1] * tile_size + 'px'
  e.style.animationDuration = levels[level].path * .75 - level + 's'
  e.style.setProperty('--enemy-color', colors[Math.floor(Math.random()*colors.length)])

  e.onanimationend = function() {
    gold--
    document.querySelector('#gold_hp').innerHTML = gold
    this.remove()
  }
  gm.appendChild(e)

  enn++
  if(enn < en_num) {
    setTimeout(addEnemy, levels[level].path / levels[level].baddies * 1000)
  }
}
// addEnemy()

function placeTower(e) {
  if(document.querySelector('.selected')) {
    var t = document.querySelector('.selected')
    var c = document.querySelector('.selected').classList
    this.classList.add('tower')
    this.classList.add(c[1])
    this.dataset.name = t.dataset.name
    this.dataset.range = t.dataset.range
    this.dataset.rate = t.dataset.rate
    this.dataset.damage = t.dataset.damage
    document.querySelector('.selected').innerHTML = ''
    document.querySelector('.selected').className = 'tower'

    if(document.querySelectorAll('.game_ground.tower').length == levels[level].towers) {
      addEnemy()
      var t = document.querySelectorAll('.game_ground.tower')
      t.forEach(function(elm){
        elm.classList.add('game_on')

        function checkHits(){
          var elm_loc = elm.getBoundingClientRect()
          var r2 = (tile_size*elm.dataset.range)*.5;
          var x2 = elm_loc.x + (tile_size*.5)
          var y2 = elm_loc.y + (tile_size*.5)

          if((document.querySelector('.enemy') || enn < levels[level].baddies) && gold != 0){
            var e = document.querySelectorAll('.enemy')
            hit = false
            e.forEach(function(en){
              var loc = en.getBoundingClientRect()
              var r1 = tile_size*.5
              var x1 = loc.x + r1
              var y1 = loc.y + r1
              if(Math.hypot(x2-x1, y2-y1) <= (r2 + r1) && !hit) {
                hit = true
                var b = document.createElement('div')
                b.className = 'bullet'                
                b.style.left = x2 - 5 + 'px'
                b.style.top = y2 - 20 + 'px'
                b.ontransitionend = function(){ this.remove() }
                document.body.appendChild(b)

                setTimeout(function(){
                  var bs = document.querySelectorAll('.bullet')
                  bs.forEach(function(elm){
                    elm.style.left = x1 + 'px'
                    elm.style.top = y1 + 'px'
                    elm.style.opacity = '0'
                  })
                }, 5)

                en.dataset.hp = en.dataset.hp - elm.dataset.damage
                if(en.dataset.hp <= 0){
                  en.remove()
                } else {
                  en.innerHTML = en.dataset.hp
                }                
              }
            })
            setTimeout(checkHits, 2000 / elm.dataset.rate)
          }  else {

            //game reset stuff
            clearAll(window)
            if(level < levels.length - 1 && gold != 0) {
              level++  
            } else {
              level = 0
              gold = 5
            }
            // console.log(level)
            enn = 0            
            gm.innerHTML = ''
            tb.innerHTML = ''

            var bs = document.querySelectorAll('.bullet')
            bs.forEach(function(elm){
              elm.remove()
            })

            addTowers()
            buildMap()
          }
        }        
        checkHits()
      })      
    }
  }
}

// clear all timeouts and intervals
function clearAll(windowObject) {
  var id = Math.max(
    windowObject.setInterval(noop, 1000),
    windowObject.setTimeout(noop, 1000)
  );

  while (id--) {
    windowObject.clearTimeout(id);
    windowObject.clearInterval(id);
  }

  function noop(){}
}

iso.addEventListener('click', function(){
  gm.classList.toggle('iso')
})
