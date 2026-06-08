const variantTabs = document.querySelectorAll(".variant-tab");
const slotButtons = document.querySelectorAll(".slot-grid button");
const visitButtons = document.querySelectorAll(".visit-toggle button");
const selectedSlot = document.querySelector(".selected-slot");

const variantCopy = {
  simple: {
    label: "シンプル",
    title: "ED治療を、医師に相談してから自宅で受け取る。",
    lead:
      "予約、問診、オンライン診療、処方、配送までを1つの導線にまとめた男性向け自由診療サイト案です。広告流入でも不安を残さず、診療予約へ進みやすい構成にしています。",
    cta: "最短15分後の枠を確認",
  },
  detail: {
    label: "丁寧な説明",
    title: "初めてのED治療も、納得してから診療予約へ。",
    lead:
      "副作用、併用できない薬、服用タイミング、診察で確認する内容を先に見せる説明重視の案です。患者さんの不安を減らし、医師相談の価値を強く伝えます。",
    cta: "診療の流れを確認",
  },
  illustration: {
    label: "イラスト活用",
    title: "相談しづらさをやわらげる、明るいED診療サイト。",
    lead:
      "柔らかいビジュアルと会話調の導線で、スマホ流入でも相談しやすい印象を作る案です。薬剤写真と医師監修表記を併用し、軽くなりすぎない設計にします。",
    cta: "スマホで予約する",
  },
};

function setVariant(variant) {
  const copy = variantCopy[variant];
  if (!copy) return;

  document.body.dataset.variant = variant;
  document.querySelector("h1").textContent = copy.title;
  document.querySelector(".hero-lead").textContent = copy.lead;
  document.querySelector(".hero-actions .primary-button").textContent = copy.cta;

  variantTabs.forEach((tab) => {
    const isActive = tab.dataset.variant === variant;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-pressed", String(isActive));
  });
}

variantTabs.forEach((tab) => {
  tab.addEventListener("click", () => setVariant(tab.dataset.variant));
});

slotButtons.forEach((button) => {
  button.addEventListener("click", () => {
    slotButtons.forEach((slot) => slot.classList.remove("is-selected"));
    button.classList.add("is-selected");
    const visit = document.querySelector(".visit-toggle .is-selected")?.textContent || "オンライン初診";
    selectedSlot.textContent = `選択中: 本日 ${button.textContent} ${visit}`;
  });
});

visitButtons.forEach((button) => {
  button.addEventListener("click", () => {
    visitButtons.forEach((visitButton) => visitButton.classList.remove("is-selected"));
    button.classList.add("is-selected");
    const slot = document.querySelector(".slot-grid .is-selected")?.textContent || "13:00";
    selectedSlot.textContent = `選択中: 本日 ${slot} ${button.textContent}`;
  });
});
