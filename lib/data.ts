export type Vocab = { en: string; he: string; emoji: string };

export const VOCAB: Vocab[] = [
  { en: 'bicycle', he: 'אופניים', emoji: '🚲' },
  { en: 'grandparents', he: 'סבא וסבתא', emoji: '👵' },
  { en: 'nature', he: 'טבע', emoji: '🌿' },
  { en: 'dry', he: 'יבש', emoji: '🏜️' },
  { en: 'river', he: 'נהר', emoji: '🏞️' },
  { en: 'animal', he: 'בעל חיים', emoji: '🐾' },
  { en: 'grandchildren', he: 'נכדים', emoji: '🧒' },
  { en: 'climb', he: 'לטפס', emoji: '🧗' },
  { en: 'grass', he: 'דשא', emoji: '🌱' },
  { en: 'wife', he: 'אישה (רעיה)', emoji: '👰' },
  { en: 'look after', he: 'לטפל ב־', emoji: '🤱' },
  { en: 'mountain', he: 'הר', emoji: '⛰️' },
  { en: 'plant', he: 'צמח', emoji: '🪴' },
  { en: 'forest', he: 'יער', emoji: '🌲' },
  { en: 'ride', he: 'לרכוב', emoji: '🚴' },
  { en: 'air', he: 'אוויר', emoji: '💨' },
  { en: 'uncle', he: 'דוד', emoji: '👨' },
  { en: 'aunt', he: 'דודה', emoji: '👩' },
  { en: 'cousin', he: 'בן דוד / בת דודה', emoji: '🧑‍🤝‍🧑' },
  { en: 'old', he: 'זקן / ישן', emoji: '👴' },
  { en: 'clean', he: 'נקי', emoji: '✨' },
  { en: 'garden', he: 'גינה', emoji: '🏡' },
  { en: 'weather', he: 'מזג אוויר', emoji: '🌤️' },
  { en: 'warm', he: 'חמים', emoji: '☀️' },
];

const V = (en: string) => VOCAB.find((v) => v.en === en)!;

/** Extra words for tap-to-translate inside the stories. */
export const GLOSSARY: Record<string, string> = {
  ...Object.fromEntries(VOCAB.map((v) => [v.en, v.he])),
  animals: 'בעלי חיים', plants: 'צמחים', cousins: 'בני דודים', mountains: 'הרים', bicycles: 'אופניים',
  trees: 'עצים', tree: 'עץ', family: 'משפחה', brother: 'אח', house: 'בית', small: 'קטן', big: 'גדול',
  beautiful: 'יפה', green: 'ירוק', many: 'הרבה', morning: 'בוקר', afternoon: 'אחר הצהריים',
  little: 'קטן', dog: 'כלב', dogs: 'כלבים', cats: 'חתולים', walk: 'ללכת', outside: 'בחוץ',
  happy: 'שמח', because: 'כי', love: 'אוהב/ת', loves: 'אוהב/ת', likes: 'אוהב/ת', like: 'אוהבים',
  near: 'ליד', live: 'גרים', visit: 'מבקרים', sunday: 'יום ראשון', saturday: 'יום שבת', eleven: 'אחת־עשרה',
  ten: 'עשר', years: 'שנים', name: 'שם', see: 'רואים', time: 'זמן', spending: 'לבלות', city: 'עיר',
  grandfather: 'סבא', grandmother: 'סבתא', flowers: 'פרחים', birds: 'ציפורים', rabbit: 'ארנב',
  lunch: 'ארוחת צהריים', under: 'מתחת', high: 'גבוה', home: 'בית', eat: 'אוכלים', looks: 'מטפלת',
  after: 'אחרי', two: 'שניים', take: 'לוקחים', comes: 'באה', very: 'מאוד',
};

export type Q = {
  kind: 'blank' | 'tf' | 'word';
  prompt: string;
  options: string[];
  answer: string;
  he: string;
  emoji?: string;
  rtl?: boolean;
};

export type Story = { title: string; emoji: string; paragraphs: string[] };
export type Round = { qs: Q[]; story?: Story; bank?: string[]; pairs?: Vocab[][] };

export type LevelId = 'reading' | 'fill' | 'choose' | 'translate' | 'match' | 'grammar';

