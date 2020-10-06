let counts = {};
let keys = [];
let filteredKeys = [];

let textOBJs = [];

async function fetchMessages() {
  const response = await fetch("../avery-zeyao.json");
  if (!response.ok) {
    const errMsg = `An error has occurred: ${response.status}`;
    throw new Error(errMsg);
  }
  const messages = await response.json();
  return messages;
}

function setup() {
  //   noCanvas();

  fetchMessages()
    .then((msg) => {
      //retrieve data from the json file
      const msgArr = Object.values(msg);

      const textArr = msgArr.map((obj) => {
        return obj.text;
      });
      //   console.log(textArr);
      const allWords = textArr.join(" ");
      //   console.log(allWords);
      const tokens = allWords.split(/\W+/);
      //   console.log(tokens);
      // text analysis
      tokens.forEach((word) => {
        word = word.toLowerCase();
        if (!/\d+/.test(word)) {
          if (counts[word] === undefined) {
            counts[word] = 1;
            keys.push(word);
          } else {
            counts[word] = counts[word] + 1;
          }
        }
      });

      keys.sort(compare);

      function compare(a, b) {
        let countA = counts[a];
        let countB = counts[b];
        return countB - countA;
      }

      filteredKeys = keys.filter((key) => counts[key] >= 600 && key.length > 2);

      filteredKeys.sort(compare);

      //   filteredKeys.forEach((key) => {
      //     createDiv(`${key} ${counts[key]}`);
      //   });
    })
    .then(() => {
      createCanvas(windowWidth, windowHeight);
      background(249, 253, 245);
      console.log(filteredKeys);

      for (let i = 0; i < filteredKeys.length; i++) {
        const key = filteredKeys[i];
        const value = counts[key];

        const size = map(value, 0, 7447, 0, 128);

        textOBJs.push(
          new TextOBJ(
            random(size, width - size),
            random(size, height - size),
            size,
            key
          )
        );
        // const rectWidth = map(value, 0, 7447, 0, width);
        // const rectHeight = height / filteredKeys.length;
        // console.log(rectHeight);
        // fill(255, 0, 0);
        // rect(0, i * rectHeight, rectWidth, rectHeight);
      }
      textOBJs.forEach((textOBJ) => {
        textOBJ.display();
      });
      //   function showText(key) {
      //     fill(0);
      //     textSize(16);
      //     text(key, mouseX, mouseY);
      //   }
    });
}

// function draw() {}

class TextOBJ {
  constructor(x, y, size, key) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.key = key;
  }

  display() {
    textSize(this.size);
    text(this.key, this.x, this.y);
  }
}
