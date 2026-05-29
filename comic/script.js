const totalPages = 30;
const imageRoot = "pages";
const themes = [
  "汴京暗影",
  "八十萬禁軍教頭",
  "倒拔垂楊柳",
  "英雄相惜",
  "東嶽廟逢凶",
  "拳頭與權力",
  "毒計暗生",
  "寶刀為餌",
  "奉命比刀",
  "誤入白虎堂",
  "百口莫辯",
  "刺配滄州",
  "休妻斷情",
  "險惡路途",
  "野豬林殺機",
  "命懸一線",
  "禪杖天降",
  "護送與分別",
  "滄州牢城營",
  "故人李小二",
  "京城來客",
  "殺機再起",
  "調任草料場",
  "風雪交加",
  "草屋倒塌",
  "山神廟避雪",
  "火光沖天",
  "門外的密語",
  "槍挑仇人",
  "雪夜上梁山",
];

let currentPage = 1;
let isSpread = false;
let touchStartX = 0;

const book = document.querySelector("#book");
const pageImage = document.querySelector("#pageImage");
const pageLabel = document.querySelector("#pageLabel");
const themeLabel = document.querySelector("#themeLabel");
const pageSlider = document.querySelector("#pageSlider");
const prevPage = document.querySelector("#prevPage");
const nextPage = document.querySelector("#nextPage");
const firstPage = document.querySelector("#firstPage");
const lastPage = document.querySelector("#lastPage");
const toggleSpread = document.querySelector("#toggleSpread");
const thumbs = document.querySelector("#thumbs");

function pagePath(page) {
  return `${imageRoot}/page-${String(page).padStart(2, "0")}.png`;
}

function setPage(page, direction = "next") {
  const next = Math.min(totalPages, Math.max(1, page));
  if (next === currentPage && pageImage.src) return;
  currentPage = next;

  pageImage.src = pagePath(currentPage);
  pageImage.alt = `第 ${currentPage} 頁：${themes[currentPage - 1]}`;
  pageLabel.textContent = `第 ${currentPage} 頁 / 共 ${totalPages} 頁`;
  themeLabel.textContent = themes[currentPage - 1];
  pageSlider.value = currentPage;

  prevPage.disabled = currentPage === 1;
  firstPage.disabled = currentPage === 1;
  nextPage.disabled = currentPage === totalPages;
  lastPage.disabled = currentPage === totalPages;

  document.querySelectorAll(".thumb").forEach((button, index) => {
    button.classList.toggle("active", index + 1 === currentPage);
    button.setAttribute("aria-current", index + 1 === currentPage ? "page" : "false");
  });

  book.classList.remove("turn-next", "turn-prev");
  requestAnimationFrame(() => {
    book.classList.add(direction === "prev" ? "turn-prev" : "turn-next");
  });
}

function next() {
  setPage(currentPage + 1, "next");
}

function previous() {
  setPage(currentPage - 1, "prev");
}

function buildThumbs() {
  const fragment = document.createDocumentFragment();
  for (let page = 1; page <= totalPages; page += 1) {
    const button = document.createElement("button");
    button.className = "thumb";
    button.type = "button";
    button.setAttribute("aria-label", `跳到第 ${page} 頁：${themes[page - 1]}`);

    const img = document.createElement("img");
    img.src = pagePath(page);
    img.alt = "";
    img.loading = "lazy";
    button.appendChild(img);
    button.addEventListener("click", () => setPage(page, page > currentPage ? "next" : "prev"));
    fragment.appendChild(button);
  }
  thumbs.appendChild(fragment);
}

prevPage.addEventListener("click", previous);
nextPage.addEventListener("click", next);
firstPage.addEventListener("click", () => setPage(1, "prev"));
lastPage.addEventListener("click", () => setPage(totalPages, "next"));
pageSlider.addEventListener("input", (event) => {
  const targetPage = Number(event.target.value);
  setPage(targetPage, targetPage > currentPage ? "next" : "prev");
});

toggleSpread.addEventListener("click", () => {
  isSpread = !isSpread;
  document.body.classList.toggle("spread", isSpread);
  toggleSpread.textContent = isSpread ? "書頁" : "單頁";
  toggleSpread.setAttribute("aria-pressed", String(isSpread));
});

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "PageDown") next();
  if (event.key === "ArrowLeft" || event.key === "PageUp") previous();
  if (event.key === "Home") setPage(1, "prev");
  if (event.key === "End") setPage(totalPages, "next");
});

pageImage.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });

pageImage.addEventListener("touchend", (event) => {
  const delta = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) < 40) return;
  if (delta < 0) next();
  if (delta > 0) previous();
}, { passive: true });

buildThumbs();
setPage(1, "next");
