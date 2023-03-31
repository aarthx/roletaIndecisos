import React, { SetStateAction } from 'react';
import styles from './Roleta.module.css';

const Roleta = () => {
  const [palavras, setPalavras] = React.useState(
    'Charmander\nBulbasaur\nSquirtle',
  );
  const [options, setOptions] = React.useState([]);
  let arrayDeOpcoes = ['Test1', 'Test2', 'Test3'];
  let startAngle: number = 0;
  // Define a divisão do circulo dado o número de opções
  const arc: number = Math.PI / (options.length / 2);
  let spinTimeout: number | null = null;
  const spinArcStart: number = 10;
  let spinTime: number = 0;
  let spinTimeTotal: number = 0;
  let ctx: CanvasRenderingContext2D | null;

  React.useEffect(() => {
    arrayDeOpcoes = palavras.split('\n').filter((item) => item);
    setOptions(arrayDeOpcoes as SetStateAction<never[]>);
  }, [palavras]);

  React.useEffect(() => {
    drawRouletteWheel();
  }, [options]);

  function byteToHex(n: number) {
    var nybHexString = '0123456789ABCDEF';
    return (
      String(nybHexString.substr((n >> 4) & 0x0f, 1)) +
      nybHexString.substr(n & 0x0f, 1)
    );
  }

  function rgbToColor(red: number, green: number, blue: number) {
    return '#' + byteToHex(red) + byteToHex(green) + byteToHex(blue);
  }

  function getColor(item: number, maxItem: number) {
    let phase: number = 0;
    //Metade de 255
    let center: number = 128;
    //Range para cima e para baixo 1-255
    let width: number = 127;
    // Quantos graus tem uma parte
    let frequency: number = (Math.PI * 2) / maxItem;

    const red: number = Math.sin(frequency * item + 2 + phase) * width + center;
    const green: number =
      Math.sin(frequency * item + 0 + phase) * width + center;
    const blue: number =
      Math.sin(frequency * item + 4 + phase) * width + center;

    return rgbToColor(red, green, blue);
  }

  function drawRouletteWheel() {
    let canvas = document.getElementById('canvas');
    if (canvas && canvas instanceof HTMLCanvasElement) {
      //Localização da borda externa,interna e do texto
      let outsideRadius: number = 300;
      let insideRadius: number = 15;
      let textRadius: number = 160;

      ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, 700, 700);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.font = 'bold 24px Cabin, Arial';

        ctx.beginPath();
        ctx.arc(350, 350, 320, 0, 2 * Math.PI);
        ctx.fillStyle = '#CA6464';
        ctx.lineWidth = 4;
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(350, 350, outsideRadius + 1, 0, 2 * Math.PI);
        ctx.fillStyle = '#CA6464';
        ctx.lineWidth = 4;
        ctx.fill();
        ctx.stroke();

        for (let i = 0; i < options.length; i++) {
          let angle: number = startAngle + i * arc;
          ctx.fillStyle = getColor(i, options.length);

          ctx.beginPath();
          ctx.lineWidth = 1;
          ctx.arc(350, 350, outsideRadius, angle, angle + arc, false);
          ctx.arc(350, 350, insideRadius, angle + arc, angle, true);
          ctx.fill();

          ctx.save();
          ctx.fillStyle = 'black';
          ctx.translate(
            350 + Math.cos(angle + arc / 2) * textRadius,
            350 + Math.sin(angle + arc / 2) * textRadius,
          );
          ctx.rotate(angle + arc / 2 + Math.PI / 2);
          let text = options[i];
          ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
          ctx.restore();
        }

        //Seta
        ctx.fillStyle = '#CA6464';
        ctx.beginPath();
        // ctx.moveTo(350 - 4, 350 - (outsideRadius + 5));
        // ctx.lineTo(350 + 4, 350 - (outsideRadius + 5));
        ctx.moveTo(350 - 20, 350 - (outsideRadius + 5));
        ctx.lineTo(350 + 20, 350 - (outsideRadius + 5));
        ctx.lineTo(350, 350 - (outsideRadius - 30));
        // ctx.lineTo(350 - 9, 350 - (outsideRadius - 0));
        // ctx.lineTo(350 - 10, 350 - (outsideRadius - 5));
        // ctx.lineTo(350 - 4, 350 - (outsideRadius + 5));
        ctx.fill();
      }
    }
  }

  function spin() {
    let spinAngleStart: number = Math.random() * 10 + 10;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3 + 4 * 1000;
    rotateWheel(spinAngleStart);
  }

  function rotateWheel(spinAngleStart: number) {
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
      stopRotateWheel();
      return;
    }
    let spinAngle =
      spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI) / 180;
    drawRouletteWheel();
    spinTimeout = setTimeout(() => {
      rotateWheel(spinAngleStart);
    }, 20);
  }

  function stopRotateWheel() {
    if (spinTimeout) clearTimeout(spinTimeout);
    var degrees = (startAngle * 180) / Math.PI + 90;
    var arcd = (arc * 180) / Math.PI;
    var index = Math.floor((360 - (degrees % 360)) / arcd);
    if (ctx) {
      ctx.save();
      ctx.font = 'bold 30px Cabin, Arial';
      ctx.fillStyle = 'black';
      let text: string = options[index];
      ctx.fillText(text, 350 - ctx.measureText(text).width / 2, 350 + 10);
      ctx.strokeText(text, 350 - ctx.measureText(text).width / 2, 350 + 10);
      ctx.restore();
    }
  }

  function easeOut(t: number, b: number, c: number, d: number) {
    var ts = (t /= d) * t;
    var tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
  }

  React.useEffect(() => {
    drawRouletteWheel();
  }, []);

  return (
    <>
      <canvas
        id="canvas"
        width="700"
        height="700"
        onClick={spin}
        className={styles.roleta}
      ></canvas>
      <div className={styles.boxWrite}>
        <textarea
          value={palavras}
          onChange={({ target }) => setPalavras(target.value)}
          name="palavras"
          id="palavras"
        ></textarea>
      </div>
    </>
  );
};

export default Roleta;
