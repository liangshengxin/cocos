// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CAction from "../../common/CAction";
import CAudio from "../../common/CAudio";
import GlobalGame from "../../global/GlobalGame";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HomeSelectLevel extends cc.Component {

    @property(cc.ScrollView)
    list: cc.ScrollView = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //可见区域宽度
        let { width } = cc.view.getVisibleSize();
        let childSize = 110; //子节点宽高
        let childCount = Math.floor((width - 50) / (childSize));
        let sum = 200;


        this.list.content.width = childCount * childSize;
        // this.list.content.height = sum/childCount*childSize;
        // this.list.content.getComponent(cc.Layout).spacingX=spacingXY;
        // this.list.content.getComponent(cc.Layout).spacingY=spacingXY;
        // alert(w)
    }

    start() {
        let item = this.list.content.getChildByName('item');
        for (let i = 0; i < 10; i++) {
            item = cc.instantiate(item);
            this.list.content.addChild(item)
            item.getChildByName('text').getComponent(cc.Label).string = String(i + 1)
        }
    }

    // update (dt) {}

    onPlayKeyTone() {
        CAudio.playKeyTone();
    }

    onPlayGame(event: cc.Event) {
        let node: cc.Node = event.target
        let level = node.getChildByName('text').getComponent(cc.Label).string;
        //设置关卡等级
        GlobalGame.setCurrentLevel(parseInt(level));
        CAction.onScene('game')

    }
}
