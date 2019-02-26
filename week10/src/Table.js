let typeRow = "row";
let typeColumn = "column";

export default class Table {
    constructor(column = 2, row = 2, w = 50, h = 50) {
        let styleRed = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 72,
            fill: "#FFAFAF",
            stroke: '#FF0000',
            strokeThickness: 6
        });

        let backgroundTex = PIXI.Texture.fromImage("images/backgriund.png");

        this.container = new PIXI.Container();

        this.colLine = [];
        this.rowLine = [];
        this.element = [];
        this.column = column;
        this.row = row;

        // 每一格的容器
        for (let i = 0; i < column; i++) {
            for (let j = 0; j < row; j++) {
                this.element[i + j * column] = new PIXI.Container();
                let element = this.element[i + j * column];
                element.x = i * w + 3;
                element.y = j * h + 3;
                //element.maxWidth = w - 3;
                //element.maxHeight = h - 3;

                // 容器內的Sprite
                element.sprite = new PIXI.Sprite(backgroundTex);
                element.sprite.width = w - 3;
                element.sprite.height = h - 3;
                element.sprite.tint = 0xffffff * ((i + j * column) / column * row) ;
                element.addChild(element.sprite);

                // 容器內的Text
                element.text = new PIXI.Text(i + j * column, styleRed);
                element.addChild(element.text);

                this.container.addChild(element);
            }
        }
        
        // 畫直線        
        for (let i = 0; i <= column; i++) {
            this.colLine[i] = this.creatLine(typeColumn, i * w, row * h, i);
            this.colLine[i].w = w;
            this.container.addChild(this.colLine[i]);
        }

        // 畫橫線
        for (let i = 0; i <= row; i++) {
            this.rowLine[i] = this.creatLine(typeRow, i * h, column * w, i);
            this.rowLine[i].h = h;
            this.container.addChild(this.rowLine[i]);
        }

        // 讓回傳的 container 指向 class 的函式，可以讓外面的人使用
        this.container.changeWidth = (columnNum, width, dif = 0) => {
            this.changeWidth(columnNum, width, dif);
        }
        this.container.changeHeight = (rowNum, height, dif = 0) => {
            this.changeHeight(rowNum, height, dif);
        }
        this.container.getText = (column, row) => {
            return this.getText(column, row);
        }
        this.container.addText = (column, row, text) => {
            this.addText(column, row, text);
        }

        return this.container;
    }

    changeWidth(columnNum, width, dif) {
        if (columnNum === 0) return;

        // 用 width 指定寬度 
        if (width !== 0) {
            // 位移量        
            dif = width - (this.colLine[columnNum].x - this.colLine[columnNum - 1].x);
            this.colLine[columnNum].w = width;
            console.log('TCL: Table -> changeWidth -> dif', dif)
        }

        // 用滑鼠拖拉的變化量dif決定寬度
        if (width === 0) {
            this.colLine[columnNum].w += dif;
            this.colLine[columnNum].x -= dif;
        }

        // 移動直行位置
        for (let i = columnNum; i <= this.column; i++) {
            this.colLine[i].x += dif;
        }

        // 改變橫線長度
        for (let i = 0; i <= this.row; i++) {
            this.rowLine[i].width += dif;
        }

        // 改變儲存格的大小座標
        for (let i = columnNum - 1; i < this.column; i++) {
            for (let j = 0; j < this.row; j++) {
                let element = this.element[i + j * this.column];

                //改變長寬的後面直行改變x座標
                element.x += dif;
                if (i > columnNum - 1) continue;

                //改變長寬的該行改變寬，不改變座標
                element.sprite.width += dif;
                element.x -= dif;
                //element.width += dif;
            }
        }
    }

    changeHeight(rowNum, height, dif) {
        if (rowNum === 0) return;

        // 用 height 指定高度
        if (height !== 0) {
            // 位移量        
            dif = height - (this.rowLine[rowNum].y - this.rowLine[rowNum - 1].y);
            this.rowLine[rowNum].h = height;
        }

        // 用滑鼠拖拉的變化量dif決定高度
        if (height === 0) {
            this.rowLine[rowNum].h += dif;
            this.rowLine[rowNum].y -= dif;
        }

        // 移動橫列位置
        for (let i = rowNum; i <= this.row; i++) {
            this.rowLine[i].y += dif;
        }

        // 改變直線長度
        for (let i = 0; i <= this.column; i++) {
            this.colLine[i].height += dif;
        }

        // 改變儲存格的大小座標
        for (let i = 0; i < this.column; i++) {
            for (let j = rowNum - 1; j < this.row; j++) {
                let element = this.element[i + j * this.column];

                //改變長寬的後面直行改變x座標
                element.y += dif;
                if (j > rowNum - 1) continue;

                //改變長寬的該行改變寬，不改變座標
                element.sprite.height += dif;
                element.y -= dif;
                //element.height += dif;
            }
        }
    }

    addColumn(column, width){

    }

    addRow(row, height){

    }

    creatLine(type, xy, len, num) {
        let line = new PIXI.Graphics();

        line.length = len;
        line.num = num;
        line.type = type;

        line.beginFill(0x000000);

        if (type === typeColumn) {
            line.drawRect(0, 0, 3, len);
            line.endFill();
            line.x = xy;
        }
        else if (type === typeRow) {
            line.drawRect(0, 0, len + 3, 3);
            line.endFill();
            line.y = xy;
        }

        line.isMouseDown = false;
        line.twiceSwitch = false;
        line.interactive = true;
        line.buttonMode = true;
        line.cursor = 'crosshair';


        line.on('pointerdown', lineMouseDown)
            .on('pointerup', lineMouseUp)
            .on('pointerupoutside', lineMouseUp)
            .on('pointermove', lineMouseDrag);

        return line;
    }

    getText(column, row) {
        let element = this.element[column - 1 + (row - 1) * this.column];
        element.removeChild(element.text)
        return element.text;
    }

    addText(column, row, text) {
        let element = this.element[column - 1 + (row - 1) * this.column];
        element.text = text;
        element.text.x = 0;
        element.text.y = 0;
        element.text.text = 87;
        element.addChild(element.text);
    }

    getSprite(column, row) {

    }
}

