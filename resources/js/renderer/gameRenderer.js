class GameRenderer {
    renderPlayer(player) {

    }

    drawGameStart(game) {
        this._drawPlayers(game.players, game.currentPlayerId)
        // TODO: draw card count
    }

    _drawPlayers(players, currentPlayerId) {


    }

    _getPlayerTemplate(player, isCurrentPlayer) {
        let currentPlayerClass = isCurrentPlayer ? 'player-active' : '';
        return `
            <div class="player" data-client-id="${player.id}">
                <div class="nickname"><p>${player.nickname}</p></div>
                <div class="hp-bar" data-rendered-hp="${player.health}">${this._renderHP(player.health)}</div> <!-- -->
                <div class="portait-wrap">
                    <img class="portait ${currentPlayerClass}" src="">
                    <div class="weapon-wrap">
                        <img class="weapon" data-weapon="${player.weapon.type}" src="${this.getCardImagePath(player.weapon.suit, player.weapon.rank, player.weapon.type, true)}">
                    </div>
                    <div class="card-counter-wrap"><div class="card-counter"><p>{cardsCount}</p></div></div>
                    <div class="range-tracker-wrap">
                        <div class="range-tracker">
                            <p class="attack-range">4</p>
                            <p class="defense-range">3</p>
                        </div>
                    </div>
                    {isSheriff} <!--<div class="badge-wrap"><img class="badge" src="./resources/images/roles/sheriff.png" alt=""></div>-->
                </div>
                <div class="buff-list"></div>
            </div>
        `;
    }



    getCardImagePath(suit, rank, type, isCropped) {
        let path = isCropped ? 'cropped': 'full';
        return `./resources/cards/${path}/${type}-${rank}-${suit}.png`;
    }

    getHeroImagePath(type, isCropped) {
        let path = isCropped ? 'cropped': 'full';
        return `./resources/heroes/${path}/${type}.png`;
    }

    _renderHP(hp) {
        let html = '';
        for (let i = 0; i < hp; ++i) {
            html += '<div class="hp"></div>';
        }

        return html;
    }
}


let example = {
   "success":true,
   "type":"game.onStart",
   "response":{
      "gameId":"O0oyziRwDSxeLV8A",
      "currentPlayerId":"xeRAAm9Q84GcxoEa",
      "players":[
         {
            "id":"xeRAAm9Q84GcxoEa",
            "hp":5,
            "buffs":[

            ],
            "hero":{
               "name":"Бедствие Жанет",
               "type":1,
               "hp":4
            },
            "weapon":{
               "name":"Кольт .45",
               "suit":1,
               "rank":1,
               "type":2,
               "range":1
            },
            "cardsCount":5,
            "nickname":"asdf",
            "isSheriff":true,
            "role":0,
            "cards":[
               {
                  "name":"Тюрьма",
                  "suit":3,
                  "rank":10,
                  "type":1,
                  "buffType":0
               },
               {
                  "name":"Скофилд",
                  "suit":3,
                  "rank":"K",
                  "type":2,
                  "range":2
               },
               {
                  "name":"Мустанг",
                  "suit":2,
                  "rank":8,
                  "type":1,
                  "buffType":3
               },
               {
                  "name":"Бах!",
                  "suit":0,
                  "rank":8,
                  "type":0,
                  "actionType":0
               },
               {
                  "name":"Пиво",
                  "suit":2,
                  "rank":6,
                  "type":0,
                  "actionType":10
               }
            ]
         },
         {
            "id":"FhEQDfYvmPirIuRK",
            "hp":4,
            "buffs":[

            ],
            "hero":{
               "name":"Блэк Джек",
               "type":2,
               "hp":4
            },
            "weapon":{
               "name":"Кольт .45",
               "suit":1,
               "rank":1,
               "type":2,
               "range":1
            },
            "cardsCount":4,
            "nickname":"dsfg",
            "isSheriff":false
         },
         {
            "id":"eNZtX0RxTgBnsUFX",
            "hp":4,
            "buffs":[

            ],
            "hero":{
               "name":"Киллер Слэб",
               "type":0,
               "hp":4
            },
            "weapon":{
               "name":"Кольт .45",
               "suit":1,
               "rank":1,
               "type":2,
               "range":1
            },
            "cardsCount":4,
            "nickname":"hgfd",
            "isSheriff":false
         },
         {
            "id":"xTTk3A560SxAlHg7",
            "hp":4,
            "buffs":[

            ],
            "hero":{
               "name":"Сэм Стервятник",
               "type":3,
               "hp":4
            },
            "weapon":{
               "name":"Кольт .45",
               "suit":1,
               "rank":1,
               "type":2,
               "range":1
            },
            "cardsCount":4,
            "nickname":"dfhg",
            "isSheriff":false
         }
      ]
   }
}