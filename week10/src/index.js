import './css/rwd.css';
import Table from './table.js'

window.onload = function () {
    const [screenW, screenH] = [1024, 768];

    let table;

    //Aliases 設定別名
    let Application = PIXI.Application,
        loader = PIXI.loader

    // Create a Pixi Application 
    let app = new Application({
        width: screenW,         // default: 1024
        height: screenH,        // default: 768
        antialias: true,    // default: false
        transparent: false, // default: false
        resolution: 1,       // default: 1
        backgroundColor: 0xf0f0f0
    });

    // Add the canvas that Pixi automatically created for you to the HTML document 
    document.body.appendChild(app.view);

    // load an image and run the `loadImage` function when it's done
    loader
        .add([])
        .load(initial);

    function initial() {

        table = new Table(5, 4, 70, 100);

        // 可以調整表格位置
        table.x = 50;
        table.y = 50;

        app.stage.addChild(table);
        
        // 可以加入文字
        let styleRed = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 72,
            fill: "#FFAFAF",
            stroke: '#FF0000',
            strokeThickness: 6
        });

        for (let i = 1; i <= 5; i++) {
            for (let j = 1; j <= 4; j++) {
                let text = new PIXI.Text((i - 1) + (j - 1) * 5, styleRed);
                table.addText(i, j, text);
            }
        }

        // 可以取得文字
        let tex = table.getText(3, 2);

        tex.text = "88"
        tex.x = 600;
        tex.y = 600;

        app.stage.addChild(tex);

        // 可以放入Sprite 或 雙擊放入圖片
        let sprite = new PIXI.Sprite(PIXI.Texture.fromImage("images/sky.jpg"));
        table.addSprite(3, 2, sprite);

        // 可以取得Sprite
        let sprite2 = table.getSprite(3, 2);
		console.log('TCL: initial -> sprite2', sprite2);
        
        sprite2.x = 300;
        sprite2.y = 600;
        app.stage.addChild(sprite2);

    }
}