function lineMouseDown(event) {
    console.log("HIT");
    if (this.twiceSwitch === true){
        console.log("Double HIT!!");

        return;
    }

    this.twiceSwitch = true;
    setTimeout(()=>{this.twiceSwitch = false;}, 250);

    // 移動線
    if (this.num === 0) return;
    this.data = event.data;
    this.originX = this.x;
    this.originY = this.y;
    this.isMouseDown = true;
}

function lineMouseUp() {
    console.log("UP");

    // 防止重複兩次觸發
    if (this.isMouseDown === false) return;

    this.isMouseDown = false;
    if (this.type === typeColumn) {
        // 線移動到靠近前一條線的情況
        if (this.x <= this.originX - this.w + 5) {
            this.x = this.originX - this.w + 5;
        }
        this.parent.changeWidth(this.num, 0, this.x - this.originX)
    }
        if (this.type === typeRow) {
        // 線移動到靠近前一條線的情況
        if (this.y <= this.originY - this.h + 5) {
            this.y = this.originY - this.h + 5;
        }
        this.parent.changeHeight(this.num, 0, this.y - this.originY)
    }
}

function lineMouseDrag() {
    if (this.isMouseDown === false) return;

    let mousePos = this.data.getLocalPosition(this.parent);

    if (this.type === typeColumn) {
        this.x = mousePos.x;

        // 線移動到靠近前一條線的情況
        if (this.x <= this.originX - this.w + 5) {
            this.x = this.originX - this.w + 5;
        }
    }

    if (this.type === typeRow) {
        this.y = mousePos.y;

        // 線移動到靠近前一條線的情況
        if (this.y <= this.originY - this.h + 5) {
            this.y = this.originY - this.h + 5;
        }
    }
}
