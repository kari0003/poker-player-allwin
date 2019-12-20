export class Player {
  public betRequest(gameState: any, betCallback: (bet: number) => void): void {
    const myPlayer = gameState.players[gameState.in_action];
    if (gameState.current_buy_in > 600) {
      betCallback(0);
    } else {
      const bet = myPlayer ? myPlayer["bet"] : 0;
      betCallback(gameState.current_buy_in - bet + this.calculateRaise(gameState));
    }
  }

  public showdown(gameState: any): void {}

  public calculateRaise(gameState: any): number {
    let raise = gameState.minimum_raise;
    if (!raise || raise < 50) {
      raise = 50;
    }
    return raise;
  }

  // private calculateBet(myPlayer: any): number {
  //   const myCards = myPlayer["hole_cards"];
  //   const communityCards = myPlayer["community_cards"];
  //   const communityCardsValues = communityCards.map(this.cardToValue);
  //   const value = this.cardToValue(myCards[0]) + this.cardToValue(myCards[1]);
  //   const diff = Math.abs(this.cardToValue(myCards[0]) - this.cardToValue(myCards[1]));

  //   if (diff <=1) {
  //     return 50;
  //   }
    
  //   return 10;
  // }

  // private cardToValue(card: any): number {
  //   switch (card.rank) {
  //     case "A":
  //       return 20;
  //     case "K":
  //       return 15;
  //     case "Q":
  //       return 14;
  //     case "J":
  //       return 12;
  //     default:
  //       return parseInt(card.rank, 10);
  //   }
  // }
}

export default Player;
