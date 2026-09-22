import { CATEGORIES, type CategorySlug } from "@/lib/types";

export type QuizOption = {
  label: string;
  weights: Partial<Record<CategorySlug, number>>;
};

export type QuizQuestion = {
  question: string;
  options: QuizOption[];
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "피어싱을 하고 싶은 이유에 가장 가까운 건?",
    options: [
      { label: "있는 듯 없는 듯 자연스러웠으면", weights: { lobe: 2, helix: 1 } },
      { label: "사진 찍었을 때 티가 났으면", weights: { nostril: 2, septum: 1 } },
      { label: "나만 알고 있어도 충분해", weights: { navel: 2, tragus: 1 } },
      { label: "확실하게 분위기를 바꾸고 싶어", weights: { industrial: 2, lip: 1 } },
    ],
  },
  {
    question: "평소 옷차림은 어떤 편인가요?",
    options: [
      { label: "무채색 기본 아이템 위주", weights: { lobe: 2, helix: 1 } },
      { label: "실버 액세서리를 자주 껴요", weights: { helix: 2, industrial: 1 } },
      { label: "그날 기분 따라 과감하게", weights: { lip: 2, nostril: 1 } },
      { label: "편한 게 제일이에요", weights: { navel: 2, tragus: 1 } },
    ],
  },
  {
    question: "아픈 건 어느 정도까지 참을 수 있나요?",
    options: [
      { label: "아픈 건 정말 싫어요", weights: { lobe: 2, tragus: 1 } },
      { label: "한 번쯤은 참을 수 있어요", weights: { helix: 2, nostril: 1 } },
      { label: "아플수록 값지다고 생각해요", weights: { industrial: 2, septum: 1 } },
      { label: "별로 신경 안 써요", weights: { lip: 2, navel: 1 } },
    ],
  },
  {
    question: "학교나 회사에서 눈에 띄는 건?",
    options: [
      { label: "부담스러워요", weights: { navel: 2, lobe: 1 } },
      { label: "적당하면 괜찮아요", weights: { tragus: 2, helix: 1 } },
      { label: "별로 상관없어요", weights: { nostril: 2, lip: 1 } },
      { label: "오히려 좋아요", weights: { septum: 2, industrial: 1 } },
    ],
  },
  {
    question: "주얼리를 고를 때 가장 중요한 건?",
    options: [
      { label: "오래 써도 질리지 않는 것", weights: { lobe: 2, helix: 1 } },
      { label: "남들이 잘 안 하는 디자인", weights: { septum: 2, industrial: 1 } },
      { label: "얼굴에 잘 어울리는 것", weights: { nostril: 2, lip: 1 } },
      { label: "옷에 가려도 내가 알면 되는 것", weights: { navel: 2, tragus: 1 } },
    ],
  },
  {
    question: "피어싱을 하고 나면 가장 먼저 하고 싶은 일은?",
    options: [
      { label: "거울 보면서 혼자 만족하기", weights: { tragus: 2, navel: 1 } },
      { label: "사진 찍어서 올리기", weights: { septum: 2, nostril: 1 } },
      { label: "친구한테 바로 보여주기", weights: { lip: 2, industrial: 1 } },
      { label: "딱히 없어요, 그냥 내 만족", weights: { helix: 2, lobe: 1 } },
    ],
  },
];

export type Persona = {
  title: string;
  tagline: string;
  description: string;
  keywords: string[];
};

