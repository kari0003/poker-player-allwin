export class Player {
  public betRequest(gameState: any, betCallback: (bet: number) => void): void {
    if (gameState.current_buy_in > 500) {
      betCallback(0)
    } else {
      betCallback(gameState.current_buy_in - gameState.players[gameState.in_action]['bet'] + 1);
    }
  }

  public showdown(gameState: any): void {

  }
};

export default Player;
