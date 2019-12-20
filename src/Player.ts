export class Player {
  public betRequest(gameState: any, betCallback: (bet: number) => void): void {
    const myPlayer = gameState.players[gameState.in_action];
    // if (gameState.current_buy_in > 600) {
    //   betCallback(0);
    // } else {
    const bet = myPlayer ? myPlayer['bet'] : 0;
    const raise = this.calculateRaise(gameState);
    if (raise < 0) {
      betCallback(0);
    } else {
      betCallback(gameState.current_buy_in - bet + raise);
    }
    // }
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
    const communityCards = gameState['community_cards'] || [];
    const communityCardsValues: number[] = communityCards.map(this.cardToValue);
    const communityCardsValue = communityCardsValues.reduce(
      (val, curr) => val + curr,
      0
    );
    const communityCardsDiff = communityCardsValues.reduce(
      (val, curr) => val - curr,
      0
    );

    const myCards = myPlayer['hole_cards'] || [];
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
    } if (this.detectPoker(allCards) && !this.detectPoker(tableCards)) {
      return myPlayer.stack;
    } else if (this.detectDrill(allCards) && !this.detectDrill(tableCards)) {
      return 30;
    } else if (this.detectTwoPairs(allCards)) {
      return 30;
    } else if (diff === 0) {
      if (value >= 18 && gameState.minimum_raise <= myPlayer.stack) {
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

  private cardToValue(card: any): number {
    switch (card.rank) {
      case 'A':
        return 20;
      case 'K':
        return 15;
      case 'Q':
        return 14;
      case 'J':
        return 12;
      default:
        return parseInt(card.rank, 10);
    }
  }

  private detectTwoPairs(cards: number[]): boolean {
    const mapping = {};
    cards.forEach((card) => {
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
    cards.forEach((card) => {
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

  private cardSuit(card: any): number {
    switch (card.suite) {
      case 'spades':
        return 0;
      case 'hearts':
        return 1;
      case 'diamonds':
        return 2;
      case 'clubs':
        return 3;
    }
  }

  private orderCards(cards = []) {
    return cards.sort((a, b) => a - b);
  }
}

export default Player;
