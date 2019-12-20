export class Player {
  public betRequest(gameState: any, betCallback: (bet: number) => void): void {
    const myPlayer = gameState.players[gameState.in_action];
    if (gameState.current_buy_in > 600) {
      betCallback(0);
    } else {
      betCallback(gameState.current_buy_in - myPlayer["bet"] + 50);
    }
  }

  public showdown(gameState: any): void {}
}

export default Player;
