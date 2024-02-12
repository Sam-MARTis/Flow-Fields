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
  constructor(context, width, height, count) {
    this.#context = context;
    this.width = width;
    this.height = height;
    this.count = count;
    this.particles = [];
    this.delTime = 10;
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

      let particle = new Particle(
        x,
        y,
        radius,
        `red`,
        this.#context
      );
      this.particles.push(particle);
    }
  }
  updateDots() {


    this.#context.clearRect(0, 0, this.width, this.height);

    this.particles.forEach((particle, index) => {
      let x = particle.x;
      let y = particle.y;
      let r = particle.radius;
      let delTime = Date.now() - timeOld+1;
      x += particle.velocity.x * 0.002 * 100 *delTime;
      y += particle.velocity.y * 0.002 * 100 * delTime;

      if (x >= this.width - r) {
        x = this.width - r;
        particle.velocity.x *= -1;
      } else if (x <= r) {
        x = r;
        particle.velocity.x *= -1;
      } else if (y >= this.height - r) {
        y = this.height - r;
        particle.velocity.y *= -1;
      } else if (y <= r) {
        y = r;
        particle.velocity.y *= -1;
      }
      particle.x = x;
      particle.y = y;
      //Acceleration
      if (clickState) {
        let distanceMouse = Math.sqrt(
          (mouseX - particle.x) ** 2 + (mouseY - particle.y) ** 2
        );
        particle.acceleration.x =
          (50 * ((particle.x - mouseX) / Math.abs(mouseX - particle.x))) /
          (100 * (distanceMouse / 100) ** 2);
        particle.acceleration.y =
          (50 * ((particle.y - mouseY) / Math.abs(mouseY - particle.y))) /
          (100 * (distanceMouse / 100) ** 4);
        if (particle.acceleration.x > 1) particle.acceleration.x = 1;
        if (particle.acceleration.y > 1) particle.acceleration.y = 1;
        if (particle.acceleration.x < -1) particle.acceleration.x = -1;
        if (particle.acceleration.y < -1) particle.acceleration.y = -1;
        particle.velocity.x += particle.acceleration.x;
        particle.velocity.y += particle.acceleration.y;
        if (particle.velocity.x > 10) particle.velocity.x = 10;
        if (particle.velocity.y > 10) particle.velocity.y = 10;
        if (particle.velocity.x < -10) particle.velocity.x = -10;
        if (particle.velocity.y < -10) particle.velocity.y = -10;
      } else {
        particle.acceleration.x = 0;
        particle.acceleration.y = 0;
      }

      particle.draw();
      timeOld = Date.now();
      this.particles.forEach((particle2) => {
        let x2 = particle2.x;
        let y2 = particle2.y;
        let d = ((x - x2) ** 2 + (y - y2) ** 2) ** 0.5;
        if (d < 200) {
          this.#context.save();
          this.#context.beginPath();
          this.#context.globalAlpha = (1 - d / 200) ** 1.2;
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

//Main function
const main = () => {
  effect = new Effect(context, window.innerWidth, window.innerHeight, 10);
  effect.addDots(230);
  setInterval(() => {
    effect.updateDots();
  }, 10);
};

addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  effect.changeDims(canvas.width, canvas.height);
});
// addEventListener("keydown", (e) => { console.log(e) })
addEventListener("mousedown", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  clickState = 1;
});
addEventListener("mouseup", (e) => {
  clickState = 0;
  console.log(e);
});
