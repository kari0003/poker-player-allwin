export class Player {
  public betRequest(any: any, betCallback: (bet: number) => void): void {
    const myPlayer = any.players[any.in_action];
    // if (any.current_buy_in > 600) {
    //   betCallback(0);
    // } else {
    const bet = myPlayer ? myPlayer["bet"] : 0;
    betCallback(any.current_buy_in - bet + this.calculateRaise(any));
    // }
  }

  public showdown(any: any): void {}

  public calculateRaise(any: any): number {
    let raise = any.minimum_raise;
    const myPlayer = any.players[any.in_action];
    const myBet = this.calculateBet(myPlayer);
    if (!raise || raise < myBet) {
      raise = myBet;
    }
    if (raise > myPlayer.stack) {
      raise = myPlayer.stack;
    }
    return raise;
  }

  private calculateBet(myPlayer: any): number {
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

    if (diff <= 1) {
      return 50;
    }
    // if (value > )

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
