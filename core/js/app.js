class Game {

  constructor() {

    document.addEventListener('click', function (e) {

      console.log(e.target.classList);

      if (e.target.classList.contains('cristal')) {

        const coords = { x: e.pageX, y: e.pageY };
        burst.tune(coords).replay();
        _game.increment();
      }

      if (e.target.parentNode.classList.contains('travel-end')) {
        this.endTravel(JSON.parse(e.target.dataset.value));
        e.target.parentNode.parentNode.remove();
      }


    }.bind(this));


    this.shop = JSON.parse(localStorage.getItem('shop')) || [
      {
        name: 'Wooden Pickaxe',
        nb: 0,
        effect: 1,
        price: 10,
        available: false
      },
      {
        name: 'Stone Pickaxe',
        nb: 0,
        effect: 2,
        price: 100,
        available: false
      },
      {
        name: 'Carved Stone Pickaxe',
        nb: 0,
        effect: 5,
        price: 1000,
        available: false
      },
      {
        name: 'Copper Pickaxe',
        nb: 0,
        effect: 10,
        price: 5000,
        available: false
      },
      {
        name: 'Bronze Pickaxe',
        nb: 0,
        effect: 20,
        price: 10000,
        available: false
      },
      {
        name: 'Iron Pickaxe',
        nb: 0,
        effect: 50,
        price: 15000,
        available: false
      },
      {
        name: 'Silver Pickaxe',
        nb: 0,
        effect: 100,
        price: 50000,
        available: false
      },
      {
        name: 'Diamond Pickaxe',
        nb: 0,
        effect: 200,
        price: 75000,
        available: false
      },
      {
        name: 'Gold Pickaxe',
        nb: 0,
        effect: 500,
        price: 100000,
        available: false
      },
      {
        name: 'Adamentium Pickaxe',
        nb: 0,
        effect: 1000,
        price: 150000,
        available: false
      },
      {
        name: 'Vortex Pickaxe',
        nb: 0,
        effect: 2000,
        price: 175000,
        available: false
      }
    ];

    this.travel = JSON.parse(localStorage.getItem('travel')) || [];
    this.click = parseFloat(localStorage.getItem('click')) || 0;
    this.cristalCountElement = document.getElementById('cristal-count');
    this.abbreviations = {
      K: 3,
      M: 6,
      B: 9,
      T: 12
    };

    this.updateCristalCount();
    this.refreshShop();
    this.auto();
    this.parseTravels();
    this.loadNewTravel();

    setInterval(() => {
      this.refreshTravels();
    }, 1000);
  }

  auto() {
    setInterval(() => {
      this.shop.forEach((item) => {
        if (item.nb > 0) {
          this.click += item.nb * item.effect;
        }
      });
      this.updateCristalCount();
      this.refreshShop();
      localStorage.setItem('click', this.click);
    }, 1000);
  }

  bonus() {
    let bonus = 0;

    this.shop.forEach((item) => {
      if (item.nb > 0) {
        bonus += item.nb * item.effect;
      }
    });

    return bonus / 5;
  }

  refreshShop() {
    const shop = document.getElementById('shop');
    shop.innerHTML = '';

    this.shop.forEach((item) => {
      if (this.click < item.price) return;

      const itm = document.createElement('div');
      itm.id = item.name.replace(/\s/g, '');
      itm.classList.add('shop-item');

      const name = document.createElement('span');
      name.classList.add('item-name');
      name.innerHTML = item.name;

      const image = document.createElement('img');
      image.classList.add('item-image');
      image.src = 'core/img/' + item.name.replace(/\s/g, '') + '.png';

      const nb = document.createElement('span');
      nb.classList.add('item-nb');
      nb.innerHTML = item.nb;

      const price = document.createElement('span');
      price.classList.add('item-price');
      price.innerHTML = this.format(item.price);

      itm.append(image, name, nb, price);
      itm.addEventListener('click', () => {
        item.nb++;
        item.price *= 1.15;
        if (this.click - item.price >= 0) {
          this.click -= item.price;
          this.updateCristalCount();
          localStorage.setItem('click', this.click);
          localStorage.setItem('shop', JSON.stringify(this.shop));
          this.refreshShop();
        }
      });

      shop.append(itm);
    });
  }

  increment(clicks = 1) {

    if (clicks > 1) {
      this.click = (this.click + clicks);
    } else {
      this.click = (this.click + clicks) + this.bonus();
    }

    this.refreshShop();
    this.updateCristalCount();
    localStorage.setItem('click', this.click);
  }

  format(number) {
    for (const abbreviation in this.abbreviations) {
      const value = this.abbreviations[abbreviation];
      const lowerBound = Math.pow(10, value);
      const upperBound = Math.pow(10, value + 3);
      if (number >= lowerBound && number < upperBound) {
        const formattedNumber = number / lowerBound;
        return `${formattedNumber.toFixed(2)}${abbreviation}`;
      }
    }
    return Number(number).toFixed(2).toString();
  }

  updateCristalCount() {
    this.cristalCountElement.style.color = 'white';
    this.cristalCountElement.innerHTML = '💎' + this.format(this.click);
  }

  generateAdventureName() {
    const adjectives = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    const nouns = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    const verbs = [];

    for (let i = 0; i < 1000; i++) {
      verbs.push(Math.floor(Math.random() * 1000).toString().padStart(3, "0"));
    }

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];

    return "travel " + randomAdjective + "-" + randomNoun + "-" + randomVerb;
  }

  generateTravel(minutes) {
    const startTime = new Date().getTime();
    const endTime = startTime + (minutes * 60 * 1000);
    const time = minutes;
    const drop = time * 1000;

    return {
      name: this.generateAdventureName(),
      time: time,
      progress: 0,
      start: null,
      end: endTime,
      drop: drop
    };
  }

  addTravel(travel) {
    this.travel.push(travel);
    localStorage.setItem('travel', JSON.stringify(this.travel));
    return travel;
  }



  displayTravel(travel) {

    let ID = travel.name.replace(/\s/g, '');

    if (this.travelIsFinished(travel)) {

      let wrapper = document.createElement('div');
      wrapper.id = ID;
      wrapper.classList.add('travel');
      wrapper.classList.add('end');

      let travelName = document.createElement('div');
      travelName.classList.add('travel-name');
      travelName.innerHTML = travel.name;

      let travelDrop = document.createElement('div');
      travelDrop.classList.add('travel-drop');
      travelDrop.innerHTML = '💎' + this.format(travel.drop);

      let travelTime = document.createElement('div');
      travelTime.classList.add('travel-time');
      travelTime.innerHTML = travel.time + ' min';

      let travelEnd = document.createElement('div');
      travelEnd.classList.add('travel-end');

      let link = document.createElement('div');
      link.classList.add('travel-rewards');
      link.innerHTML = 'reclaim rewards';
      travel.ID = travel.name.replace(/\s/g, '');
      link.dataset.value = JSON.stringify(travel);

      travelEnd.append(link);

      wrapper.append(travelName, travelDrop, travelTime, travelEnd);

      document.getElementById('travel').append(wrapper);


    } else {
      document.getElementById('travel').innerHTML += /* html */ `
      <div id="${travel.name.replace(/\s/g, '')}" class="travel">
          <div class="travel-name">${travel.name}</div>
          <div class="travel-drop">💎${this.format(parseFloat(travel.drop))}</div>
          <div class="travel-time">${travel.time} min</div>
          <div class="travel-bar">
              <span class="travel-bar-fill" style="width: 0%;"></span>
          </div>
      </div>
  `;

    }

  }

  startTravel(travel) {

    let trav = this.travel.find(t => travel.name === t.name);

    if (trav.progress < trav.end) {
      trav.interval = setInterval(() => {

        let startTime = new Date().getTime();

        if (trav.start === null) {
          travel.start = startTime;
        }

        trav.progress = startTime;

        if (this.travelIsFinished(trav)) {
          clearInterval(trav.interval);
          return;
        }

        const progression = trav.progress - trav.start;
        const total = trav.end - trav.start;

        const percent = (progression / total) * 100;
        let selector = '#' + trav.name.replace(/\s/g, '') + ' .travel-bar-fill';

        document.querySelector(selector).style.width = percent + '%';

        localStorage.setItem('travel', JSON.stringify(this.travel));
      }, 1000);
    } else {
      clearInterval(trav.interval);
    }
  }

  parseTravels() {
    if (this.travel.length > 0) {
      this.travel.forEach((t) => {
        this.startTravel(t);
        this.displayTravel(t);
      });
    }
  }

  loadNewTravel() {
    setInterval(() => {
      if (this.travel.length <= 10) {
        let chance = Math.floor(Math.random() * 10) + 1;
        let minute = Math.floor(Math.random() * 1) + 1;

        if (chance === 1) {
          let travel = this.addTravel(this.generateTravel(minute));
          this.startTravel(travel);
          this.displayTravel(travel);
          localStorage.setItem('travel', JSON.stringify(this.travel));
        }
      }
    }, 1000);
  }

  endTravel(travel) {
    this.increment(parseFloat(travel.drop));
    this.removeTravel(travel);
  }

  removeTravel(travel) {
    this.travel = this.travel.filter(item => item.name !== travel.name);
    localStorage.setItem('travel', JSON.stringify(travel));
  }

  travelIsFinished(travel) {
    return travel.progress >= travel.end;
  }

  refreshTravels() {
    this.travel.map((travel) => {
      let ID =  travel.name.replace(/\s/g, '');
      if(this.travelIsFinished(travel)) {
        document.getElementById(ID).remove();
        this.displayTravel(travel);
      }
    });
  }
}

const _game = new Game();
