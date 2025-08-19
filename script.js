let jatekos_nev = 'jatekos';
let jatekos_pontszam = 0;
// hány darab téglalap legyen letéve a játékmezőre függőlegesen
let N1 = 6;
// hány darab téglalap legyen letéve a játékmezőre vízszintesen
let N2 = 10;

// jatekterulet
let sobics_game_area;
// jatekterulet szelessege, hosszusaga
let ga_width, ga_height;

let start_ey = 100;
// a megjelenitendo ellenseg vég ys koordinataja
let end_ey = 500;
// megjelenitendo ellenseg szama
let enemy_num = 10;
// az ellenseg szelessege
let offset_x = (end_ey - start_ey) / enemy_num;

// sobics karakter
let character;
// a karakter szelessege, magassaga
let def_width = offset_x + 20, def_height;
// a karakter elmozdulasanak merteke
let move_step = def_width;

let mouse_pos_x = 0; 
let block;

let moving_block = $('<div class="blokk"></div>');

$(document).ready(function () //ez egy MAIN függvénynek felel meg, tehát itt kezdődik a program futása
{ 	
    $("#start_button").on("click", function () 
    {
        if(name != null || name != '') // ha nem üres a név akkor átadja neki a nevet amit megadunk
        {
            jatekos_nev=document.getElementById("name").value;
        }

        $("#start_field").hide();

        timer();

        sobics_game_area = $('#sobicsgamearea');
        character = $('<img src="sobics.png" id="character">'); 

        // hozzáadom a játéktérhez a karakterem
        sobics_game_area.append(character);
        // a jatekter szelessegenek lekerdezese
        ga_width = parseInt(sobics_game_area.css('width'));
        // a jatekter magassaganak lekerdezese
        ga_height = parseInt(sobics_game_area.css('height'));

        // ha mar elerheto a kep, akkor rajzolja ki a karaktert
        character.on('load', function () {
            init_character();                                       
        });

        // esemenykezeles gomblenyomasra
        $(window).on('keydown', move_character);                    
    
        // esemenykezeles egermozgasra a jatekteren belul
        sobics_game_area.on('mousemove', mousemove_character);

        random_color(); 

        // a leszedett téglalapot mozgatja
        sobics_game_area.on('mousemove', mousemove_block);      

    });
});

// fuggveny a karakter parametereinek lekeresere, beallitasara
function init_character() {
    // a karakter szelessegenek beallitasa
    character.css({
        width: def_width,
    });

    // a karakter magassaga
    def_height = parseInt(character.css('height'));

    // az karakter y poziciojanak beallitasa
    character.css({
        top: ga_height - def_height,
    });
}

// ez a függvény a billentyűzet lenyomását nézi
function move_character(ev) {      
    // lenyomott billentyu
    let pressed_key = ev.key;
    // ha a lenyomott billentyu a jobbra nyil
    if (pressed_key === 'ArrowRight') {
        // annak vizsgalata, hogy a jatekteren belul vagyunk-e meg
        if (parseInt(character.css('left')) + def_width < ga_width) {
            character.animate({
                left: '+=' + move_step
            }, 1) // az 1-al 1 milisec
            moving_block.animate({
                left: '+=' + move_step
            }, 1)
        } else {
            character.animate({
                left: ga_width - def_width
            }, 1)
            moving_block.animate({
                left: ga_width - def_width
            }, 1)
        }
        // ha a lenyomott billentyu a balra nyil
    } else if (pressed_key === 'ArrowLeft') {
        // annak vizsgalata, hogy a jatekteren belul vagyunk-e meg
        if (parseInt(character.css('left')) - move_step > 0) 
            {
            character.animate({
                left: '-=' + move_step
            }, 1)
            moving_block.animate({
                left: '-=' + move_step
            }, 1)
            } 
            else {
            character.animate({
                left: 0
            }, 1)
            moving_block.animate({
                left: 0
            }, 1)
        }
    }
}

function mousemove_character(e) {               
    let div_pos = sobics_game_area.offset();
    let mouse_pos_x = Math.ceil(e.clientX - div_pos.left - move_step);

    if (mouse_pos_x > 0 && mouse_pos_x < ga_width - def_width) {
        character.css({
            left: mouse_pos_x,
        });
    }
}

// ez a fügvény konkrétan azt számolja ki, hogy a blokk együtt mozogjon a karakterrel
function mousemove_block(e) {
    let div_pos = sobics_game_area.offset();        // az offset függvény ami kiszámítja egy elem távolságát a bal felső saroktól
    let mouse_pos_x = Math.ceil(e.clientX - div_pos.left - move_step); // Math.ceil: a benne lévő értéket felfelé kerekíti

    if (mouse_pos_x > 0 && mouse_pos_x < ga_width - def_width) {  
        moving_block.css({
            left: mouse_pos_x,
        });
    }
}

function random_color()
{
    for (let i = 0; i < N1; i++) 
    {
        for (let j = 0; j < N2; j++)
        {
            let block = $('<div class="blokk"></div>');
            let szin=Math.random();

            if (szin > 0 && szin <=0.25)
            {
                block.addClass('citrom');
            }
            else if (szin > 0.25 && szin <=0.5)
            {
                block.addClass('narancs');
            }
            else if (szin > 0.5 && szin <=0.75)
            {
                block.addClass('piros');
            }
            else if (szin > 0.75)
            {
                block.addClass('vilagoskek');
            }
        
            block.css({         // blokk méretei
                width: 60,
                height: 30,
                top: i * 30,
                left: j * 60
            });

            block.appendTo(sobics_game_area);
        }
    }
}

