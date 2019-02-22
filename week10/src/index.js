import './css/rwd.css';
import Table from './table.js'

window.onload = function () {
    const [screenW, screenH] = [1024, 768];

    let table;

    //Aliases 設定別名
    let Application = PIXI.Application,
        resources = PIXI.loader.resources,
        loader = PIXI.loader,
        Sprite = PIXI.Sprite,
        TextureCache = PIXI.utils.TextureCache,
        Graphics = PIXI.Graphics,
        Container = PIXI.Container

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

        table = new Table();
		console.log('TCL: initial -> table', table)
        
        console.log('TCL: initial -> table.x', table.x)
        console.log('TCL: initial -> table.y', table.y)

        table.x = 50;
        table.y = 50;
        console.log('TCL: initial -> table.x', table.x)
        console.log('TCL: initial -> table.y', table.y)

        app.stage.addChild(table);

        // 設定計時
        app.ticker.add((delta) => { Update(delta); });
    }

    function Update(delta) {

    }
}