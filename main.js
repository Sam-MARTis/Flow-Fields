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
  // canvas.width = 1500;
  // canvas.height = 900;
  // context.translate(0.5, 0.5);
  // let size = window.innerWidth;

  // // Set actual size in memory (scaled to account for extra pixel density).
  // let scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
  // canvas.width = size * scale;
  // canvas.height = size * scale;

  // Normalize coordinate system to use css pixels.
  // context.scale(scale, scale);

  // context.scale(window.innerWidth / 1500, window.innerHeight / 900);

  // width = canvas.width = window.innerWidth;
  // height = canvas.height = window.innerHeight;

  // width = canvas.width = 1500;
  // height = canvas.height =1000;
  // canvas.style.height = document.height + "px";
  // canvas.style.width = document.width + "px";

  devicePixelRatio = window.devicePixelRatio || 1;
  // devicePixelRatio = 10;

  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;

  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  context.scale(devicePixelRatio, devicePixelRatio);

  width = canvas.width / devicePixelRatio;
  height = canvas.height / devicePixelRatio;

  //Call the main function
  setTimeout(() => {
    alert(`Width of device is: ${window.innerWidth} and height is: ${window.innerHeight}`)
    main();
    // handleResize();
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
    this.scaleFactor = scaleFactor;
  }

  changeDims(width, height) {
    this.width = width;
    this.height = height;
  }
  addDots(count) {
    for (let i = 0; i < count; i++) {
      let radius = (Math.random() * 6 + 2) * this.scaleFactor;
      let x = Math.random() * (this.width - 2 * radius) + radius;
      let y = Math.random() * (this.height - 2 * radius) + radius;

      let particle = new Particle(x, y, radius, `red`, this.#context);
      this.particles.push(particle);
    }
  }
  updateDots() {
    this.#context.clearRect(0, 0, this.width, this.height);
    this.#context.lineWidth = (1 * width) / 1000;

    this.particles.forEach((particle, index) => {
      let x = particle.x;
      let y = particle.y;
      let r = particle.radius;
      let delTime = Date.now() - timeOld + 1;
      x += particle.velocity.x * 0.001 * 100 * delTime * this.scaleFactor;
      y += particle.velocity.y * 0.001 * 100 * delTime * this.scaleFactor;

      if (x >= window.innerWidth - r) {
        x = window.innerWidth - r;
        particle.velocity.x *= -1;
      } else if (x <= r) {
        x = r;
        particle.velocity.x *= -1;
      } else if (y >= window.innerHeight - r) {
        y = window.innerHeight - r;
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
          (-this.scaleFactor * 200 * Math.sign(mouseX - particle.x)) /
          ((distanceMouse / 10) * this.scaleFactor) ** 4;
        particle.acceleration.y =
          (-this.scaleFactor * 200 * Math.sign(mouseY - particle.y)) /
          ((distanceMouse / 10) * this.scaleFactor) ** 4;
        let bound = 1 * this.scaleFactor;
        if (particle.acceleration.x > bound) particle.acceleration.x = bound;
        if (particle.acceleration.y > bound) particle.acceleration.y = bound;
        if (particle.acceleration.x < -bound) particle.acceleration.x = -bound;
        if (particle.acceleration.y < -bound) particle.acceleration.y = -bound;
        particle.velocity.x += particle.acceleration.x;
        particle.velocity.y += particle.acceleration.y;
        if (particle.velocity.x > 10 * bound) particle.velocity.x = 10 * bound;
        if (particle.velocity.y > 10 * bound) particle.velocity.y = 10 * bound;
        if (particle.velocity.x < -10 * bound)
          particle.velocity.x = -10 * bound;
        if (particle.velocity.y < -10 * bound)
          particle.velocity.y = -10 * bound;
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
        if (d < 200 * this.scaleFactor) {
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
  scaleFactor = Math.sqrt(height * width) / 1500;
  effect = new Effect(
    context,
    window.innerWidth,
    window.innerHeight,
    10,
    scaleFactor
  );
  handleResize();
  effect.addDots(230);
  
  setInterval(() => {
    effect.updateDots();
  }, 10);
};

const handleResize = () => {
  console.log(window.innerWidth, window.innerHeight);
  // devicePixelRatio = window.devicePixelRatio || 1;

  // canvas.width = 1500 * devicePixelRatio;
  // canvas.height = 1000 * devicePixelRatio;

  // canvas.style.width = 1500 + "px";
  // canvas.style.height = 1000 + "px";

  // context.scale(devicePixelRatio, devicePixelRatio);

  // width = canvas.width / devicePixelRatio;
  // height = canvas.height / devicePixelRatio;

  devicePixelRatio = window.devicePixelRatio || 1;
  // devicePixelRatio = 10;

  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;

  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  context.scale(devicePixelRatio, devicePixelRatio);

  width = canvas.width / devicePixelRatio;
  height = canvas.height / devicePixelRatio;

  scaleFactor = Math.sqrt(height * width) / 970;
  effect.changeDims(width, height, scaleFactor);
  console.log("Scalefactor is: ", scaleFactor);
};

addEventListener("resize", handleResize);
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
