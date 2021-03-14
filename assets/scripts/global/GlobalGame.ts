/** 游戏数据 */
class GlobalGame {
    private currentLevel: number;

    /** 设置当前关卡等级 */
    public setCurrentLevel(currentLevel: number): void {
        this.currentLevel = currentLevel;
    }
    /** 获取当前关卡等级 */
    public getCurrentLevel() {
        return this.currentLevel;
    }
}

export default new GlobalGame;
