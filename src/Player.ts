export class Player {
  public betRequest(gameState: any, betCallback: (bet: number) => void): void {
    const myPlayer = gameState.players[gameState.in_action];
    // if (gameState.current_buy_in > 600) {
    //   betCallback(0);
    // } else {
    const bet = myPlayer ? myPlayer["bet"] : 0;
    const raise = this.calculateRaise(gameState);
    if (raise < 0) {
      betCallback(0);
    } else {
      betCallback(
        gameState.current_buy_in - bet + raise
      );
    }
    // }
  }

  public showdown(gameState: any): void {}

  public calculateRaise(gameState: any): number {
    let raise = gameState.minimum_raise;
    const myPlayer = gameState.players[gameState.in_action];
    const myBet = this.calculateBet(myPlayer);
    if (!raise || raise < myBet) {
      raise = myBet;
    }
    if (raise > myPlayer.stack) {
      raise = myPlayer.stack;
    }
    if (gameState.bet_index > 0 && myBet === 1) {
      raise = 0;
    }
    return raise;
  }

  private calculateBet(myPlayer: Player): number {
    const communityCards = myPlayer["community_cards"] || [];
    const communityCardsValues: number[] = communityCards.map(this.cardToValue);
    const communityCardsValue = communityCardsValues.reduce(
      (val, curr) => val + curr,
      0
    );
    const communityCardsDiff = communityCardsValues.reduce(
      (val, curr) => val - curr,
      0
    );

    const myCards = myPlayer["hole_cards"];
    const value = this.cardToValue(myCards[0]) + this.cardToValue(myCards[1]);
    const diff = Math.abs(
      this.cardToValue(myCards[0]) - this.cardToValue(myCards[1])
    );

    const allValue = value + communityCardsValue;
    const alldiff = Math.abs(diff - communityCardsDiff);

    if (diff === 0) {
      return 50;
    }
    // if (value > 25) {
    //   return 42;
    // }
    if (value < 10) {
      return -1;
    }

    return 1;
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
}

export default Player;
