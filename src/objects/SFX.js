// https://github.com/Tonejs/Tone.js
import * as Tone from 'tone'

export default class SFX {
  constructor() {    
    this.baseSynth = new Tone.Synth().toMaster()
    this.pluclSynth = new Tone.PluckSynth().toMaster()
    this.membraneSynth = new Tone.MembraneSynth().toMaster()
    this.synthA = this.makeSynthA()
    this.synthB = this.makeSynthB()
    this.polySynth = this.makePolysynth()
    this.noise = new Tone.Noise('brown').start()
    
    // step audio
    this.stepAudio = new Tone.NoiseSynth('brown')
      .chain(new Tone.Volume(-20), Tone.Master)

    // current synth
    this.synth = this.synthB

    Tone.Transport.bpm.value = 120 // 120bpm is default

    // this.demoFilters()
    // this.demo3()
    // this.demo5Effects()
    // this.demo4Synths()
  }

  kick() {
    this.membraneSynth.triggerAttackRelease('c1')
  }

  startGame() {
    const autoFilter = new Tone.AutoFilter({
      "frequency" : "8m",
      "min" : 800,
      "max" : 15000
    });
    const vol = new Tone.Volume(-20)
    this.noise.connect(autoFilter)
    this.noise.chain(autoFilter, vol, Tone.Master)
    autoFilter.start()
    
    this.polySynth.triggerAttackRelease(['C4', 'E4', 'G4', 'B4'], '0.1')
  }

  buttonPress() {
  }

  buttonRelease() {
  }

  battleStarted() {
  }

  step() {
    // this.polySynth.triggerAttackRelease(['C4', 'E4', 'G4', 'B4'], '0.1')
    this.stepAudio.triggerAttackRelease(0.01 + 0.1*Math.random())
  }

  makePolysynth() {
    return new Tone.PolySynth(4, Tone.Synth).toMaster()
  }

  makePolysynthEffects() {
    const distortion = new Tone.Distortion(0.7)
    const tremolo = new Tone.Tremolo().start()
    const s = new Tone.PolySynth(4, Tone.Synth)
    return s.chain(distortion, tremolo, Tone.Master)
  }

  makeSynthA() {
    return new Tone.Synth({
      oscillator: {
        type: 'fmsquare',
        modulationType: 'sawtooth',
        modulationIndex: 3,
        harmonicity: 3.4
      },
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0.1,
        release: 0.1
      }
    }).toMaster()
  }

  makeSynthB() {
    return new Tone.Synth({
      oscillator: {
        type: 'triangle8'
      },
      envelope: {
        attack: 0.2,
        decay: 1,
        sustain: 1.3,
        release: 2
      }
    }).toMaster()
  }

  demo0() {
    // play a middle 'C' for the duration of an 8th note
    // synth.triggerAttackRelease("C4", "4n", '1m');
    // synth.triggerAttackRelease("E4", "8n", '2m');
    setInterval(() => {
      this.pluckSynth.triggerAttackRelease("B4", "16n");
    }, 1000)
  }

  demo1() {
    const loop = new Tone.Loop((time) => {
      this.synth.triggerAttackRelease("C3", "8n", time)
    }, "4n")
    loop.start(0).stop('2m')
    Tone.Transport.toggle()
  }

  demo2() {
    //this function is called right before the scheduled time
    function triggerSynth(time) {
      //the time is the sample-accurate time of the event)
      // synth.triggerAttackRelease("E4", "8n", time);
      this.membrane.triggerAttackRelease("E4", "8n", time);
      // Tone.Transport.bpm.value += 10
    }

    //schedule a few notes
    // Tone.Transport.schedule(triggerSynth, '0:0')
    // Tone.Transport.schedule(triggerSynth, '0:2:2.5')
    // Tone.Transport.schedule(triggerSynth, '0:2:4')

    // Tone.Transport.schedule(triggerSynth, Tone.Time('4n') + 2 * Tone.Time('8t'))
    // Tone.Transport.schedule(triggerSynth, Tone.Time('0:2') + Tone.Time('8t'))
    // Tone.Transport.schedule(triggerSynth, Tone.Time('0:3') + Tone.Time('8t'))

    Tone.Transport.schedule(triggerSynth, 0)
    Tone.Transport.schedule(triggerSynth, 2 * Tone.Time('8t'))
    Tone.Transport.schedule(triggerSynth, Tone.Time('4n') + Tone.Time('8t'))

    //set the transport to repeat
    Tone.Transport.loopEnd = '1m'
    Tone.Transport.loop = true
    Tone.Transport.toggle()
  }

  demo3() {
    const events = [
      { time: 0, note: 'C4', dur: '4n' },
      { time: { '4n': 1, '8n': 1 }, note: 'E4', dur: '8n' },
      { time: '2n', note: 'G4', dur: '16n' },
      { time: { '2n': 1, '8t': 1 }, note: 'B4', dur: '4n' }
    ]
    //pass in an array of events
    var part = new Tone.Part((time, event) => {
      //the events will be given to the callback with the time they occur
      this.synth.triggerAttackRelease(event.note, event.dur, time)
    }, events)

    //start the part at the beginning of the Transport's timeline
    part.start(0)

    //loop the part 3 times
    part.loop = 3
    part.loopEnd = '1m'
    Tone.Transport.toggle()
  }

  demo4Synths() {
    this.synthA.triggerAttackRelease('B3', '1m')
    this.synthB.triggerAttackRelease('B3', '1m', '1m')
  }

  demo5Effects() {
    var distortion = new Tone.Distortion(0.7)
    var tremolo = new Tone.Tremolo().start()
    var polySynth = new Tone.PolySynth(4, Tone.Synth).chain(distortion, tremolo, Tone.Master)
    window.addEventListener('mousedown', () => {
      polySynth.triggerAttackRelease(['C4', 'E4', 'G4', 'B4'], '0.01')
    })
  }

  demoFilters() {
    var filter = new Tone.Filter({
      type : 'bandpass',
      Q : 12
    }).chain(
      // new Tone.BitCrusher(5), 
      new Tone.PingPongDelay(), 
      Tone.Master
    )
    
    //schedule a series of frequency changes
    filter.frequency.setValueAtTime('C5', 0)
    filter.frequency.setValueAtTime('E5', 0.5)
    filter.frequency.setValueAtTime('G5', 1)
    filter.frequency.setValueAtTime('B5', 1.5)
    filter.frequency.setValueAtTime('C6', 2)
    filter.frequency.setValueAtTime('B5', 3)
    filter.frequency.setValueAtTime('C6', 4)
    filter.frequency.setValueAtTime('C6', 5)
    filter.frequency.setValueAtTime('C6', 6)
    filter.frequency.setValueAtTime('B6', 7)
    filter.frequency.setValueAtTime('A6', 8)
    filter.frequency.setValueAtTime('D6', 9)
    filter.frequency.setValueAtTime('D6', 10)
    filter.frequency.linearRampToValueAtTime('C1', 10)
    
    var noise = new Tone.Noise("brown").connect(filter).start(0).stop(10)
    
    //schedule an amplitude curve
    noise.volume.setValueAtTime(-Infinity, 0)
    noise.volume.linearRampToValueAtTime(20, 4)
    noise.volume.linearRampToValueAtTime(-Infinity, 5)
    Tone.Transport.toggle()
  }
}