function WhichButton(event)
{
    let legkozelebb_top = 900000;
    let legkozelebb_left = 900000;
    let x_position;
    let kozepso_legkozelebb=900000;
    let position_character = $('#character').position();
    let kozepso_legkozelebb_x;
    let kozepso_legkozelebb_y;
    let kozepso_legkozelebb_top=0;
    let leszedem_legnagyobb_y=0;


    switch (event.button) //itt minden a blokkokra vonatkozik egér lenyomásra
    {
        case 0:                                    //bal gomb, azaz a blokk lekérése
            $(".blokk").each(function() {
                let position_block = $(this).position();
                let aktualis_tavolsag_left = position_character.left - position_block.left;
                
                if(legkozelebb_left >= Math.abs(aktualis_tavolsag_left))
                {
                    legkozelebb_left = Math.abs(aktualis_tavolsag_left);
                    x_position = position_block.left;    // a karakteremhez legközelebbi
                } 
            });

            $(".blokk").each(function() {
                let position_block = $(this).position();

                if(x_position == position_block.left)
                {
                    if(leszedem_legnagyobb_y < position_block.top)
                    {
                        leszedem_legnagyobb_y = position_block.top;
                    }
                }
            });
            
            $(".blokk").each(function() {
                let position_block2 = $(this).position();
                
                if(position_block2.top == leszedem_legnagyobb_y && position_block2.left == x_position)             
                {
                    moving_block = $(this);
                     $(this).animate({
                        top: position_character.top - 30,
                        left: position_character.left
                     });
                }

            });
            break;
        
        case 2:                                             // egéren lévő jobb gomb, azaz a blokk visszaküldése
            moving_block.top=position_character.top - 30;
            moving_block.left=position_character.left;

           $(".blokk").each(function() {                    // végigmegyünk minden blokkon
                let position_block = $(this).position();
                let aktualis_tavolsag_left = position_character.left - position_block.left; 
                
                // először a left érték kell, mert az fontosabb
                if(kozepso_legkozelebb >= Math.abs(aktualis_tavolsag_left) && position_block.top != moving_block.top)
                {
                    kozepso_legkozelebb = Math.abs(aktualis_tavolsag_left);
                    kozepso_legkozelebb_x = position_block.left;
                }
            });

            $(".blokk").each(function() {
                let position_block = $(this).position();

                // itt pedig a top értéket választjuk ki
                if(kozepso_legkozelebb_x == position_block.left && position_block.top != moving_block.top)
                {
                    if(kozepso_legkozelebb_top <= position_block.top)
                    {
                        kozepso_legkozelebb_top = position_block.top;
                        kozepso_legkozelebb_y = position_block.top;
                    }
                }
            });

            $(".blokk").each(function() {
                let position_block = $(this).position();
                
                if((position_block.left == kozepso_legkozelebb_x) && (position_block.top == kozepso_legkozelebb_y))             
                {
                     moving_block.animate({
                        top: position_block.top + 30,
                        left: position_block.left
                     });
                }

            });
            
            moving_block = $('<div class="blokk"></div>');      // konkrétan a blokk itt kerül elhelyezésre
            same_color_blocks_get_delete()                       // ide kell a függvényhívás, hisz mindig akkor akarjuk csekkolni, hogy vannak-e tömbök egymás mellet, mikor 
            break;                                              // egy tömböt vissza küldünk a többi közé
    }
}

// blokkok törlése ha minimum 6 van egymás mellett
function same_color_blocks_get_delete()
{
    // az utoljára felküldött blokkra nézem meg, hogy van-e mellette ugyan olyan színű blokk. Ezt úgy valósítom meg, hogy az aktuális poziciót lekérem és ahhoz
    // képest nézem meg, hogy milyen színek vannak. Minimum még 5 színt kell találni. 

    let moving_pos = moving_block.position();
    let cycle_position=0;
    let actual_i=0;
    let actual_j=0;

    // Itt megkapjuk, hogy hanyadik pozicióban van az a blokk, amelyet felkültünk (konkrétan hanyadik helyen van, pl.: 23. helyen)
    for (let i = 0; i < 10; i++) // sor 
    {
        for (let j = 0; j < 6; j++) // oszlop
        {
            let actual_cycle_position = i * 6 + j; // j itt az oszlop, tehát a szorzás jön az oszlopok számával
            let blokk_pos = $(".blokk").eq(actual_cycle_position).position();
            
            // Objektumokat nem lehet '==' - el összehasonlítani
            if (blokk_pos.top === moving_pos.top && blokk_pos.left === moving_pos.left) 
            {
                actual_i = i;
                actual_j = j;
            }
        }  
    }
    // Most az jön, hogy elkezdünk vissza lépkedni, hány meg mennyi van egymás felett


}

// az időzítő 60 másodpercről számol visszafele, majd egy olyan szöveget kell majd ki íratni, ami csak annyit mutat, hogy vége a játéknak
function timer()
{
    var counter = 60;
        var interval = setInterval(function() {
            counter--;
            if (counter <= 0) {
                clearInterval(interval);
            $('#timer').html("<h3>Vége a játéknak</h3>");
            location.reload();
            return;
            }else{
                $('#time').text(counter);
                console.log("Timer --> " + counter);
                }
        }, 1000);
}