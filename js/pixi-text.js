

const style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0x808080
});

const numTextItems = 0; // adjust to stress test
const numSpriteItems = 0; // adjust to stress test
const numBitItems = 0; // adjust to stress test
const numSimBitItems = 1000; // adjust to stress test
const numCanItems = 0; // adjust to stress test

const textObjects = [];
const spriteObjects = [];
const bitmapObjects = [];
const simBitmapObjects = [];
const canObjects = [];

function start() {
    // const htmlContainer = document.getElementById('chartContainer');
    let app = new PIXI.Application({
        width: 1600,
        height: 800,
        backgroundColor: 0x222222
    });
    console.log('creating pixi app');

    document.getElementById('chartContainer').appendChild(app.view);

    // Create PIXI.Text objects
    for (let i = 0; i < numTextItems; i++) {
        const t = new PIXI.Text("PixiText", style);
        t.x = Math.random() * app.screen.width;
        t.y = Math.random() * app.screen.height;
        app.stage.addChild(t);
        textObjects.push(t);
    }

    const textObj = new PIXI.Text("SpriteText", style);
    const spriteTexture = app.renderer.generateTexture(textObj);

    // Create Sprite objects from pre-rendered text
    for (let i = 0; i < numSpriteItems; i++) {
        const s = new PIXI.Sprite(spriteTexture);
        s.x = Math.random() * app.screen.width;
        s.y = Math.random() * app.screen.height;
        app.stage.addChild(s);
        spriteObjects.push(s);
    }

    // Create BitmapText objects
    PIXI.BitmapFont.from("MyFont", {
        fontFamily: "Arial",
        fontSize: 18,
        fill: 0x00ccff
    });

    for (let i = 0; i < numBitItems; i++) {
        const b = new PIXI.BitmapText("BitmapText", { fontName: 'MyFont', fontSize: 24, tint: 0x808080 });
        b.x = Math.random() * app.screen.width;
        b.y = Math.random() * app.screen.height;
        app.stage.addChild(b);
        bitmapObjects.push(b);
    }

    for (let i = 0; i < numSimBitItems; i++) {
        const b = new PIXI.BitmapText("SimBit", { fontName: 'MyFont', fontSize: 24, tint: 0x808080 });
        b.x = Math.random() * app.screen.width;
        b.y = Math.random() * app.screen.height;
        app.stage.addChild(b);
        simBitmapObjects.push(b);
    }

    // Create Canvas-based Sprite objects
    for (let i = 0; i < numCanItems; i++) {
        // Generate a canvas-based texture for the sprite test
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 180;
        canvas.height = 32;
        ctx.font = "24px Arial";
        ctx.fillStyle = "grey";
        ctx.fillText("CanSprTextIn", 30, 24);
        const texture = PIXI.Texture.from(canvas);

        const s = new PIXI.Sprite(texture);
        s.x = Math.random() * app.screen.width;
        s.y = Math.random() * app.screen.height;
        s.ctx = ctx; // Store context for later use
        s.canvas = canvas;

        app.stage.addChild(s);
        canObjects.push(s);
    }

    let counter = 0;
    app.ticker.add(() => {
        counter += 1;

        // Update Text objects (forces re-render of texture each time)
        textObjects.forEach((t, i) => {
            t.text = "PixiText " + Math.floor(counter + i);
            t.x += Math.sin(counter + i) * 0.5;
        });

        // Move Sprites (with texture regeneration)
        spriteObjects.forEach((s, i) => {
            // s.texture.destroy(true); // Destroy the old texture to free memory, this is too expensive!!!

            // textObj.text = "SpriteText " + Math.floor(counter + i);
            // textObj.style.fill = Math.random() * 0xFFFFFF; // Change color to force texture update
            //

            // s.texture = app.renderer.generateTexture(textObj);
            s.x += Math.cos(counter + i) * 0.5;
        });

        // Move BitmapText (no texture regeneration)
        bitmapObjects.forEach((b, i) => {
            b.text = "BitmapText " + Math.floor(counter + i);
            b.x += Math.sin(counter + i) * 0.8;
        });

        // Move SimBitmapText (no texture regeneration)
        simBitmapObjects.forEach((b, i) => {
            // b.text = "SimBit " + Math.floor(counter + i);
            b.x += Math.sin(counter + i) * 0.8;
        });

        // Update canvas textures
        canObjects.forEach((s, i) => {
            s.ctx.clearRect(0, 0, s.canvas.width, s.canvas.height);
            s.ctx.fillText('CanSpTxt ' + Math.floor(counter + i), 0, 24);

            s.texture.update(); // Update the texture to reflect the changed canvas

            // s.x += Math.cos(counter + i) * 0.8;
        });
    });
}