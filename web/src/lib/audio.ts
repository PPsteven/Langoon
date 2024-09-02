import { HowlOptions } from "howler";
import { addHowlListener } from "@/utils";
import { Howl } from "howler";
import { Dispatch } from "@/store";

export interface AudioOptions {
  url: string;
  sprite?: HowlOptions["sprite"];
  debug?: boolean;
  dispatch: Dispatch;
}

export type AudioState = {
  seek: number; // 当前播放位置
  duration: number; // 播放总时长
  percent: number; // 播放进度百分比
  status: "play" | "pause" | "loading"; // 播放状态
  err?: string; // 错误信息
};

export class AudioPlayer {
  url: string;
  debug: boolean = false;
  dispatch: Dispatch;
  sprite?: HowlOptions["sprite"];
  sound?: Howl;
  interval: number = 0;
  version: number;

  // state
  pos: number = 0;
  percent: number = 0;
  duration: number = 0;
  onstep?: (e: { seek: number; percent: number; duration: number }) => void;

  constructor(options: AudioOptions) {
    this.version = Date.now();
    this.sprite = options.sprite;
    this.url = options.url;
    this.debug = options.debug || false;
    this.dispatch = options.dispatch;
    this.sound = new Howl({
      src: [this.url],
      sprite: this.sprite,
      html5: true,
      preload: true, // Donwload file to improve performance true

      onload: () => {
        this.debug && console.log("onload");
        this.duration = this.sound?.duration() || 0;
        this.dispatch?.({ type: "load", payload: { duration: this.duration } });
      },
      onplay: () => {
        this.debug && console.log("onplay");
        this.resetInterval();
        this.dispatch?.({ type: "play" });
      },
      onpause: () => {
        this.debug && console.log("onpause");
        this.stopInterval();
        this.dispatch?.({ type: "pause" });
      },
      onloaderror: (id: number, error: any) => {
        this.debug && console.log("onloaderror");
      },
      onplayerror: (id: number, error: any) => {
        this.debug && console.log("onplayerror");
      },
    });
  }
  play() {
    this.sound?.play();
  }
  pause() {
    this.sound?.pause();
  }
  seek(seek: number) {
    this.dispatch({ type: "seek", payload: seek });
    this.stopInterval();
    this.sound?.seek(seek);
    this.resetInterval();
  }
  next() {}
  pre() {}

  resetInterval = () => {
    var self = this;
    self.stopInterval();
    self.interval = window.setInterval(() => {
      if (!self.sound) {
        return;
      }
      self.pos = self.sound.seek() || 0;
      self.percent = (self.pos / self.sound.duration()) * 100 || 0;
      self.dispatch({ type: "seek", payload: self.pos });
    }, 200);
  };

  stopInterval = () => {
    var self = this;
    this.interval && clearInterval(self.interval);
  };
}
