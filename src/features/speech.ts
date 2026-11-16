if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

const BAD = ['eddy', 'flo', 'grandma', 'grandpa', 'reed', 'rocko', 'sandy', 'shelley', 'bad news', 'bells', 'boing', 'bubbles', 'cellos', 'good news', 'jester', 'organ', 'superstar', 'trinoids', 'whisper', 'wobble', 'zarvox', 'albert', 'fred', 'junior', 'kathy', 'ralph'];
const GOOD = ['anna', 'helena', 'markus', 'petra', 'viktor', 'yannick', 'samantha', 'ava', 'allison', 'susan', 'tom', 'daniel', 'karen', 'moira', 'milena', 'yuri', 'katya', 'irina', 'pavel'];

const pickVoice = (lang: string) => {
  const voices = window.speechSynthesis.getVoices();
  const code = lang.split('-')[0].toLowerCase();
  const norm = (l: string) => l.replace('_', '-').toLowerCase();
  const list = voices.filter((v) => norm(v.lang).startsWith(code));

  const score = (v: SpeechSynthesisVoice) => {
    const n = v.name.toLowerCase();
    let s = 0;
    if (BAD.some((b) => n === b || n.startsWith(b + ' '))) s -= 10;
    if (GOOD.some((g) => n.startsWith(g))) s += 5;
    if (n.includes('premium')) s += 4;
    if (n.includes('enhanced') || n.includes('улучшен')) s += 3;
    if (n.includes('natural')) s += 3;
    if (n.includes('google')) s += 2;
    if (norm(v.lang) === lang.toLowerCase()) s += 1;
    return s;
  };

  return list.sort((a, b) => score(b) - score(a))[0];
};

export const speak = (text: string, lang: 'de-DE' | 'en-US' | 'ru-RU' = 'de-DE') => {
  if (!('speechSynthesis' in window)) return;

  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.95;

  const voice = pickVoice(lang);
  if (voice) utterance.voice = voice;

  const run = () => {
    synth.resume();
    synth.speak(utterance);
  };

  if (synth.speaking || synth.pending) {
    synth.cancel();
    setTimeout(run, 100);
  } else {
    run();
  }
};