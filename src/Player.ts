export class Player {
  public betRequest(gameState: any, betCallback: (bet: number) => void): void {
    const myPlayer = gameState.players[gameState.in_action];
    if (gameState.current_buy_in > 600) {
      betCallback(0);
    } else {
      betCallback(gameState.current_buy_in - myPlayer["bet"] + 4);
    }
  }

  public showdown(gameState: any): void {}

  private areMyCardsOk(myPlayer: any): boolean {
    const myCards = myPlayer["hole_cards"];
    const value = 0;
    // switch(myCards)
    return true;
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
