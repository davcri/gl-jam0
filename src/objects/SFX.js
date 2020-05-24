// https://github.com/Tonejs/Tone.js
import * as Tone from "tone";

export default class SFX {
  constructor(game) {
    // create a synth and connect it to the master output (your speakers)
    const synth = new Tone.Synth().toMaster();
    const synth2 = new Tone.Synth().toMaster();
    const synth3 = new Tone.Synth().toMaster();

    // play a middle 'C' for the duration of an 8th note
    // setInterval(() => {
    //   synth.triggerAttackRelease("C4", "8n");
    //   synth2.triggerAttackRelease("E4", "8n");
    //   synth3.triggerAttackRelease("B4", "8n");
    // }, 1000)
  }
}