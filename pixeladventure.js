
//finally we can start the game
//custom wrapper of my constants, and starting crafty
Game = {};
Game.player = null;//pointer to player (I may phase this out)
Game.start = function() 
{
    // Start crafty and set a background color so that we can see its working
    
    Crafty.init( Game.width_px,  Game.height_px );
     
    Crafty.background('rgb(255, 255, 255)');
    Crafty.scene(SCENES.loading); 
}
//hud size
/*
Game.hud =
{
    height: 20,
    width: Game.width * Game.u
};*/
Game.u = 16;//size of each tile. short for unit

Game.width = 64;//how many tiles each direction
Game.height = 32;

//the same thing but for indexed by zero arrays
Game.max_x = Game.width -1;
Game.max_y = Game.height -1;
    
Game.min_y = 0 ;
Game.min_x = 0;

//pixel version
Game.width_px = Game.width * Game.u;
Game.height_px = Game.width * Game.u;

//Game.map_grid phased out
   
 

Crafty.scene(SCENES.game, function() 
{ 
     if(Game.args)
     {
         //used to pass arguments between reloads of this scene
     }
    
    
    if( Maps.current == 0)
    { 
        Game.player = Crafty.e(Player.id).at(Player.start_x, Player.start_x);   
    }
   
    this.setmap = function(newMap)
    { 
 
          var id;
          
          for (var x = 0; x < Game.width; x++)   for (var y = 0; y < Game.height; y++) 
          {   
              this.entity_map = [];
              
             // Crafty.e('Darkness').at(x,y);
             
   
                  id = newMap[y][x] ; //id of the block or item or whatever for Crafty to create. such as Rock.id or Tree.id
                  //right now we setting empty space as zero
                  
                  if( id ) //checks for false/zero
                  { 
                      // o = 
                     Crafty.e( id ).at( x , y );
            
                    //o.attr({alpha:1});
              
                  }
                  else
                  {
                      //id is zero or empty
                      //
                      // this is where we would create 'air' block, or whatever
                      
                  }
                   
          }
          
          
   }
    
   if(!Maps.current) Maps.current = 0;//as good as parsing to int
    
   this.setmap(Maps.list[Maps.current]);//trust that CURRENT has been set as initial
  
   this.dragon = Crafty.e(Dragon.id).at(25, 25);//maybe hardcoded
   
     console.log('TODO ALL my hardcoded hud values from Game.vars');
  //Create a menu/HUD at the bottom of the screen with a button
  var menuBkg = Crafty.e("2D, DOM, Color");
      menuBkg.color('rgb(0,0,0)');
      menuBkg.attr({ w:HUD.width, h: HUD.height , x:0, y:0 });
  
  //fixes
  var X_SPACING = 9;
  var Y_SPACING = 1;
  
  var lblHealth = Crafty.e("MenuLabel");
      lblHealth.text('Health'); 
      lblHealth.attr({ x:menuBkg.x+X_SPACING, y:menuBkg.y+Y_SPACING });
      
   var hudHealth = Crafty.e("MenuData");
      hudHealth.text('0'); 
      hudHealth.attr({ x:menuBkg.x+8*X_SPACING, y:menuBkg.y+Y_SPACING }); 
      
   var lblAmmo = Crafty.e("MenuLabel");
      lblAmmo.text('Ammo'); 
      lblAmmo.attr({ x:menuBkg.x+12*X_SPACING, y:menuBkg.y+Y_SPACING });    
  
    var hudAmmo = Crafty.e("MenuData");
      hudAmmo.text('0'); 
      hudAmmo.attr({ x:menuBkg.x+20*X_SPACING, y:menuBkg.y+Y_SPACING }); 
    
    var lblCoins = Crafty.e("MenuLabel");
      lblCoins.text('Coins'); 
      lblCoins.attr({ x:menuBkg.x+28*X_SPACING, y:menuBkg.y+Y_SPACING });    
  
    var hudCoins = Crafty.e("MenuData");
      hudCoins.text('0'); 
      hudCoins.attr({ x:menuBkg.x+32*X_SPACING, y:menuBkg.y+Y_SPACING }); 
      
    var lblWeapon= Crafty.e("MenuLabel");
      lblWeapon.text('Gun'); 
      lblWeapon.attr({ x:menuBkg.x+64*X_SPACING, y:menuBkg.y+Y_SPACING });   
  
  this.bind('UpdateHUD', function() 
  {  
  //#TODO find a way to loop these?
    var p = Game.player || Crafty(Player.id);
    
    hudHealth.text(p.health);
    hudAmmo.text(p.ammo);
    hudCoins.text(p.coins);
    
    if(p.gun)
        lblWeapon.text(p.gun.name);
  
  });

  
  this._CoinCollect = this.bind('CoinCollect', function() 
  { 
    if (!Crafty(Coin.id).length) 
    { 
     Crafty.scene(SCENES.victory);
    }
    else
    { 
        console.log('TODO zombie randomizer');
      if(Math.random() < 0.5)
      {
         Crafty.e(Zombie.id).at(50,10);
      }  
       
      var coins_current =  Game.player.coins;// Crafty(Player.id).coins;
      
      if(coins_current > 0 && coins_current % 5 == 0)
      { 
        Crafty.e(Fairy.id).at(50, 5);
      } 
    }
  });
  
      this.bind('PlayerTookDamage',function(e)
      {
          //TODO deprec
      });
      
    this.show_failure = this.bind('Death',function(e)
    {
      Crafty.scene(SCENES.death);
    });
   
   //set initial hud
   Crafty.trigger('UpdateHUD');
    
}//end scene definition, first function
, function() 
{
//unbind some functions
console.log('scene.game unloading');
  this.unbind('CoinCollect', this._CoinCollect);
  
}//second function passed to scene
);//end Game scene
   
  //victory scene also takes two functions
