let typeRow = "row";
let typeColumn = "column";

export default class Table {
    constructor(column = 2, row = 2, w = 50, h = 50) {

        this.backgroundTex = PIXI.Texture.fromImage("images/backgriund.png");

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
                element.number = i + j * column;

                // 容器內的Sprite
                element.sprite = this.creatSprite(w, h, 0x888888);
                element.addChild(element.sprite);

                /*// 容器內的Text
                let styleRed = new PIXI.TextStyle({
                    fontFamily: "Arial",
                    fontSize: 72,
                    fill: "#FFAFAF",
                    stroke: '#FF0000',
                    strokeThickness: 6
                });
                element.text = new PIXI.Text(i + j * column, styleRed);
                element.addChild(element.text);*/

                this.container.addChild(element);
            }
        }

        // 畫直線        
        for (let i = 0; i <= column; i++) {
            this.colLine[i] = this.creatLine(typeColumn, i * w, row * h, i);

            // w為直線與左邊直線的距離，也為第i行的寬
            this.colLine[i].w = w;
            this.container.addChild(this.colLine[i]);
        }

        // 畫橫線
        for (let i = 0; i <= row; i++) {
            this.rowLine[i] = this.creatLine(typeRow, i * h, column * w, i);

            // h為橫線與上方橫線的距離，也為第i列的高
            this.rowLine[i].h = h;
            this.container.addChild(this.rowLine[i]);
        }

        htmlInput(this);

        // 讓回傳的 container 指向 class 的函式，可以讓外面的人使用
        this.container.changeWidth = (columnNum, width, dif = 0) => {
            this.changeWidth(columnNum, width, dif);
        }
        this.container.changeHeight = (rowNum, height, dif = 0) => {
            this.changeHeight(rowNum, height, dif);
        }
        this.container.addColumn = (column, width) => {
            this.addColumn(column, width);
        }
        this.container.addRow = (row, height) => {
            this.addRow(row, height);
        }
        this.container.getText = (column, row) => {
            return this.getText(column, row);
        }
        this.container.addText = (column, row, text) => {
            this.addText(column, row, text);
        }
        this.container.getSprite = (column, row) => {
            return this.getSprite(column, row);
        }
        this.container.addSprite = (column, row, sprite) => {
            this.addSprite(column, row, sprite);
        }

        return this.container;
    }

    changeWidth(columnNum, width, dif) {
        if (columnNum === 0) return;
        if (columnNum > this.column) return;

        // 用 width 指定寬度 
        if (width !== 0) {
            // 位移量        
            dif = width - (this.colLine[columnNum].x - this.colLine[columnNum - 1].x);
            this.colLine[columnNum].w = width;
        }

        // 用滑鼠拖拉的變化量dif決定寬度
        if (width === 0) {
            this.colLine[columnNum].w += dif;
            this.colLine[columnNum].x -= dif;
        }

        // 移動直線位置
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

                // 改變長寬的後面直行改變x座標
                element.x += dif;
                if (i > columnNum - 1) continue;

                // 改變長寬的該行改變寬，不改變座標
                element.sprite.width += dif;
                element.x -= dif;

                this.checkTextSize(element);
            }
        }
    }

    changeHeight(rowNum, height, dif) {
        if (rowNum === 0) return;
        if (rowNum > this.row) return;

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

                this.checkTextSize(element);
            }
        }
    }

    addColumn(column, width) {
        // 簡寫this.colLine
        let line = this.colLine;

        // 儲存格座標移動
        for (let i = column; i < this.column; i++) {
            for (let j = 0; j < this.row; j++) {
                let element = this.element[i + j * this.column];

                // 改變x座標
                element.x += width;
            }
        }

        // 加一直行
        this.column += 1;

        // 最後面加一條線，其x座標為原本最後一條的 x座標 + width
        line[this.column] = this.creatLine(typeColumn, line[this.column - 1].x + width, line[0].height, this.column);
        line[this.column].w = line[this.column - 1].w;
        this.container.addChild(line[this.column]);

        // 其餘移動到前一條的 x座標 + width的位置
        for (let i = this.column - 1; i > column; i--) {
            line[i].x = line[i - 1].x + width;
            line[i].w = line[i - 1].w;
        }
        line[column + 1].w = width;

        // 橫線寬度加長 Width
        for (let i = 0; i <= this.row; i++) {
            this.rowLine[i].width += width;
        }

        // 調整儲存格內容，由後往前
        for (let j = this.row - 1; j >= 0; j--) {
            for (let i = this.column - 1; i >= 0; i--) {

                // 用element簡化要改變的陣列位址
                let element = this.element[i + j * this.column];

                // 在新增直行的右邊行
                if (i > column) {
                    element = this.element[i + j * this.column - j - 1];
                }

                // 在新增的直行，新增容器
                else if (i === column) {
                    element = {};
                    element = new PIXI.Container();
                    element.x = line[column].x + 3;
                    element.y = this.rowLine[j].y + 3;
                    element.number = i + j * this.column;

                    // 容器內的Sprite
                    element.sprite = this.creatSprite(width, this.rowLine[j + 1].h, 0x88ff88);
                    element.addChild(element.sprite);

                    this.container.addChild(element);
                }

                // 在新增直行的左邊行
                else if (i < column) {
                    element = this.element[i + j * this.column - j];
                }

                // 把要改變的陣列位置指回簡寫的element位址
                this.element[i + j * this.column] = element;
            }
        }
    }

    addRow(row, height) {
        // 簡寫this.rowLine
        let line = this.rowLine;

        // 儲存格座標移動
        for (let i = 0; i < this.column; i++) {
            for (let j = row; j < this.row; j++) {
                let element = this.element[i + j * this.column];

                // 改y座標
                element.y += height;
            }
        }

        // 加一橫列
        this.row += 1;

        // 最後面加一條線，其y座標為原本最後一條的 y座標 + height
        line[this.row] = this.creatLine(typeRow, line[this.row - 1].y + height, line[0].width - 3, this.row);
        line[this.row].h = line[this.row - 1].h;
        this.container.addChild(line[this.row]);

        // 其餘移動到前一條的 y座標 + height的位置
        for (let i = this.row - 1; i > row; i--) {
            line[i].y = line[i - 1].y + height;
            line[i].h = line[i - 1].h;
        }
        line[row + 1].h = height;

        // 直線高度加長 height
        for (let i = 0; i <= this.column; i++) {
            this.colLine[i].height += height;
        }

        // 調整儲存格內容，由後往前
        for (let j = this.row - 1; j >= 0; j--) {
            for (let i = this.column - 1; i >= 0; i--) {

                // 用element簡化要改變的陣列位址
                let element = this.element[i + j * this.column];

                // 在新增橫列的下方列
                if (j > row) {
                    element = this.element[i + (j - 1) * this.column];
                }

                // 在新增的橫列，新增容器
                else if (j === row) {
                    element = {};
                    element = new PIXI.Container();
                    element.x = this.colLine[i].x + 3;
                    element.y = line[j].y + 3;
                    element.number = i + j * this.column;

                    // 容器內的Sprite
                    element.sprite = this.creatSprite(this.colLine[i + 1].w, height, 0x8888ff);
                    element.addChild(element.sprite);

                    this.container.addChild(element);
                }

                // 把要改變的陣列位址指回簡寫的element位址
                this.element[i + j * this.column] = element;
            }
        }
    }

    creatSprite(w, h, color) {
        let sprite = new PIXI.Sprite(this.backgroundTex);
        sprite.width = w - 3;
        sprite.height = h - 3;
        sprite.tint = color;

        sprite.twiceSwitch = false;
        sprite.interactive = true;
        sprite.on('pointerdown', spriteMouseDown)

        return sprite;
    }

    creatLine(type, xy, len, num) {
        let line = new PIXI.Graphics();

        //line.length = len;
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
        if (!element.text) return;

        element.removeChild(element.text)
        let returnText = element.text;

        // 清空原本text的東西
        element.text = undefined;

        return returnText;
    }

    addText(column, row, text) {
        let element = this.element[column - 1 + (row - 1) * this.column];
        element.removeChild(element.text);

        element.text = text;
        element.text.x = 0;
        element.text.y = 0;
        element.text.originWidth = element.text.width;
        element.text.originHeight = element.text.height;

        this.checkTextSize(element);

        element.addChild(element.text);
    }

    getSprite(column, row) {
        let element = this.element[column - 1 + (row - 1) * this.column];

        if (!element.sprite) return;

        element.removeChild(element.sprite);
        let returnSprite = element.sprite;

        element.sprite = this.creatSprite(returnSprite.width+3,returnSprite.height+3, 0xff00ff);
        element.addChild(element.sprite);        

        return returnSprite;
    }

    addSprite(column, row, sprite) {
        let element = this.element[column - 1 + (row - 1) * this.column];
        let w = element.sprite.width;
        let h = element.sprite.height;
		console.log(element.sprite.width, element.sprite.height)
        element.removeChild(element.sprite);

        element.sprite = sprite;
        element.sprite.x = 0;
        element.sprite.y = 0;
        element.sprite.width = w;
        element.sprite.height = h;
        element.addChild(element.sprite);
    }

    checkTextSize(element) {
        if (!element.text) return;

        // 文字過大會縮小
        if (element.text.width >= element.sprite.width) {
            element.text.width = element.sprite.width;
        }
        else if (element.text.width < element.sprite.width) {
            element.text.width = element.text.originWidth;
        }

        if (element.text.height >= element.sprite.height) {
            element.text.height = element.sprite.height;
        }
        else if (element.text.height < element.sprite.height) {
            element.text.height = element.text.originHeight;
        }

    }
}

