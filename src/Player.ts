export class Player {
  public betRequest(gameState: any, betCallback: (bet: number) => void): void {
    const myPlayer = gameState.players[gameState.in_action];
    const bet = myPlayer ? myPlayer["bet"] : 0;
    const raise = this.calculateRaise(gameState);
    if (gameState.round === 0 && gameState.bet_index === 0) {
      let begin = raise;
      const blind = gameState.small_blind || gameState.big_blind;
      if (raise < blind) {
        begin = blind;
      }
      betCallback(begin);
    } else if (raise < 0) {
      betCallback(0);
    } else {
      betCallback(gameState.current_buy_in - bet + raise);
    }
  }

  public showdown(gameState: any): void {}

  public calculateRaise(gameState: any): number {
    const minRaise = gameState.minimum_raise;
    const myPlayer = gameState.players[gameState.in_action];
    const myBet = this.calculateBet(myPlayer, gameState);
    if (minRaise && myBet > 0 && minRaise > myBet) {
      return minRaise;
    } else {
      return myBet;
    }
  }

  private calculateBet(myPlayer: any, gameState: any): number {
    const communityCards = gameState["community_cards"] || [];
    const communityCardsValues: number[] = communityCards.map(this.cardToValue);
    const communityCardsValue = communityCardsValues.reduce(
      (val, curr) => val + curr,
      0
    );
    const communityCardsDiff = communityCardsValues.reduce(
      (val, curr) => val - curr,
      0
    );

    const myCards = myPlayer["hole_cards"] || [];
    const myCardsValue = myCards.map(this.cardToValue);
    const allCards = this.orderCards([
      ...communityCardsValues,
      ...myCardsValue
    ]);
    const tableCards = this.orderCards(communityCardsValues);

    const value = this.cardToValue(myCards[0]) + this.cardToValue(myCards[1]);
    const diff = Math.abs(
      this.cardToValue(myCards[0]) - this.cardToValue(myCards[1])
    );

    const allValue = value + communityCardsValue;
    const alldiff = Math.abs(diff - communityCardsDiff);

    if (this.detectFullHouse(allCards) && !this.detectFullHouse(tableCards)) {
      return myPlayer.stack;
    }
    if (this.detectPoker(allCards) && !this.detectPoker(tableCards)) {
      return myPlayer.stack;
    } else if (this.detectFlush([...communityCards, ...myCards])) {
      return 50;
    } else if (
      this.detectNumberSeries(allCards) &&
      !this.detectNumberSeries(tableCards)
    ) {
      return 30;
    } else if (this.detectDrill(allCards) && !this.detectDrill(tableCards)) {
      return 30;
    } else if (this.detectTwoPairs(allCards)) {
      if (value < 24 && this.tooHighBet(gameState, myPlayer)) {
        return -1;
      }
      if (diff === 0) {
        if (value >= 18 && gameState.minimum_raise <= myPlayer.stack) {
          return 30;
        } else {
          return 0;
        }
      } else {
        return 30;
      }
    } else if (diff === 0) {
      if (
        allCards.length === 2 &&
        value < 24 &&
        this.tooHighBet(gameState, myPlayer)
      ) {
        return -1;
      }
      if (
        value >= 18 &&
        gameState.minimum_raise <= myPlayer.stack &&
        allCards.length < 7
      ) {
        return 1;
      } else {
        return 0;
      }
    } else if (value > 25 && gameState.pot <= myPlayer.stack) {
      return 0;
    } else {
      return -1;
    }
  }

  private tooHighBet(gameState: any, myPlayer: any): boolean {
    return (
      gameState.minimum_raise > myPlayer.stack / 2 ||
      gameState.minimum_raise > 50 ||
      gameState.pot > 1500
    );
  }

  private shouldFold(
    bets: number[],
    allCards: number[],
    tableCards: number[],
    communityCards: number[],
    myCards: number[],
    myStack: number
  ): boolean {
    const maxBet = Math.max(...bets);
    if (
      maxBet > (myStack / 3) * 2 &&
      !(this.detectFullHouse(allCards) && !this.detectFullHouse(tableCards)) &&
      !(this.detectPoker(allCards) && !this.detectPoker(tableCards)) &&
      !this.detectFlush([...communityCards, ...myCards])
    ) {
      return true;
    }
    return false;
  }

  private bleoff(gameState: any): boolean {
    const player = gameState.players.find(p => p.name === "player");
    if (gameState.round === 3 && player.status === "player") {
      if (Math.random() < 0.6) {
        return true;
      }
    }
    return false;
  }

  private handleAllIn(
    players: any,
    bets: number[],
    limit: number,
    allCards: number[],
    tableCards: number[],
    community_cards: number[],
    myCards: number[]
  ): boolean {
    const player = players.find(p => p.name === "player");
    const maxBet = Math.max(...bets);
    if (
      player.status === "active" &&
      maxBet > limit &&
      !this.hasGoodStuff(allCards, tableCards, community_cards, myCards)
    ) {
      return false;
    }
    return true;
  }

  private hasGoodStuff(
    allCards: number[],
    tableCards: number[],
    communityCards: number[],
    myCards: number[]
  ) {
    if (
      (this.detectFullHouse(allCards) && !this.detectFullHouse(tableCards)) ||
      (this.detectPoker(allCards) && !this.detectPoker(tableCards)) ||
      this.detectFlush([...communityCards, ...myCards])
    ) {
      return true;
    }
    return false;
  }

  private cardToValue(card: any): number {
    switch (card.rank) {
      case "A":
        return 20;
      case "K":
        return 15;
      case "Q":
        return 14;
      case "J":
        return 12;
      default:
        return parseInt(card.rank, 10);
    }
  }

  private detectTwoPairs(cards: number[]): boolean {
    const mapping = {};
    cards.forEach(card => {
      mapping[card] = mapping[card] ? mapping[card] + 1 : 1;
    });
    let found = 0;
    for (var x in mapping) {
      if (mapping[x] >= 2) {
        found++;
      }
    }
    return found >= 2;
  }

  private detectDrill(cards: number[]): boolean {
    const mapping = {};
    cards.forEach(card => {
      mapping[card] = mapping[card] ? mapping[card] + 1 : 1;
    });
    let found = false;
    for (var x in mapping) {
      if (mapping[x] >= 3) {
        found = true;
      }
    }
    return found;
  }

  private detectFullHouse(cards: number[]): boolean {
    let double = false;
    let triple = false;
    let tripleValue = 0;
    cards.forEach((card, index) => {
      if (cards[index + 1] && card === cards[index + 1]) {
        if (!tripleValue && cards[index + 2] && cards[index + 2] == card) {
          tripleValue = card;
          triple = true;
        } else if (card !== tripleValue) {
          double = true;
        }
      }
    });
    return double && triple;
  }

  private detectPoker(cards: number[]): boolean {
    cards.forEach((card, index) => {
      if (
        cards[index + 1] &&
        cards[index + 2] &&
        cards[index + 3] &&
        card === cards[index + 1] &&
        card === cards[index + 2] &&
        card === cards[index + 3]
      ) {
        return true;
      }
    });
    return false;
  }

  private detectNumberSeries(cards: number[]): boolean {
    let hasSeries = false;
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    const unique = cards.filter(onlyUnique);
    unique.forEach((card, index) => {
      if (
        cards[index + 1] &&
        cards[index + 2] &&
        cards[index + 3] &&
        cards[index + 4]
      ) {
        if (
          card === cards[index + 1] - 1 &&
          card === cards[index + 2] - 2 &&
          card === cards[index + 3] - 3 &&
          card === cards[index + 4] - 4
        ) {
          hasSeries = true;
        }
      }
    });
    return hasSeries;
  }

  private detectFlush(cardsWithSuite = []) {
    const cards = this.orderCards(cardsWithSuite.map(this.cardSuit));
    const mapping = {};
    cards.forEach(card => {
      mapping[card] = mapping[card] ? mapping[card] + 1 : 1;
    });
    let found = false;
    for (var x in mapping) {
      if (mapping[x] >= 5) {
        found = true;
      }
    }
    return found;
  }

  private cardSuit(card: any): number {
    switch (card.suit) {
      case "spades":
        return 0;
      case "hearts":
        return 1;
      case "diamonds":
        return 2;
      case "clubs":
        return 3;
    }
  }

  private orderCards(cards = []) {
    return cards.sort((a, b) => a - b);
  }
}

export default Player;