export const PERSONAS: Record<CategorySlug, Persona> = {
  lobe: {
    title: "질리지 않는 클래식",
    tagline: "유행보다 오래 가는 쪽을 택하는 사람",
    description:
      "화려한 것보다 오래 두고 쓸 수 있는 걸 고르는 편이에요. 귀볼은 회복이 빠르고 규격도 넉넉해서, 하나씩 늘려가며 나만의 조합을 만들기에 가장 좋은 자리입니다.",
    keywords: ["무난함", "데일리", "겹착"],
  },
  helix: {
    title: "은근한 멋쟁이",
    tagline: "티 내지 않지만 아는 사람은 아는",
    description:
      "크게 드러내지 않으면서도 디테일을 챙기는 타입이에요. 헬릭스는 귀 윤곽을 따라 라인을 만들 수 있어서, 한 개만 해도 인상이 달라지는 자리입니다.",
    keywords: ["라인", "실버", "절제"],
  },
  tragus: {
    title: "디테일 수집가",
    tagline: "작은 차이를 알아보는 사람",
    description:
      "남들은 그냥 지나치는 작은 부분에서 만족을 찾는 편이에요. 트라거스는 정면에서 살짝 보이는 정도라, 과하지 않게 포인트를 주고 싶을 때 가장 잘 맞습니다.",
    keywords: ["포인트", "소심한 과감함", "클로즈업"],
  },
  industrial: {
    title: "시선을 즐기는 타입",
    tagline: "이왕 할 거면 확실하게",
    description:
      "어중간한 것보다 확실한 쪽을 택하는 사람이에요. 인더스트리얼은 귀 위쪽 두 곳을 하나의 바로 잇는 구조라, 피어싱 중에서도 존재감이 가장 큰 편입니다.",
    keywords: ["과감함", "구조미", "존재감"],
  },
  nostril: {
    title: "얼굴로 말하는 타입",
    tagline: "인상 전체를 바꾸고 싶은 사람",
    description:
      "표정과 분위기로 자신을 드러내는 편이에요. 코는 아주 작은 스톤 하나로도 인상이 또렷해져서, 적은 투자로 변화가 큰 자리입니다.",
    keywords: ["인상 변화", "작지만 또렷", "사진발"],
  },
  septum: {
    title: "판을 흔드는 타입",
    tagline: "남들과 같은 건 재미없는 사람",
    description:
      "흔한 선택지에는 잘 끌리지 않는 편이에요. 셉텀은 안쪽으로 접어 넣으면 가려지기도 해서, 과감하면서도 상황에 따라 조절할 수 있는 영리한 선택입니다.",
    keywords: ["개성", "반전", "조절 가능"],
  },
  lip: {
    title: "직진하는 타입",
    tagline: "고민보다 실행이 빠른 사람",
    description:
      "마음먹으면 바로 움직이는 편이에요. 입술은 표정을 따라 움직여서 살아있는 느낌을 주고, 좌우 대칭으로 맞추면 인상이 훨씬 또렷해집니다.",
    keywords: ["즉흥", "표정", "대칭"],
  },
  navel: {
    title: "나만 아는 비밀",
    tagline: "보여주기보다 간직하는 사람",
    description:
      "평소엔 가려두지만 내가 알고 있다는 사실만으로 충분한 타입이에요. 배꼽은 옷차림에 따라 보였다 안 보였다 해서, 혼자만의 만족감이 가장 큰 자리입니다.",
    keywords: ["비밀", "여름", "나만의 만족"],
  },
};

// 답변한 선택지들의 점수를 부위별로 합산해, 가장 높은 부위를 돌려줍니다.
export function scoreAnswers(answers: number[]): CategorySlug {
  const scores = {} as Record<CategorySlug, number>;
  for (const c of CATEGORIES) scores[c.slug] = 0;

  answers.forEach((optionIndex, questionIndex) => {
    const option = QUIZ_QUESTIONS[questionIndex]?.options[optionIndex];
    if (!option) return;
    for (const [slug, weight] of Object.entries(option.weights)) {
      scores[slug as CategorySlug] += weight ?? 0;
    }
  });

  let best: CategorySlug = CATEGORIES[0].slug;
  for (const c of CATEGORIES) {
    if (scores[c.slug] > scores[best]) best = c.slug;
  }
  return best;
}

export function isCategorySlug(value: string): value is CategorySlug {
  return CATEGORIES.some((c) => c.slug === value);
}
