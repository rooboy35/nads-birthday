export const roasts = [
  "Your beard says ‘I can build a deck.’ Your behaviour says you’d need a permission slip to stand on it.",
  "You’ve got the facial hair of a bushranger and the emotional resilience of a wet fucking biscuit.",
  "Happy birthday, Nads. Another successful lap around the sun without picking up a single life skill.",
  "That beard isn’t a personality, mate. It’s a privacy screen for the toddler running the joint.",
  "You’ve spent years growing that beard. Shame you couldn’t spare ten minutes to grow the fuck up.",
  "The candles on your cake have a clearer career path than you. At least they know when to burn out.",
  "You call it ‘having a few beers.’ Your bib calls it a fucking workplace hazard.",
  "You look like you could wrestle a crocodile, but you’d cry if it didn’t invite you to its birthday.",
  "The only thing you’ve successfully raised is everyone’s blood pressure. And occasionally your sippy cup.",
  "You’re what happens when a baby’s first word is ‘schooner’ and nobody intervenes.",
  "Your beard has more structure than your entire fucking week.",
  "They say age brings wisdom. Yours appears to have been lost by Australia Post.",
  "You’ve got two settings: needs a nap, and needs a beer. Both somehow require everyone else’s attention.",
  "Nads has entered his mature era. Unfortunately it’s a typo. He meant manure.",
  "You’re the reason the pub should have a change table and a designated fucking adult.",
  "That’s a lovely beard. Does it come with a grown-up, or is that sold separately?",
  "Your life is a group assignment and the beard’s the only one doing any fucking work.",
  "You’d lose an argument with a baby monitor, then demand to speak to its manager.",
  "Your emotional support beer needs an emotional support beer after dealing with your shit.",
  "You don’t have a five-year plan. You have a five-minute warning before a fucking tantrum.",
  "Happy birthday to a bloke whose toughest decision is whether to spit the dummy before or after his nap.",
  "You dress like a man with plans and react like someone’s just snapped your favourite crayon.",
  "Your beard could survive a cyclone. Your mood can’t survive ‘sorry mate, kitchen’s closed.’",
  "You’re not ageing like fine wine. You’re ageing like a forgotten stubby in a hot fucking ute.",
  "Nads is proof you can be old enough for a mortgage and still need someone to cut the crusts off.",
  "You’ve got the confidence of a Bunnings tradie and the practical skills of the sausage out front.",
  "We checked your maturity settings. It’s not a loading bar, mate. It’s a fucking flatline.",
  "You treat mild inconvenience like you’ve been personally betrayed by the entire fucking universe.",
  "If adulthood had a loyalty card, you’d still be arguing about the first stamp.",
  "You’ve got birthday cake in your beard and fuck-all in your diary. Honestly, at least you’re consistent.",
  "They put ‘keep away from children’ on your beer. Nobody accounted for a toddler with a full fucking beard.",
  "You’re a limited edition: all the running costs of an adult, none of the included features.",
  "You could hide a family of possums in that beard and they’d still be the most responsible people in the room.",
  "Nads calls it ‘being young at heart.’ The rest of us call it ‘who the fuck gave the baby a debit card?’",
  "Happy birthday, you spectacular bearded liability. We’d swap you for a sensible mate, but who’d eat the crayons?",
  "You’ve reached the age where hangovers last two days and your good decisions still haven’t fucking started."
];
export const tantrums = [
  "Someone told Nads to act his fucking age. He’s been inconsolable ever since.",
  "The pub said ‘last drinks’. Nads heard ‘we never loved you’.",
  "His beer was served in a glass instead of his special big-boy bottle. Absolute fucking devastation.",
  "Someone asked him to make a sensible decision. We’ve declared a state of emergency.",
  "He’s discovered the candles aren’t edible. Another birthday ruined by fucking science.",
  "We said he couldn’t have cake for breakfast. He’s contacting the fucking ombudsman.",
  "A mate called his beard ‘fluffy’. He’s been sobbing into his bib for twenty minutes.",
  "He put his nappy on backwards and blamed the fucking government."
];
export const beers = [
  "One beer and the giant toddler has stopped being a little bitch. A medical fucking miracle.",
  "Bottle accepted. Dummy spat. Crisis downgraded to ‘still a bit of a dickhead’.",
  "The emotional support stubby has arrived. His carer can finally have five fucking minutes.",
  "Happy baby. Cold beer. Absolutely no progress towards adulthood.",
  "Nads has completed his bottle and would like to announce: BUUURP. A beautiful speech.",
  "From full tantrum to full tradie in one sip. The beard is back in charge."
];
export const wishes = [
  "Wish granted: another year of your mates putting up with your shit. Lucky bastard.",
  "You wished for wisdom. We got you beer. Let’s be fucking realistic.",
  "May your beer be cold, your beard be glorious, and your nappy someone else’s problem.",
  "Here’s to fewer bad decisions. Or at least better fucking stories.",
  "Another year of big laughs, good mates and being our favourite enormous baby. Love you, Nads."
];

// A shuffled deck gives everyone the whole collection before repeating.
export function createDeck(items) {
  let deck = [], previous;
  return () => {
    if (!deck.length) {
      deck = [...items];
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      if (deck.length > 1 && deck.at(-1) === previous) [deck[0], deck[deck.length - 1]] = [deck.at(-1), deck[0]];
    }
    previous = deck.pop();
    return previous;
  };
}
