//Declare global variables here
let canvas;
let context;
let width;
let height;

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
      x: Math.random() * 4 - 2,
      y: Math.random() * 4 - 2,
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
  addDots(count) {
    for (let i = 0; i < count; i++) {
      let radius = Math.random() * 10 + 2;
      let x = Math.random() * (this.width - 2 * radius);
      let y = Math.random() * (this.height - 2 * radius);

      let particle = new Particle(x, y, radius, "red", this.#context);
      //   particle.draw();
    //   console.log("Pushing");
      this.particles.push(particle);
    //   console.log("Pushed");
    }
  }
  drawDots() {
    console.log(this.particles);
    // console.log("Starting to draw particle");
    this.particles.forEach((particle) => {
    //   console.log("Drawing particle");
      particle.draw();
    });
  }
}

//Main function
const main = () => {
  //   let particle = new Particle(100, 100, 20, "red", context);
  //   particle.draw();
  let effect = new Effect(context, window.innerWidth, window.innerHeight, 10);
  effect.addDots(10);
//   console.log("Added dots");
  setTimeout(() => {
    // console.log("Drawing");
    effect.drawDots();
  }, 1000);
};
