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

        table = new Table(5, 4, 100, 100);

        table.x = 50;
        table.y = 50;

        app.stage.addChild(table);

        let tex = table.getText(3,2);
        let tex2 = table.getText(3,2);
        console.log('TCL: initial -> tex', tex);
        
        tex.text = "88"
        tex.x = 600;
        tex.y = 600;

        app.stage.addChild(tex);
        table.addText(3,2,tex);
        tex.text = "90"

       /* let spr = table.getSprite(3,2);
        
        spr.tint = 0x0000ff
        spr.x = 600;
        spr.y = 600;

        app.stage.addChild(spr);
        table.addSprite(3,2,spr);
        spr.tint = 0xffff00;
        spr.width = 20;*/

    }
}