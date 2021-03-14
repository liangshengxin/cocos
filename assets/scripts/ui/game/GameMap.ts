// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MazeDFS from "../../components/maze/MazeDFS";
import GlobalGame from "../../global/GlobalGame";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.SpriteFrame)
    wall: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    road: cc.SpriteFrame = null;

    @property(cc.Node)
    player: cc.Node = null;

    @property(cc.Node)
    exit: cc.Node = null;



    /**迷宫生成对象 */
    maze: MazeDFS = null;
    /**是否可以移动  */
    isMoving: boolean = false;
    /**通过触摸触摸位置获取方向  */
    movePoint: cc.Vec2 = null;

    onLoad() {
        //关卡
        let level = GlobalGame.getCurrentLevel();
        //初始化
        this.maze = new MazeDFS();
        this.maze.init({ width: level+4, height: level+4 });
        this.maze.generateMaze();
    }

    start() {
        //生成地图
        this.generateMaze();
        //设置角色和出口
        this.setPlayerAndExit();
        //移动
        this.moves()

    }

    /** 生成迷宫 */
    private generateMaze() {
        //获得可见尺寸宽高
        let { width, height } = cc.view.getVisibleSize();

        for (const points of this.maze.getMaze()) {
            for (const point of points) {
                //是墙则跳过
                if (point.wall) continue;
                //获取墙或路的节点
                let node = this.getWallRoadNode(point.wall);
                //在地图中添加
                this.node.addChild(node);
                //墙或路节点的宽高
                let nodeXY = 32;

                //地图大小（生成后的地图大小是原始大小x2的，此处获取的是原始大小）
                let mSize = this.maze.getSize();
                //默认00位置所在是中心点，所以此处减去地图一半的宽度，使其在中心
                let posX = point.x * nodeXY - (mSize.width - 1) * nodeXY;
                //获取的迷宫地图y轴是由上至下的，直接添加的是由下至上的，所以这里颠倒节点Y轴
                let posY = (mSize.height - 1) * nodeXY - point.y * nodeXY
                //设置位置
                node.setPosition(posX, posY);

                //放大路
                if (!point.wall) node.scale = 1.7;
            }
        }
    }

    /**设置用户角色和出口 */
    private setPlayerAndExit() {
        let { enter, exit } = this.maze.getEnterAndExitPoint();
        //地图大小（生成后的地图大小是原始大小x2的，此处获取的是原始大小）
        let mSize = this.maze.getSize();
        let enPoint = { x: enter.x * 32 - (mSize.width - 1) * 32, y: (mSize.height - 1) * 32 - enter.y * 32 }
        let exPoint = { x: exit.x * 32 - (mSize.width - 1) * 32, y: (mSize.height - 1) * 32 - exit.y * 32 }
        this.player.setPosition(cc.v2(enPoint));
        this.exit.setPosition(cc.v2(exPoint));
    }

    /** false路 true墙 */
    private getWallRoadNode(type: true | false) {
        let node = new cc.Node();
        if (type) {
            node.addComponent(cc.Sprite).spriteFrame = this.wall;
        } else {
            node.addComponent(cc.Sprite).spriteFrame = this.road;
        }
        return node;
    }

    private moves() {
        this.node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.movePoint = event.getLocation();
            cc.log('???')
        })
        this.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            //正在移动
            if (this.isMoving) return;
            this.isMoving = true;

            let stepData = [];
            let tween = cc.tween(this.player)

            let dir = event.getLocation().sub(this.movePoint);
            if (Math.abs(dir.x) > Math.abs(dir.y)) {
                if (dir.x > 0) {
                    cc.log('右')
                    stepData = this.maze.getMoveStepData(this.maze.getMoveCurrentPos(), 'right')

                } else {
                    cc.log('左')
                    stepData = this.maze.getMoveStepData(this.maze.getMoveCurrentPos(), 'left')

                }
            } else {
                if (dir.y > 0) {
                    cc.log('上')
                    stepData = this.maze.getMoveStepData(this.maze.getMoveCurrentPos(), 'up')

                } else {
                    cc.log('下')
                    stepData = this.maze.getMoveStepData(this.maze.getMoveCurrentPos(), 'down')

                }
            }
    
            //执行动画
            if (stepData.length > 0) {
                //开始
                tween.call(() => {
                    // this.hideDirection();
                })
                //运行路线
                for (const iterator of stepData) {
                    tween.by(0.2, { x: iterator.xStep * 32, y: -iterator.yStep * 32 })
                }
                //结束
                tween.call(() => {
                    let { exit } = this.maze.getEnterAndExitPoint();
                    if (this.maze.getMoveCurrentPos() == exit) {
                        cc.log('过关')
                    } else {
                        // this.showDirection(this.maze)
                    }
                    //结束移动
                    this.isMoving = false;
                })
                tween.start();
            } else {
                //结束移动
                this.isMoving = false;
            }

        })
    }

    // update (dt) {}
}