function spriteMouseDown() {
    let container = this.parent.parent;
    let input = container.input;

    input.style.top = "-100px";

    // 雙擊滑鼠的情形
    if (this.twiceSwitch === true) {

        let pos = this.parent.toGlobal(this.position);

        // 畫面比例縮小的時候
        if (window.innerWidth < 1024) {
            input.style.left = `${pos.x * window.innerWidth / 1024}px`;
            input.style.top = `${pos.y * window.innerWidth / 1024}px`;
        }
        else {
            input.style.left = `${pos.x}px`;
            input.style.top = `${pos.y}px`;
        }

        container.selectNum = this.parent.number

        this.twiceSwitch = false;
        return;
    }

    // 雙擊滑鼠的倒數
    this.twiceSwitch = true;
    setTimeout(() => { this.twiceSwitch = false; }, 250);
}

function lineMouseDown(event) {
    console.log("HIT");

    // 雙擊滑鼠的情形
    if (this.twiceSwitch === true) {
        if (this.type === typeColumn) {
            this.parent.addColumn(this.num, 50);
        }
        else if (this.type === typeRow) {
            this.parent.addRow(this.num, 50);
        }
        this.twiceSwitch = false;
        return;
    }

    // 雙擊滑鼠的倒數
    this.twiceSwitch = true;
    setTimeout(() => { this.twiceSwitch = false; }, 250);

    // 移動線
    if (this.num === 0) return;
    console.log("DOWN");
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
    else if (this.type === typeRow) {
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

    else if (this.type === typeRow) {
        this.y = mousePos.y;

        // 線移動到靠近前一條線的情況
        if (this.y <= this.originY - this.h + 5) {
            this.y = this.originY - this.h + 5;
        }
    }
}

function htmlInput(table) {
    let container = table.container;

    container.selectNum = -1;

    container.input = document.createElement("input");
    container.input.type = "file";
    container.input.style.position = "fixed";
    container.input.style.top = "-100px";
    container.input.style.margin = "10px";
    container.input.accept = "image/gif, image/jpeg, image/png";

    // 指向容器和Table，方便更換圖片取用
    container.input.parent = container;
    container.input.table = table;

    $(container.input).on("change", () => { selectImage(container.input); });
    document.body.appendChild(container.input);
}

function selectImage(input) {
    let table = input.table;
    let container = input.parent;

    let file = input.files[0];
    let src = URL.createObjectURL(file);

    // 選到的Sprite
    let selectSprite = table.element[container.selectNum].sprite;

    input.style.top = "-100px";

    selectSprite.tint = 0xffffff;
    selectSprite.texture = PIXI.Texture.fromImage(src);
}