// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CAction from "../../common/CAction";
import CAudio from "../../common/CAudio";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HomeUI extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }


    // update (dt) {}


    //打开关卡列表
    onOptionSimple(event:cc.Event){
        CAudio.playKeyTone();
        CAction.onOpenLayer('SelectLevel');
    }

    //打开菜单
    onMenu(){
        CAudio.playKeyTone();
        CAction.onOpenLayer('Menu');
    }
}