Crafty.scene(SCENES.victory, function() 
{
  Crafty.e('2D, DOM, Text')
    .attr({ x: 0, y: 0 })
    .text('Victory!  Press ESC to play again.');
 
  this.restart_game = this.bind('KeyDown', function(e) 
  {
    if(e.key == Crafty.keys['ESC'])  Crafty.scene(SCENES.death);
  });
}, 
function() 
{
  this.unbind('KeyDown', this.restart_game);
});  
    
 
Crafty.scene(SCENES.death, function() 
{
  Crafty.e('2D, DOM, Text')
    .attr({ x: 0, y: 0 })
    .text('Death! Your health has hit zero!  Press ESC to play again.');
 
  this.restart_game = this.bind('KeyDown', function(e) 
  {
    if(e.key == Crafty.keys['ESC'])  Crafty.scene(SCENES.game);
  });
}, 
function() 
{
  this.unbind('KeyDown', this.restart_game);
});  
   
// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene(SCENES.loading, function()
{
  // Draw some text for the player to see in case the file
  //  takes a noticeable amount of time to load
  Crafty.e('2D, DOM, Text')
    .text('Loading...')
    .attr({ x: 0, y:  Game.height_px /2 - 24, w: Game.width_px })
    //.css($text_css)
    ;
  
	 //load all images
	 var assets = [];
	 assets.push(IMG.coin); 
	 assets.push(IMG.flame);
     assets.push(IMG.zombie);
     assets.push(IMG.dungeon_sheet);
     assets.push(IMG.opensheet_1);
	 //audio files
	 assets.push(AUDIO.coin);
	 assets.push(AUDIO.shoot);
     assets.push(AUDIO.fire);
 
     assets.push(AUDIO.leaves);
	 assets.push(AUDIO.reload);
     assets.push(AUDIO.fairy);
	 
	 assets.push(IMG.rocks );
	 assets.push(IMG.sword_1);
 
  Crafty.load(assets, function()
  { 
     var SHEET_RES = 16;
  	//after load action finishes, do this
    Crafty.sprite(SHEET_RES, IMG.coin, 
    {
      'spr_coin':    [0, 0]
    });
    Crafty.sprite(SHEET_RES, IMG.flame, 
    {
      'spr_flame':    [0, 0]
    });
    
    
    Crafty.sprite(SHEET_RES, IMG.zombie, 
    {
          'spr_zombie':    [0, 0]
    });
    
    
    
     Crafty.sprite(SHEET_RES, IMG.rocks, 
     { 
          spr_rock0:    [0, 0] 
         ,spr_rock1:    [0, 1] 
         ,spr_rock2:    [0, 2] 
         ,spr_rock3:    [0, 3] 
         ,spr_rock4:    [1, 0] 
         ,spr_rock5:    [1, 1] 
         ,spr_rock6:    [1, 2] 
         ,spr_rock7:    [1, 3] 
         ,spr_rock8:    [2, 0] 
         ,spr_rock9:    [2, 1] 
         ,spr_rock10:   [2, 2] 
         ,spr_rock11:   [2, 3] 
         ,spr_rock12:   [3, 3] 
         ,spr_rock13:   [3, 0] 
         ,spr_rock14:   [3, 1] 
         ,spr_rock15:   [3, 2] 
         
     } );
     
      
    Crafty.sprite(SHEET_RES, IMG.dungeon_sheet,  // dungeon16.png
     { 
          spr_wall_black:    [2, 0] 
         ,spr_wall_blue:     [3, 0] 
         ,spr_wall_green:    [4, 0] 
         ,spr_wall_bluelt:   [5, 0] 
         ,spr_wall_red:      [6, 0] 
         ,spr_wall_purp:     [7, 0] 
         ,spr_wall_brown:    [8, 0] 
         ,spr_wall_grey:     [9, 0] 
         ,spr_wall_greydk:  [10, 0] 
         ,spr_wall_yellow:  [16, 0] 
         ,spr_wall_white:   [17, 0] 
         ,spr_door:         [19, 0] 
         ,spr_lava:         [27, 0] 
         ,spr_water:        [28, 0] 
         ,spr_waterdk:      [29, 0] 
         
         ,spr_stair_1:      [3, 1] 
         
     } );
     Crafty.sprite(SHEET_RES, IMG.sword_1,//'opensource16_1.png'
     {
          sword_1 : [0,0]  
         //go to 16  
        
     });
     
     var open_count = 8; 
    
     Crafty.sprite(SHEET_RES,IMG.opensheet_1,//'opensource16_1.png'
     {
          spr_tree_0 : [0,0] 
         ,spr_tree_1 : [1,0]   
         ,spr_tree_2 : [2,0]   
         ,spr_tree_3 : [3,0] 
         //go to 16  
        
     });
    
    
    // Now that our sprites are ready to draw, start the game
     Crafty.scene(SCENES.game);
 
  })
});
   
   
