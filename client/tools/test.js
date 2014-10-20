var heroesIcanSee = [];
heroesIcanSee.push({x:1000},{x:500});

heroesIcanSee.sort(function(heroA,heroB){ return Math.abs(800 - heroA.x) - Math.abs(800- heroB.x) });

console.log(heroesIcanSee[3])