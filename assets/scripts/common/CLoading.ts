// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { getNumberToZero } from "../components/Utils";
import CAudio from "./CAudio";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CLoading extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let loadingNode = cc.find('Canvas').getChildByName("LoadingMask");
        loadingNode.active=true;
        cc.find("Canvas/Content").active = false;

        // let progress = loadingNode.getChildByName("ProgressBar").getComponent(cc.ProgressBar);
        let progressLabel = loadingNode.getChildByName("loadingLabel").getComponent(cc.Label);
        cc.resources.preloadDir('/', (finish: number, total: number, item: cc.AssetManager.RequestItem) => {
            progressLabel.string = getNumberToZero(finish) + ' / ' + getNumberToZero(total);
            if (finish == total) {
                this.onLoadComplete();
            }
        }, () => { })


    }
    onLoadComplete() {
        cc.director.preloadScene('game', (c, t, i) => {
        })
        let enter = cc.find("Canvas/LoadingMask/enter");

        enter.opacity = 255;

        //开始
        enter.once(cc.Node.EventType.TOUCH_END, () => {
            cc.find("Canvas/Content").active = true;

            let loadingNode = cc.find('Canvas').getChildByName("LoadingMask");
            cc.tween(loadingNode).to(0.2, { scale: 0 }, { easing: "backIn" }).start();

            CAudio.init();

        })


    }

    start() {

    }

    update(dt) {

    }
}
