

function start() {
    // let app = new PIXI.Application({width: 600, height: 600, backgroundColor: 0xE5E7E9});
    // console.log('creating pixi app');
    //
    // document.body.appendChild(app.view);

// Create window frame
//     let frame = new PIXI.Graphics();
//     frame.beginFill(0x666666);
//     frame.lineStyle({color: 0xffffff, width: 2, alignment: 0});
//     frame.drawRect(0, 0, 300, 300);
//     // frame.anchor.set(0.5); not supported in graphics
//     frame.position.set((app.view.width / 2) - frame.width/2, app.view.height/2 - frame.height/2);
//
//     app.stage.addChild(frame);
//
//

    // let player = PIXI.Sprite.from('./img/sample.png');
    // player.anchor.set(0.5);
    // player.width = 70;
    // player.height = 70;
    // player.x = 10;
    // player.y = 20;
    //
    // app.stage.addChild(player);
    //
    // let elp = 0;
    //
    // app.ticker.add((delta) => {
    //     player.x = player.x + delta;
    //
    //     if (player.x > app.view.width - player.width) {
    //        player.y = player.y + player.height;
    //        player.x = 10;
    //
    //         if (player.y > app.view.height) {
    //             player.y = 20;
    //         }
    //     }
    // });


    // Masking
//     // Create window frame
//     let frame = new PIXI.Graphics();
//     frame.beginFill(0x666666);
//     frame.lineStyle({ color: 0xffffff, width: 2, alignment: 0 });
//     frame.drawRect(0, 0, 300, 300);
//     frame.position.set(320 - 104, 180 - 104);
//     app.stage.addChild(frame);
//
// // Create a graphics object to define our mask
//     let mask = new PIXI.Graphics();
// // Add the rectangular area to show
//     mask.beginFill(0xffffff);
//     mask.drawRect(0,0,200,250);
//     mask.endFill();
//
// // Add container that will hold our masked content
//     let maskContainer = new PIXI.Container();
// // Set the mask to use our graphics object from above
//     maskContainer.mask = mask;
// // Add the mask as a child, so that the mask is positioned relative to its parent
//     maskContainer.addChild(mask);
// // Offset by the window's frame width
//     maskContainer.position.set(10,5);
// // And add the container to the window!
//     frame.addChild(maskContainer);
//
// // Create contents for the masked container
//     let text = new PIXI.Text(
//         'This text will scroll up and be masked, so you can see how masking works.  Lorem ipsum and all that.\n\n' +
//         'You can put anything in the container and it will be masked!',
//         {
//             fontSize: 24,
//             fill: 0x1010ff,
//             wordWrap: true,
//             wordWrapWidth: 180
//         }
//     );
//     text.x = 10;
//     maskContainer.addChild(text);
//
// // Add a ticker callback to scroll the text up and down
//     let elapsed = 0.0;
//     app.ticker.add((delta) => {
//         // Update the text's y coordinate to scroll it
//         elapsed += delta;
//         text.y = 10 + -100.0 + Math.cos(elapsed/50.0) * 100.0;
//     });


    // Create the application helper and add its render target to the page
    const app = new PIXI.Application({ width: 640, height: 360 });
    document.body.appendChild(app.view);

// Add a container to center our sprite stack on the page
    const container = new PIXI.Container();
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;
    app.stage.addChild(container);

// Create the 3 sprites, each a child of the last
    const sprites = [];
    let parent = container;
    for (let i = 0; i < 3; i++) {
        let sprite = PIXI.Sprite.from('./img/sample.png');
        sprite.anchor.set(0.5);
        parent.addChild(sprite);
        sprites.push(sprite);
        parent = sprite;
    }

// Set all sprite's properties to the same value, animated over time
    let elapsed = 0.0;
    app.ticker.add((delta) => {
        elapsed += delta / 60;
        const amount = Math.sin(elapsed);
        const scale = 1.0 + 0.25 * amount;
        const alpha = 0.75 + 0.25 * amount;
        const angle = 40 * amount;
        const x = 75 * amount;
        for (let i = 0; i < sprites.length; i++) {
            const sprite = sprites[i];
            sprite.scale.set(scale);
            sprite.alpha = alpha;
            sprite.angle = angle;
            sprite.x = x;
        }
    });
}