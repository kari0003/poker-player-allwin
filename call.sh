#!/bin/bash
curl -d 'action=bet_request&game_state={
  "players":[
    {
      "name":"Player 1",
      "stack":1000,
      "status":"active",
      "bet":0,
      "hole_cards":[],
      "version":"Version name 1",
      "id":0
    },
    {
      "name":"Player 2",
      "stack":1000,
      "status":"active",
      "bet":0,
      "hole_cards": [
              {
                  "rank": "3",
                  "suit": "spades"
              },
              {
                  "rank": "7",
                  "suit": "spades"
              }
          ],
      "version":"Version name 2",
      "id":1
    }
  ],
  "tournament_id":"550d1d68cd7bd10003000003",
  "game_id":"550da1cb2d909006e90004b1",
  "round":0,
  "bet_index":0,
  "small_blind":10,
  "orbits":0,
  "dealer":0,
  "community_cards":[
    {
        "rank": "Q",
        "suit": "spades"
    },
    {
        "rank": "10",
        "suit": "spades"
    },
    {
        "rank": "4",
        "suit": "spades"
    }
  ],
  "current_buy_in":0,
  "in_action": 1,
  "pot":0
}' http://localhost:1337
