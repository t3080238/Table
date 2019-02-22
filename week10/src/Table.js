import { Container } from "pixi.js";

let typeRow = "row";
let typeColumn = "column";

/*export default class Table {
    constructor(column = 2, row = 2, w = 50, h = 50) {

        this.container = new PIXI.Container();

        this.element = [];

        this.line = new Line(column, row, w, h);

        let line = new PIXI.Graphics();
        line.lineStyle(1, 0x000000, 1);

        // 畫直線
        for (let i = 0; i <= column; i++) {
            line.moveTo( i * w , 0);
            line.lineTo( i * w , row * h);
        }

        // 畫橫線
        for (let i = 0; i <= row; i++) {
            line.moveTo( 0 , i * h);
            line.lineTo( column * w , i * h);
        }

        this.container.addChild(this.line);

        return this.container;
    }
}

class Line{
    constructor(column, row, w, h){
        this.line = new PIXI.Graphics();
        this.line.lineStyle(1, 0x000000, 1);

        // 畫直線
        for (let i = 0; i <= column; i++) {
            this.line.moveTo( i * w , 0);
            this.line.lineTo( i * w , row * h);
        }

        // 畫橫線
        for (let i = 0; i <= row; i++) {
            this.line.moveTo( 0 , i * h);
			console.log('TCL: Table -> constructor ->  0 , i * h',  0 , i * h)
            this.line.lineTo( column * w , i * h);
			console.log('TCL: Table -> constructor ->  column * w , i * h',  column * w , i * h)
        }

        return this.line;
    }
}*/

export default class Table {
    constructor(column = 2, row = 2, w = 50, h = 50) {

        this.container = new PIXI.Container();

        this.colLine = [];
        this.rowLine = [];

        this.element = [];

        // 畫直線
        this.colLine[0] = new Line(typeColumn, 0, row * h, 0, this.container)

        // 畫橫線
        this.rowLine[0] = new Line(typeRow, 0, column * h, 0, this.container)

        //this.rec = new SSprite(this.container);

        //this.container.addChild(this.colLine[0]);


        return this.container;
    }



}
class Line {
    constructor(type, xy, len, num, container) {
        let line = new PIXI.Graphics();

        this.length = len;
        this.num = num;

        //line.lineStyle(10, 0x000000, 2);
        line.beginFill(0x000000);

        if (type === typeColumn) {
            line.drawRect(xy, 0, 3, len);
            line.endFill();
            line.x = xy;
        }
        else if (type === typeRow) {
            line.drawRect(0, xy, len, 3);
            line.endFill();
            line.y = xy;
        }


        line.interactive = true;
        line.buttonMode = true;
        line.cursor = 'wait';

        line.on('pointerdown', () => {console.log("HIT"); });

        container.addChild(line);
    }

    removeLine(){
        //app.stage.removeChild(this.line);
    }
}

// class SSprite{
//     constructor(container, w = 100, h = 100){
//         let rectangle = new PIXI.Graphics();
//         rectangle.beginFill(0x66CCFF);
//         rectangle.drawRect(10, 10, w, h);
//         rectangle.endFill();
//         rectangle.interactive = true;
//         rectangle.buttonMode = true;
//         rectangle.on('pointerdown', () => {console.log("HIT"); });
//         container.addChild(rectangle);

//     }
// }