const storageKey = "video-craft-config-v1";

const state = {
  audienceId: "new",
  sections: [
    { id: "setup", title: "導入とゴール", duration: "01:45", summary: "動画の目的、完成イメージ、全体像を伝える。" },
    { id: "flow", title: "開始タイミング設計", duration: "02:10", summary: "視聴者属性ごとに再生開始点を変える。" },
    { id: "publish", title: "YouTube公開フロー", duration: "02:30", summary: "公開、限定公開、埋め込みの運用を整理する。" },
    { id: "manual", title: "マニュアル作成", duration: "01:50", summary: "手順書、備忘録、更新履歴をまとめる。" },
    { id: "config", title: "Config画面", duration: "02:20", summary: "テンプレ、注意書き、差し替え項目を調整する。" },
    { id: "review", title: "運用改善", duration: "02:00", summary: "計測結果を見て次回の構成に反映する。" },
  ],
  config: {
    title: "Video Craft Manual",
    flowMode: "auto",
    defaultStart: "00:00",
    highlightSection: "setup",
    youtubeUrl: "https://youtube.com/",
    notes: "セクションごとの開始位置を調整し、視聴者の目的に合わせて再生開始点を変える。",
  },
};

const audiences = [
  { id: "new", label: "新規の視聴者", desc: "導入から丁寧に", startAt: "00:00", reason: "基本説明を最初から表示" },
  { id: "returning", label: "再訪の視聴者", desc: "実務に直行", startAt: "01:45", reason: "概要を短縮して実践へ" },
  { id: "note", label: "備忘録目的", desc: "要点を抜粋", startAt: "04:20", reason: "手順と設定を優先" },
  { id: "fast", label: "時短で見たい人", desc: "結論先出し", startAt: "08:10", reason: "結論とテンプレを先に" },
];

const flowSteps = [
  "動画素材を1本にまとめる",
  "セクションごとに開始点をメモする",
  "視聴者セグメントごとにルールを定義する",
  "YouTubeの公開設定を決める",
  "Config画面で差し替え項目を保存する",
  "再生ログを見ながら改善する",
];

const audienceList = document.querySelector("#audienceList");
const sectionList = document.querySelector("#sectionList");
const flowStepper = document.querySelector("#flowStepper");
const timeline = document.querySelector("#timeline");
const memoList = document.querySelector("#memoList");
const configSnapshot = document.querySelector("#configSnapshot");
const sectionCount = document.querySelector("#sectionCount");
const recommendedDuration = document.querySelector("#recommendedDuration");
const flowMode = document.querySelector("#flowMode");
const activeAudienceLabel = document.querySelector("#activeAudienceLabel");
const startAtLabel = document.querySelector("#startAtLabel");
const timelineChip = document.querySelector("#timelineChip");
const videoTitle = document.querySelector("#videoTitle");
const flowModeSelect = document.querySelector("#flowModeSelect");
const defaultStart = document.querySelector("#defaultStart");
const highlightSection = document.querySelector("#highlightSection");
const youtubeUrl = document.querySelector("#youtubeUrl");
const notes = document.querySelector("#notes");
const newSectionTitle = document.querySelector("#newSectionTitle");
const newSectionDuration = document.querySelector("#newSectionDuration");
const newSectionSummary = document.querySelector("#newSectionSummary");

function formatFlowMode(value) {
  if (value === "manual") return "手動選択";
  if (value === "hybrid") return "ハイブリッド";
  return "自動分岐";
}

function renderAudienceList() {
  audienceList.innerHTML = audiences
    .map(
      (audience) => `
        <button class="audience-card ${audience.id === state.audienceId ? "is-active" : ""}" data-audience="${audience.id}" type="button">
          <strong>${audience.label}</strong>
          <span>${audience.desc}</span>
          <small>${audience.reason}</small>
        </button>
      `,
    )
    .join("");

  audienceList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.audienceId = button.dataset.audience;
      syncAudience();
      renderAudienceList();
      renderPreview();
    });
  });
}

function renderSections() {
  sectionList.innerHTML = state.sections
    .map(
      (section, index) => `
        <article class="section-card ${section.id === state.config.highlightSection ? "is-highlighted" : ""}">
          <div class="section-head">
            <span class="section-index">${String(index + 1).padStart(2, "0")}</span>
            <div>
              <strong>${section.title}</strong>
              <small>${section.duration}</small>
            </div>
          </div>
          <p>${section.summary}</p>
          <div class="section-actions">
            <button type="button" data-delete-section="${section.id}">削除</button>
          </div>
        </article>
      `,
    )
    .join("");

  highlightSection.innerHTML = state.sections
    .map((section) => `<option value="${section.id}">${section.title}</option>`)
    .join("");

  sectionList.querySelectorAll("[data-delete-section]").forEach((button) => {
    button.addEventListener("click", () => deleteSection(button.dataset.deleteSection));
  });

  if (!state.sections.some((section) => section.id === state.config.highlightSection)) {
    state.config.highlightSection = state.sections[0]?.id ?? "setup";
    highlightSection.value = state.config.highlightSection;
  }
}

function renderFlowSteps() {
  flowStepper.innerHTML = flowSteps.map((step) => `<li>${step}</li>`).join("");
}