export const LEVELS: {
  id: LevelId; n: number; title: string; en: string; desc: string; emoji: string; c: string; cd: string; soft: string;
}[] = [
  { id: 'reading', n: 1, title: 'סיפור הנהר', en: 'Reading', desc: 'קוראים סיפור קצר ועונים על שאלות', emoji: '📖', c: '#5CC8FF', cd: '#1C96D6', soft: '#E3F5FF' },
  { id: 'fill', n: 2, title: 'בנק המילים', en: 'Complete', desc: 'משלימים את המשפט עם המילה החסרה', emoji: '🧩', c: '#4FE0A6', cd: '#14A86C', soft: '#DFFBEF' },
  { id: 'choose', n: 3, title: 'המילה הנכונה', en: 'Choose', desc: 'שתי מילים — רק אחת מתאימה', emoji: '🎯', c: '#FFA552', cd: '#DE7215', soft: '#FFEEDD' },
  { id: 'translate', n: 4, title: 'מתרגמים', en: 'Translate', desc: 'מה פירוש המילה בעברית?', emoji: '🔤', c: '#FF8CC6', cd: '#DB4A96', soft: '#FFE6F3' },
  { id: 'match', n: 5, title: 'זוגות', en: 'Match', desc: 'מחברים מילה באנגלית לפירוש שלה', emoji: '🃏', c: '#B79CFF', cd: '#7F5BE6', soft: '#EFE8FF' },
  { id: 'grammar', n: 6, title: 'am · is · are', en: 'Grammar', desc: 'בוחרים את הפועל הנכון', emoji: '⚡', c: '#FFD84D', cd: '#D9A800', soft: '#FFF6CF' },
];

// ---------- content ----------
type T3 = [prompt: string, correct: string, wrong: string];

const STORIES: { story: Story; a: T3[]; b: [string, boolean][] }[] = [
  {
    story: {
      title: 'A Fun Day by the River', emoji: '🏞️',
      paragraphs: [
        'My name is Lucy. I am eleven years old. I love animals and nature.',
        'On Sunday, my family and I visit my aunt and uncle. They live in a small house near a river. There is a beautiful garden with green grass and many plants.',
        'My uncle likes to ride his bicycle in the morning. My aunt loves to look after animals. She has a little dog and two cats.',
        'My grandparents live near a big mountain. They are old, but they like to walk outside.',
        'In the afternoon, my brother and I go to the river with our cousins. The weather is warm and dry. The air is clean. We see many animals and beautiful trees.',
        'We are very happy because we love spending time with our family.',
      ],
    },
    a: [
      ['Lucy is ___ years old.', '11', '10'],
      ['Lucy visits her ___ on Sunday.', 'aunt and uncle', 'grandparents'],
      ['Her aunt and uncle live near a ___.', 'river', 'forest'],
      ["Lucy's uncle likes to ___.", 'ride a bicycle', 'climb a mountain'],
      ["Lucy's aunt has ___.", 'two cats', 'two dogs'],
      ["Lucy's grandparents live near a ___.", 'mountain', 'school'],
      ['The weather is ___.', 'warm and dry', 'cold and rainy'],
      ['Lucy goes to the river with her ___.', 'cousins', 'friends'],
    ],
    b: [
      ['Lucy loves animals and nature.', true],
      ['Her aunt has a big bicycle.', false],
      ['There is green grass in the garden.', true],
      ["Lucy's grandparents are young.", false],
      ['The air is clean.', true],
      ['Lucy goes to the river in the morning.', false],
    ],
  },
  {
    story: {
      title: 'A Trip to the Forest', emoji: '🌲',
      paragraphs: [
        'My name is Tom. I am ten years old. I live in a big city.',
        'On Saturday, my grandparents take me to the forest. My cousin Maya comes with us. The forest is near a high mountain.',
        'My grandfather likes to climb mountains. My grandmother loves plants and flowers. She looks after a beautiful garden at home.',
        'In the morning, Maya and I ride our bicycles near the river. The grass is green and the air is clean. The weather is warm and dry.',
        'We see many animals: birds, a rabbit and two little dogs.',
        'In the afternoon, we eat lunch under a big tree. I am very happy because I love nature.',
      ],
    },
    a: [
      ['Tom is ___ years old.', '10', '11'],
      ['Tom lives in a ___.', 'big city', 'small house'],
      ['Tom goes to the forest with his ___.', 'grandparents', 'aunt and uncle'],
      ['The forest is near a ___.', 'mountain', 'school'],
      ["Tom's grandfather likes to ___.", 'climb mountains', 'ride a bicycle'],
      ["Tom's grandmother loves ___.", 'plants and flowers', 'cats and dogs'],
      ['Tom and Maya ride their bicycles near the ___.', 'river', 'city'],
      ['They eat lunch under a ___.', 'big tree', 'high mountain'],
    ],
    b: [
      ["Maya is Tom's cousin.", true],
      ['The grass is green.', true],
      ['The weather is cold and rainy.', false],
      ['They see three little dogs.', false],
      ['Tom rides his bicycle in the afternoon.', false],
      ['Tom loves nature.', true],
    ],
  },
];

