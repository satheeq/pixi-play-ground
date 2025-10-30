

function start() {
    let app = new PIXI.Application({width: 600, height: 600, backgroundColor: 0xE5E7E9});
    console.log('creating pixi app');

    document.body.appendChild(app.view);

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

    let player = PIXI.Sprite.from('./img/sample.png');
    player.anchor.set(0.5);
    player.width = 70;
    player.height = 70;
    player.x = 10;
    player.y = 20;

    app.stage.addChild(player);

    let elp = 0;

    app.ticker.add((delta) => {
        player.x = player.x + delta;

        if (player.x > app.view.width - player.width) {
           player.y = player.y + player.height;
           player.x = 10;

            if (player.y > app.view.height) {
                player.y = 20;
            }
        }
    });

}