function renderTimeline() {
  timeline.innerHTML = state.sections
    .map((section) => {
      const isActive = section.id === state.config.highlightSection;
      return `
        <div class="timeline-item ${isActive ? "is-active" : ""}">
          <span class="timeline-time">${section.duration}</span>
          <div>
            <strong>${section.title}</strong>
            <p>${section.summary}</p>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderMemo() {
  const memoItems = [
    "YouTube公開時は、限定公開で検証してから本公開に回す。",
    "セクション開始点は、視聴者の目的別に 00:00 / 01:45 / 04:20 を軸にする。",
    "Config変更は localStorage に保存し、次回起動時に復元する。",
    "冒頭の強調セクションを変えて、マニュアル動画の訴求順を試す。",
  ];

  memoList.innerHTML = memoItems.map((item) => `<li>${item}</li>`).join("");
}

function syncAudience() {
  const audience = audiences.find((item) => item.id === state.audienceId) ?? audiences[0];
  activeAudienceLabel.textContent = audience.label;
  startAtLabel.textContent = audience.startAt;
  timelineChip.textContent = `${audience.startAt} から開始`;
}

function syncConfigToInputs() {
  videoTitle.value = state.config.title;
  flowModeSelect.value = state.config.flowMode;
  defaultStart.value = state.config.defaultStart;
  youtubeUrl.value = state.config.youtubeUrl;
  notes.value = state.config.notes;
  highlightSection.value = state.config.highlightSection;
}

function collectConfigFromInputs() {
  state.config = {
    title: videoTitle.value.trim() || "Video Craft Manual",
    flowMode: flowModeSelect.value,
    defaultStart: defaultStart.value.trim() || "00:00",
    highlightSection: highlightSection.value,
    youtubeUrl: youtubeUrl.value.trim(),
    notes: notes.value.trim(),
  };
}

function renderSnapshot() {
  configSnapshot.textContent = JSON.stringify(
    {
      title: state.config.title,
      flowMode: formatFlowMode(state.config.flowMode),
      defaultStart: state.config.defaultStart,
      highlightSection: state.sections.find((item) => item.id === state.config.highlightSection)?.title,
      youtubeUrl: state.config.youtubeUrl,
      notes: state.config.notes,
    },
    null,
    2,
  );
}

function updateMetrics() {
  sectionCount.textContent = String(state.sections.length);
  recommendedDuration.textContent = estimateTotalDuration();
  flowMode.textContent = formatFlowMode(state.config.flowMode);
}

function estimateTotalDuration() {
  const totalSeconds = state.sections.reduce((sum, section) => sum + parseDuration(section.duration), 0);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}分${String(seconds).padStart(2, "0")}秒`;
}

function parseDuration(durationText) {
  const parts = durationText.split(":").map((part) => Number(part));
  if (parts.length !== 2 || parts.some((part) => Number.isNaN(part))) return 0;
  return parts[0] * 60 + parts[1];
}

function generateSectionId(title) {
  return `${title.toLowerCase().replace(/[^a-z0-9\u3040-\u30ff\u4e00-\u9faf]+/g, "-").replace(/^-+|-+$/g, "")}-${Date.now().toString(36)}`;
}

function addSectionFromComposer() {
  const title = newSectionTitle.value.trim();
  const duration = newSectionDuration.value.trim();
  const summary = newSectionSummary.value.trim();

  if (!title || !duration || !summary) return;

  state.sections.push({
    id: generateSectionId(title),
    title,
    duration,
    summary,
  });

  newSectionTitle.value = "";
  newSectionDuration.value = "";
  newSectionSummary.value = "";
  state.config.highlightSection = state.sections[state.sections.length - 1].id;
  syncConfigToInputs();
  renderPreview();
  saveConfig();
}

function deleteSection(sectionId) {
  if (state.sections.length <= 1) return;
  state.sections = state.sections.filter((section) => section.id !== sectionId);
  if (state.config.highlightSection === sectionId) {
    state.config.highlightSection = state.sections[0]?.id ?? "setup";
  }
  syncConfigToInputs();
  renderPreview();
  saveConfig();
}

function renderPreview() {
  renderSections();
  renderTimeline();
  renderSnapshot();
  updateMetrics();
}

function saveConfig() {
  collectConfigFromInputs();
  window.localStorage.setItem(storageKey, JSON.stringify(state));
  renderPreview();
}

function restoreConfig() {
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return;
  try {
    const stored = JSON.parse(raw);
    if (Array.isArray(stored?.sections) && stored.sections.length) {
      state.sections = stored.sections;
    }
    if (stored?.config) {
      state.config = { ...state.config, ...stored.config };
    }
    if (stored?.audienceId) {
      state.audienceId = stored.audienceId;
    }
  } catch (error) {
    window.console.warn("Config restore failed", error);
  }
}

document.querySelector("#saveConfig").addEventListener("click", saveConfig);
document.querySelector("#applyConfig").addEventListener("click", () => {
  collectConfigFromInputs();
  renderPreview();
});
document.querySelector("#addSection").addEventListener("click", addSectionFromComposer);
document.querySelector("#runPreview").addEventListener("click", () => {
  collectConfigFromInputs();
  renderPreview();
  saveConfig();
});

document.querySelectorAll("#videoTitle, #flowModeSelect, #defaultStart, #highlightSection, #youtubeUrl, #notes").forEach((element) => {
  const eventName = element.tagName === "SELECT" ? "change" : "input";
  element.addEventListener(eventName, () => {
    collectConfigFromInputs();
    renderPreview();
  });
});

restoreConfig();
syncConfigToInputs();
syncAudience();
renderAudienceList();
renderFlowSteps();
renderMemo();
renderPreview();
