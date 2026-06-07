const tabs = document.querySelectorAll(".variant-tab");
const panels = document.querySelectorAll("[data-panel]");
const slotButtons = document.querySelectorAll(".slot-grid button");
const selectedSlot = document.querySelector(".selected-slot");
const visitButtons = document.querySelectorAll(".visit-toggle button");

function activateVariant(variant) {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.variant === variant;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.panel === variant);
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => activateVariant(tab.dataset.variant));
});

slotButtons.forEach((button) => {
  button.addEventListener("click", () => {
    slotButtons.forEach((slot) => slot.classList.remove("is-selected"));
    button.classList.add("is-selected");
    selectedSlot.textContent = `選択中: 本日 ${button.textContent} オンライン診療`;
  });
});

visitButtons.forEach((button) => {
  button.addEventListener("click", () => {
    visitButtons.forEach((visitButton) => visitButton.classList.remove("is-selected"));
    button.classList.add("is-selected");
  });
});