const BANK = ['mountain', 'grass', 'aunt', 'bicycle', 'river', 'forest', 'grandparents', 'plants', 'animals', 'climb'];
const FILL: [string, string][][] = [
  [
    ['My father likes to ride his ___ in the park.', 'bicycle'],
    ["My mother's sister is my ___.", 'aunt'],
    ['We can see many trees in the ___.', 'forest'],
    ['The ___ is very high.', 'mountain'],
    ["My ___ are my father's parents.", 'grandparents'],
    ['The children like to ___ trees.', 'climb'],
    ['The cows eat green ___.', 'grass'],
    ['Fish live in the ___.', 'river'],
    ['We have beautiful ___ in our garden.', 'plants'],
    ['Dogs and cats are ___.', 'animals'],
  ],
  [
    ['A ___ has two wheels.', 'bicycle'],
    ["My father's sister is my ___.", 'aunt'],
    ['Many tall trees grow in the ___.', 'forest'],
    ['There is snow on the top of the ___.', 'mountain'],
    ['My grandmother and grandfather are my ___.', 'grandparents'],
    ['Monkeys can ___ trees very fast.', 'climb'],
    ['We sit on the green ___ in the park.', 'grass'],
    ['The boat is on the ___.', 'river'],
    ['Flowers and trees are ___.', 'plants'],
    ['Lions and elephants are wild ___.', 'animals'],
  ],
];

const CHOOSE: T3[] = [
  ["My father's brother is my ___.", 'uncle', 'wife'],
  ['The ___ is green in the garden.', 'grass', 'air'],
  ['My grandmother is 80 years old. She is ___.', 'old', 'dry'],
  ['My sister likes to ___ her bicycle.', 'ride', 'climb'],
  ['We can see many trees in the ___.', 'forest', 'river'],
  ['A flower is a ___.', 'plant', 'mountain'],
  ['My mother likes to ___ our baby.', 'look after', 'ride'],
  ['The ___ is clean in the mountains.', 'air', 'grass'],
  ["My uncle's ___ is my aunt.", 'wife', 'aunt'],
  ['We like to ___ mountains.', 'climb', 'ride'],
  ['The weather in the desert is ___.', 'dry', 'green'],
  ['A dog is an ___.', 'animal', 'plant'],
  // extra practice
  ["My mother's brother is my ___.", 'uncle', 'aunt'],
  ['Fish swim in the ___.', 'river', 'mountain'],
  ['My grandparents love their ___.', 'grandchildren', 'grandparents'],
  ['Trees, rivers and mountains are ___.', 'nature', 'bicycle'],
  ['The cat likes to ___ the tree.', 'climb', 'ride'],
  ['I ___ my little brother.', 'look after', 'climb'],
  ['Birds fly in the ___.', 'air', 'river'],
  ["My father's ___ is my mother.", 'wife', 'uncle'],
  ['A ___ is very high.', 'mountain', 'plant'],
  ['There is no rain. The grass is ___.', 'dry', 'old'],
];
const CHOOSE_ORIG = 12;

const TRANSLATE_ORIG = ['bicycle', 'grandparents', 'nature', 'dry', 'river', 'animal', 'grandchildren', 'climb', 'grass', 'wife', 'look after', 'mountain', 'plant', 'forest', 'ride'];
const MATCH_ORIG = ['mountain', 'grandchildren', 'air', 'ride', 'grass', 'uncle', 'forest', 'look after', 'dry', 'nature'];

