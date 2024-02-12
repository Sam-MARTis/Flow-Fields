//Declare global variables here
let canvas;
let context;
let width;
let height;
let timeOld;
let effect;
//Onload function
window.onload = () => {
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  //Call the main function
  setTimeout(() => {
    main();
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
      x: Math.random() * 30 - 15,
      y: Math.random() * 30 - 15,
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
  constructor(context, width, height, count) {
    this.#context = context;
    this.width = width;
    this.height = height;
    this.count = count;
    this.particles = [];
  }

  changeDims(width, height) {
    this.width = width;
    this.height = height;
  }
  addDots(count) {
    for (let i = 0; i < count; i++) {
      let radius = Math.random() * 6 + 2;
      let x = Math.random() * (this.width - 2 * radius) + radius;
      let y = Math.random() * (this.height - 2 * radius) + radius;

      let particle = new Particle(x, y, radius, `hsl(${Math.random()*30}, 100%, 50%)`, this.#context);
      this.particles.push(particle);
    }
  }
  updateDots() {
    this.#context.clearRect(0, 0, this.width, this.height);

    console.log("Animating");
    this.particles.forEach((particle) => {
      particle.x += particle.velocity.x * 0.5;
      particle.y += particle.velocity.y * 0.5;
      if (particle.x >= this.width - particle.radius) {
        particle.x = this.width - particle.radius;
        particle.velocity.x *= -1;
      } else if (particle.x <= particle.radius) {
        particle.x = particle.radius;
        particle.velocity.x *= -1;
      } else if (particle.y >= this.height - particle.radius) {
        particle.y = this.height - particle.radius;
        particle.velocity.y *= -1;
      } else if (particle.y <= particle.radius) {
        particle.y = particle.radius;
        particle.velocity.y *= -1;
      }
      particle.draw();
    });

  }
}

//Main function
const main = () => {

  effect = new Effect(context, window.innerWidth, window.innerHeight, 10);
  effect.addDots(100);
  setInterval(() => {
    effect.updateDots();
  }, 10);
};

addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  effect.changeDims(canvas.width, canvas.height);
});
