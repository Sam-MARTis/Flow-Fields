//Declare global variables here
let canvas;
let context;
let width;
let height;
let timeOld;
let effect;
let clickState = 0;
let mouseX = 0;
let mouseY = 0;
let debugging = 1;
let devicePixelRatio;
//Onload function
window.onload = () => {
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");

  devicePixelRatio = window.devicePixelRatio || 1;

  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;

  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  context.scale(devicePixelRatio, devicePixelRatio);

  width = canvas.width / devicePixelRatio;
  height = canvas.height / devicePixelRatio;

  //Call the main function
  setTimeout(() => {
    main();
    handleResize();
  }, 100);
};

// Define particle and effect classes
class Particle {
  #context;
  constructor(x, y, radius, color, context) {
    this.#context = context;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = {
      x: Math.random() * 10 - 5,
      y: Math.random() * 10 - 5,
    };
    this.acceleration = {
      x: 0,
      y: 0,
    };
  }

  draw() {
    this.#context.beginPath();
    this.#context.strokeStyle = `${this.color}`;

    this.#context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.#context.fillStyle = this.color;
    this.#context.fill();

    this.#context.stroke();
  }
}

class Effect {
  #context;
  constructor(context, width, height, count, scaleFactor) {
    this.#context = context;
    this.width = width;
    this.height = height;
    this.count = count;
    this.particles = [];
    this.delTime = 10;
    this.friction = 0.9;
    this.scaleFactor = scaleFactor;
    if (scaleFactor > 0.5) {
      this.#context.lineWidth = (1 * this.scaleFactor ** 0.3) / 10;
    }
    else {
      this.#context.lineWidth = (2 * this.scaleFactor ** 0.3) / 1;
    }
  }

  changeDims(width, height) {
    this.width = width;
    this.height = height;
  }
  addDots(count) {
    for (let i = 0; i < count; i++) {
      let radius = (Math.random() * 6 + 2) * this.scaleFactor/3;
      let x = Math.random() * (this.width - 2 * radius) + radius;
      let y = Math.random() * (this.height - 2 * radius) + radius;

      let particle = new Particle(x, y, radius, `red`, this.#context);
      this.particles.push(particle);
      timeOld = Date.now();
    }
  }
  updateDots() {
    this.#context.clearRect(0, 0, this.width, this.height);
    
    // timeOld = Date.now();
    let timeNew = Date.now();

    this.particles.forEach((particle, index) => {
      let x = particle.x;
      let y = particle.y;
      let r = particle.radius;
      let delTime = timeNew - timeOld + 1;
      x += particle.velocity.x * 0.001 * 10 * delTime * this.scaleFactor;
      y += particle.velocity.y * 0.001 * 10 * delTime * this.scaleFactor;

      if (x >= window.innerWidth - r) {
        x = window.innerWidth - r;
        particle.velocity.x *= -this.friction;
      } else if (x <= r) {
        x = r;
        particle.velocity.x *= -this.friction;
      } else if (y >= window.innerHeight - r) {
        y = window.innerHeight - r;
        particle.velocity.y *= -this.friction;
      } else if (y <= r) {
        y = r;
        particle.velocity.y *= -this.friction;
      }
      particle.x = x;
      particle.y = y;
      //Acceleration
      if (clickState) {
        let distanceMouse = Math.sqrt(
          (mouseX - particle.x) ** 2 + (mouseY - particle.y) ** 2
        );
        particle.acceleration.x =
          ( -50 * Math.sign(mouseX - particle.x)) /
          ((distanceMouse /(this.scaleFactor*10))) ** 4;
        particle.acceleration.y =
          (-50 * Math.sign(mouseY - particle.y)) /
          ((distanceMouse /(this.scaleFactor*10))) ** 4;
        let bound = 0.6 * this.scaleFactor;
        if (particle.acceleration.x > bound) particle.acceleration.x = bound;
        if (particle.acceleration.y > bound) particle.acceleration.y = bound;
        if (particle.acceleration.x < -bound) particle.acceleration.x = -bound;
        if (particle.acceleration.y < -bound) particle.acceleration.y = -bound;
        particle.velocity.x += particle.acceleration.x;
        particle.velocity.y += particle.acceleration.y;
        if (particle.velocity.x > 7 * bound) particle.velocity.x = 7 * bound;
        if (particle.velocity.y > 7 * bound) particle.velocity.y = 7 * bound;
        if (particle.velocity.x < -7 * bound)
          particle.velocity.x = -7 * bound;
        if (particle.velocity.y < -7 * bound)
          particle.velocity.y = -7 * bound;
      } else {
        particle.acceleration.x = 0;
        particle.acceleration.y = 0;
      }

      particle.draw();
      
      this.particles.forEach((particle2) => {
        let x2 = particle2.x;
        let y2 = particle2.y;
        let d = ((x - x2) ** 2 + (y - y2) ** 2) ** 0.5;
        let distVal = 80 * this.scaleFactor;
        if (d < distVal) {
          this.#context.save();
          this.#context.beginPath();
          this.#context.globalAlpha = 1.5*(1 - (d / distVal)**2);
          this.#context.moveTo(x, y);

          this.#context.strokeStyle = `red`;
          this.#context.lineTo(x2, y2);
          this.#context.stroke();
          this.#context.restore();
        }
      });
    });
    
  }
}

const findScaleFactor = () => {
  let scaleFactor = (height + width) / 1300;
  if (height / width > 1.5) {
    scaleFactor = width / 300;
  }
  return scaleFactor;
}
//Main function
const main = () => {
  scaleFactor = findScaleFactor();
  effect = new Effect(context, width, height, 10, scaleFactor);
  handleResize();
  effect.addDots(200);

  setInterval(() => {
    effect.updateDots();
    timeOld = Date.now();
  }, 5);
};

const handleResize = () => {
  console.log(window.innerWidth, window.innerHeight);

  devicePixelRatio = window.devicePixelRatio || 1;

  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;

  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  context.scale(devicePixelRatio, devicePixelRatio);

  width = canvas.width / devicePixelRatio;
  height = canvas.height / devicePixelRatio;

  scaleFactor = findScaleFactor(  )
  effect.changeDims(width, height, scaleFactor);
  console.log("Scalefactor is: ", scaleFactor);
};

addEventListener("resize", handleResize);

addEventListener("mousedown", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  clickState = 1;
});
addEventListener("mouseup", (e) => {
  clickState = 0;
  console.log(e);
});

addEventListener("click", (e) => {
  console.log("Clicked");
  mouseX = e.clientX;
  mouseY = e.clientY;
  clickState = 1;
  setTimeout(() => {
    clickState = 0;
    console.log("Unclicking");
    console.log(e);
  }, 1000);
});