const GRAMMAR: [string, string][] = [
  ['My grandmother ___ very happy.', 'is'],
  ['The children ___ in the garden.', 'are'],
  ['I ___ eleven years old.', 'am'],
  ['My uncle ___ a teacher.', 'is'],
  ['The mountains ___ very high.', 'are'],
  ['We ___ near the forest.', 'are'],
  ['The grass ___ green.', 'is'],
  ['You ___ my best friend.', 'are'],
  ['My aunt and uncle ___ at home.', 'are'],
  ['The bicycle ___ blue.', 'is'],
  ['My cousins ___ ten years old.', 'are'],
  ['The river ___ beautiful.', 'is'],
  ['I ___ in the classroom.', 'am'],
  ['My grandfather ___ old.', 'is'],
  ['The animals ___ in the forest.', 'are'],
  // extra practice
  ['My aunt ___ very nice.', 'is'],
  ['The plants ___ green.', 'are'],
  ['I ___ happy today.', 'am'],
  ['The forest ___ big.', 'is'],
  ['My grandparents ___ old.', 'are'],
  ['The dog ___ in the garden.', 'is'],
  ['You ___ a good student.', 'are'],
  ['The air ___ clean.', 'is'],
  ['Lucy and I ___ cousins.', 'are'],
  ['I ___ near the river.', 'am'],
];
const GRAMMAR_ORIG = 15;

// ---------- round builder ----------
export function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}
const pick = <T,>(a: T[], n: number) => shuffle(a).slice(0, n);

/** `first` = the child has not finished this level yet → use the original worksheet items. */
export function buildRound(id: LevelId, first: boolean): Round {
  switch (id) {
    case 'reading': {
      const s = STORIES[first ? 0 : Math.floor(Math.random() * STORIES.length)];
      return {
        story: s.story,
        qs: [
          ...s.a.map(([prompt, c, w]): Q => ({ kind: 'blank', prompt, answer: c, options: shuffle([c, w]), he: 'בחרו את התשובה הנכונה לפי הסיפור' })),
          ...s.b.map(([prompt, t]): Q => ({ kind: 'tf', prompt, answer: t ? 'True' : 'False', options: ['True', 'False'], he: 'נכון או לא נכון?' })),
        ],
      };
    }
    case 'fill': {
      const set = FILL[first ? 0 : Math.floor(Math.random() * FILL.length)];
      return {
        bank: shuffle(BANK),
        qs: shuffle(set).map(([prompt, answer]): Q => ({ kind: 'blank', prompt, answer, options: [], he: 'בחרו מילה מהבנק — כל מילה פעם אחת' })),
      };
    }
    case 'choose': {
      const items = first ? shuffle(CHOOSE.slice(0, CHOOSE_ORIG)) : pick(CHOOSE, 12);
      return { qs: items.map(([prompt, c, w]): Q => ({ kind: 'blank', prompt, answer: c, options: shuffle([c, w]), he: 'איזו מילה מתאימה למשפט?' })) };
    }
    case 'translate': {
      const words = first ? shuffle(TRANSLATE_ORIG.map(V)) : pick(VOCAB, 12);
      return {
        qs: words.map((v): Q => ({
          kind: 'word', prompt: v.en, emoji: v.emoji, answer: v.he, rtl: true, he: 'מה פירוש המילה בעברית?',
          options: shuffle([v.he, ...pick(VOCAB.filter((o) => o.en !== v.en), 3).map((o) => o.he)]),
        })),
      };
    }
    case 'match': {
      const words = first ? shuffle(MATCH_ORIG.map(V)) : pick(VOCAB, 10);
      return { qs: [], pairs: [words.slice(0, 5), words.slice(5, 10)] };
    }
    case 'grammar': {
      const items = first ? shuffle(GRAMMAR.slice(0, GRAMMAR_ORIG)) : pick(GRAMMAR, 12);
      return { qs: items.map(([prompt, answer]): Q => ({ kind: 'blank', prompt, answer, options: ['am', 'is', 'are'], he: 'am, is או are?' })) };
    }
  }
}
