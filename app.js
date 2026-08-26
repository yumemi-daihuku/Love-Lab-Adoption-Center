// ===== 共通ユーティリティ =====

// --- ゆっくりマスコット SVG 生成（オリジナルの抽象イラスト） ---
// species プリセット：色とアクセサリーの組み合わせ
export const SPECIES_PRESETS = {
  "れいむ種": { color: "#F7C9D6", shade: "#EFA9BE", accent: "#E85C82", accessory: "ribbon" },
  "まりさ種": { color: "#FBE199", shade: "#F3C863", accent: "#8A6A2E", accessory: "cap" },
  "ありす種": { color: "#FFF3D6", shade: "#F6DDA0", accent: "#D68A3E", accessory: "clip" },
  "ぱちゅりー種": { color: "#DCC9F2", shade: "#C1A3E6", accent: "#6E4FA3", accessory: "leaf" },
  "ちぇん種": { color: "#E4C6A5", shade: "#D0A879", accent: "#5B3E27", accessory: "ear" },
  "みょん種": { color: "#CFEAD9", shade: "#A9D8BF", accent: "#3E7A5B", accessory: "tuft" },
};

function accessoryMarkup(type, accent) {
  switch (type) {
    case "ribbon":
      return `<path d="M78,46 Q88,34 100,44 Q112,34 122,46 Q112,52 100,48 Q88,52 78,46 Z" fill="${accent}"/><circle cx="100" cy="46" r="5" fill="${accent}"/>`;
    case "cap":
      return `<path d="M64,52 Q100,26 136,52 Q136,60 100,60 Q64,60 64,52 Z" fill="${accent}"/>`;
    case "clip":
      return `<rect x="86" y="38" width="28" height="9" rx="4.5" fill="${accent}"/>`;
    case "leaf":
      return `<path d="M100,34 C112,34 118,44 112,54 C104,50 96,50 88,54 C82,44 88,34 100,34 Z" fill="${accent}"/>`;
    case "ear":
      return `<path d="M64,58 C60,42 74,34 82,44 Z" fill="${accent}"/><path d="M136,58 C140,42 126,34 118,44 Z" fill="${accent}"/>`;
    case "tuft":
      return `<path d="M84,42 Q92,26 100,40 Q108,26 116,42" stroke="${accent}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    default:
      return "";
  }
}

const FACES = {
  smile: `<path d="M88,118 Q100,130 112,118" stroke="#5A4636" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  wink: `<path d="M88,118 Q100,128 112,116" stroke="#5A4636" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  surprised: `<ellipse cx="100" cy="122" rx="7" ry="9" fill="#5A4636"/>`,
};

/**
 * ゆっくりマスコットのSVGを文字列で返す
 * @param {{color:string, shade:string, accent:string, accessory:string, expression?:string, sleepy?:boolean}} opts
 */
export function mascotSVG(opts) {
  const { color, shade, accent, accessory, expression = "smile" } = opts;
  const face = FACES[expression] || FACES.smile;
  return `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ゆっくりのイラスト">
  <ellipse cx="100" cy="160" rx="58" ry="10" fill="#000" opacity="0.06"/>
  <path d="M100,26 C148,22 180,58 184,100 C188,146 152,182 100,184 C50,186 16,150 14,104 C12,58 52,30 100,26 Z" fill="${color}"/>
  <path d="M22,120 C34,158 68,182 100,184 C138,186 168,160 180,124 C160,158 134,172 100,172 C66,172 36,156 22,120 Z" fill="${shade}" opacity="0.55"/>
  <circle cx="58" cy="66" r="14" fill="#fff" opacity="0.35"/>
  ${accessoryMarkup(accessory, accent)}
  <ellipse cx="80" cy="102" rx="6" ry="8" fill="#5A4636"/>
  <ellipse cx="120" cy="102" rx="6" ry="8" fill="#5A4636"/>
  <ellipse cx="66" cy="116" rx="9" ry="5" fill="${accent}" opacity="0.35"/>
  <ellipse cx="134" cy="116" rx="9" ry="5" fill="${accent}" opacity="0.35"/>
  ${face}
</svg>`;
}

export function speciesPreset(name) {
  return SPECIES_PRESETS[name] || SPECIES_PRESETS["れいむ種"];
}

// --- お気に入り（ローカル保存） ---
const FAV_KEY = "yukkuri_favorites";

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
  } catch {
    return [];
  }
}

export function isFavorite(id) {
  return getFavorites().includes(id);
}

export function toggleFavorite(id) {
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if (idx >= 0) favs.splice(idx, 1);
  else favs.push(id);
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  updateFavCountBadge();
  return favs.includes(id);
}

export function updateFavCountBadge() {
  const el = document.querySelector("[data-fav-count]");
  if (el) el.textContent = getFavorites().length;
}

// --- ナビゲーション：現在ページのハイライト ---
export function initNav() {
  const page = document.body.dataset.page;
  if (!page) return;
  document.querySelectorAll(`.main-nav a[data-page]`).forEach((a) => {
    if (a.dataset.page === page) a.classList.add("active");
  });
  updateFavCountBadge();
}

// --- ヘッダー検索：一覧ページへ q パラメータで遷移 ---
export function initHeaderSearch() {
  const form = document.querySelector("[data-header-search]");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = new FormData(form).get("q") || "";
    const url = new URL("index.html", window.location.href);
    if (q) url.searchParams.set("q", q);
    window.location.href = url.toString();
  });
}

// --- 簡易HTMLエスケープ ---
export function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initHeaderSearch();
});
