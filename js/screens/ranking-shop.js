(function () {
  const D = window.StoritData;
  const C = window.StoritComponents;
  const assetBase = "./assets/figma-exported/named/";
  const rankingAssetBase = "./assets/figma-exported/ranking-page/";

  function ensureStyles() {
    if (typeof document === "undefined") return;
    const doc = document;
    if (!doc.querySelector || !doc.createElement || !doc.head) return;
    if (doc.querySelector('link[href^="./css/ranking-shop.css"], link[data-storit-css="ranking-shop"]')) return;

    const link = doc.createElement("link");
    link.rel = "stylesheet";
    link.href = "./css/ranking-shop.css?v=ranking-precision-20260617p";
    if (link.setAttribute) {
      link.setAttribute("data-storit-css", "ranking-shop");
    }
    doc.head.appendChild(link);
  }

  ensureStyles();

  function escape(value) {
    return C.escape(value);
  }

  function namedAsset(file, alt, className = "") {
    return `<img class="${escape(className)}" src="${assetBase}${escape(file)}" alt="${escape(alt)}" loading="lazy" />`;
  }

  function rankingAsset(file, alt = "", className = "") {
    return `<img class="${escape(className)}" src="${rankingAssetBase}${escape(file)}" alt="${escape(alt)}" loading="lazy" />`;
  }

  function initials(name) {
    return escape(String(name || "S").trim().slice(0, 1) || "S");
  }

  function scoreText(score, unit = "점") {
    const text = String(score);
    return text.includes("점") || text.includes("★") ? text : `${text}${unit}`;
  }

  function trendClass(trend) {
    const text = String(trend || "");
    if (text.includes("▲")) return "is-up";
    if (text.includes("▼")) return "is-down";
    return "is-flat";
  }

  function rankingTabs(active) {
    return `
      <div class="rs-tabs rs-ranking-tabs" aria-label="랭킹 전환">
        <button class="rs-tab ${active === "daily" ? "is-active" : ""}" data-route="rankingDaily">일간 랭킹</button>
        <button class="rs-tab ${active === "season" ? "is-active" : ""}" data-route="rankingSeason">시즌 랭킹</button>
      </div>
    `;
  }

  function statCard({ icon, label, value, note, tone = "" }) {
    return `
      <article class="rs-stat ${tone}">
        <span class="rs-stat__icon" aria-hidden="true">${C.icon(icon)}</span>
        <span>${escape(label)}</span>
        <strong>${value}</strong>
        ${note ? `<small>${escape(note)}</small>` : ""}
      </article>
    `;
  }

  function rankRow({ rank, name, score, trend, isMe = false, crown = false }) {
    return `
      <article class="rs-rank-row ${isMe ? "is-me" : ""} ${crown ? "is-crown" : ""}">
        <strong class="rs-rank-row__rank">${escape(rank)}</strong>
        <span class="rs-avatar" aria-hidden="true">${initials(name)}</span>
        <span class="rs-rank-row__user">
          <strong>${escape(name)}</strong>
          <small>${isMe ? "내 순위" : crown ? "현재 1위" : "참여자"}</small>
        </span>
        <strong class="rs-rank-row__score">${escape(score)}</strong>
        <span class="rs-rank-row__trend ${trendClass(trend)}">${escape(trend || "-")}</span>
      </article>
    `;
  }

  function rankingCompactRow({ rank, name, score, trend = "-", isMe = false, medal = false }) {
    return `
      <article class="rs-ranking-compact-row ${isMe ? "is-me" : ""} ${medal ? "is-medal" : ""}">
        <strong class="rs-ranking-compact-row__rank">${escape(rank)}</strong>
        <span class="rs-avatar" aria-hidden="true">${initials(name)}</span>
        <span class="rs-ranking-compact-row__name">${escape(name)}</span>
        <strong class="rs-ranking-compact-row__score">${scoreText(score)}</strong>
        <span class="rs-ranking-compact-row__trend ${trendClass(trend)}">${escape(trend)}</span>
      </article>
    `;
  }

  function rankingProfile(className = "") {
    return rankingAsset("랭킹 프로필.svg", "프로필", `rs-ranking-profile ${className}`);
  }

  function rankingCookieCount(amount, className = "") {
    return `<span class="rs-ranking-cookie-count ${escape(className)}">${rankingAsset("쿠키_일반.svg", "쿠키")}<b>${escape(amount)}</b></span>`;
  }

  function dailyRankRow({ rank, name, score, medal = "", isMe = false }) {
    const rankContent = medal
      ? rankingAsset(medal, `${rank}등`, "rs-daily-rank-row__medal")
      : `<b>${escape(rank)}</b>`;
    return `
      <article class="rs-daily-rank-row ${isMe ? "is-me" : ""}">
        <span class="rs-daily-rank-row__rank">${rankContent}</span>
        ${rankingProfile()}
        <strong class="rs-daily-rank-row__name">${escape(name)}</strong>
        <span class="rs-daily-rank-row__score">${escape(score)}</span>
      </article>
    `;
  }

  function seasonRankRow({ rank, name, score, isMe = false }) {
    return `
      <article class="rs-season-rank-row ${isMe ? "is-me" : ""}">
        <strong>${escape(rank)}</strong>
        ${rankingProfile()}
        <span>${escape(name)}</span>
        <b>${rankingAsset("별.svg", "별")}${escape(score)}</b>
      </article>
    `;
  }

  function productImage(product, className = "rs-product-card__image") {
    const imageKey = product.image || product.brand;
    const fileByKey = {
      npay: "product-npay.png",
      "N pay": "product-npay.png",
      googlePlay: "product-google-play.png",
      "Google Play": "product-google-play.png",
      ipad: "product-ipad.png",
    };
    return namedAsset(fileByKey[imageKey] || "product-npay.png", product.name, className);
  }

  function shopCatalog() {
    return [
      { ...D.products[0], badge: "실시간 인기", meta: "네이버페이", cta: "교환" },
      { ...D.products[1], badge: "게임 인기", meta: "Google Play", cta: "교환" },
      { name: "아이패드 이벤트 응모권", brand: "Event", price: 120, type: "event", image: "ipad", badge: "추첨", meta: "스페셜", cta: "응모" },
      { ...D.products[3], badge: "생활", meta: "편의점", cta: "교환" },
      { name: "네이버페이 포인트 10,000원", brand: "N pay", price: 100, type: "gift", image: "npay", badge: "고액권", meta: "상품권", cta: "교환" },
      { name: "구글 플레이 기프트 카드 10,000원", brand: "Google Play", price: 100, type: "card", image: "googlePlay", badge: "인기", meta: "디지털 코드", cta: "교환" },
    ];
  }

  function productCard(product, compact = false) {
    return `
      <article class="rs-product-card ${compact ? "is-compact" : ""}" data-route="productDetail">
        <div class="rs-product-card__media">
          ${productImage(product)}
          <span class="rs-product-card__badge">${escape(product.badge || product.type || "상품")}</span>
        </div>
        <div class="rs-product-card__body">
          <small>${escape(product.meta || product.brand)}</small>
          <strong>${escape(product.name)}</strong>
          <div class="rs-product-card__footer">
            <span>쿠키 ${escape(product.price)}개</span>
            <button class="rs-mini-button" data-route="productDetail">${escape(product.cta || "보기")}</button>
          </div>
        </div>
      </article>
    `;
  }

  function shopRecommendCard(product, index) {
    return `
      <article class="rs-shop-recommend-card" data-route="productDetail">
        ${productImage(product, "rs-shop-recommend-card__image")}
        <small>${escape(product.meta || product.brand)}</small>
        <strong>${escape(product.name)}</strong>
        <span>${C.icon("cookie")} ${escape(product.price)}개</span>
        ${index === 2 ? `<button class="rs-shop-next-button" type="button" aria-label="다음 추천상품">›</button>` : ""}
      </article>
    `;
  }

  function shopGridCard(product) {
    const normalizedName = String(product.name || "");
    const shortName = normalizedName.includes("포인트")
      ? normalizedName.replace("네이버페이 포인트 ", "")
      : normalizedName;
    return `
      <article class="rs-shop-grid-card" data-route="productDetail">
        ${productImage(product, "rs-shop-grid-card__image")}
        <small>${escape(product.meta || product.brand)}</small>
        <strong>${escape(shortName)}</strong>
        <span>${C.icon("cookie")} ${escape(product.price)}</span>
      </article>
    `;
  }

  function detailInfoCards() {
    return `
      <div class="rs-info-grid">
        ${statCard({ icon: "store", label: "사용처", value: "네이버페이", note: "가맹점" })}
        ${statCard({ icon: "clock", label: "지급", value: "1~3일", note: "앱 알림" })}
        ${statCard({ icon: "attendance", label: "유효", value: "30일", note: "발급일 기준" })}
      </div>
    `;
  }

  function exchangeSummary() {
    return `
      <article class="rs-exchange-summary">
        <div class="rs-exchange-summary__image">${namedAsset("product-npay.png", "네이버페이 포인트 5,000P")}</div>
        <div>
          <h2>네이버페이 포인트 5000P</h2>
          <strong>${C.icon("cookie")} 50 <span>쿠키</span></strong>
        </div>
      </article>
    `;
  }

  function exchangeCookieBalance() {
    return `
      <section class="rs-exchange-balance" aria-label="교환 쿠키 정보">
        <div>
          <span>내 보유 쿠키</span>
          <strong>${C.icon("cookie")} ${D.user.cookie}<small>개</small></strong>
        </div>
        <div>
          <span>교환 후 잔여 쿠키</span>
          <strong>${C.icon("cookie")} ${D.user.cookie - 50}<small>개</small></strong>
        </div>
      </section>
    `;
  }

  function exchangeGuide() {
    const items = [
      ["clock", "교환 신청 후 평균 1~3일 내 지급됩니다.", "평균 소요 기간이며, 상황에 따라 변동될 수 있어요."],
      ["question", "지급 완료시 앱 알림을 보내드려요.", "보상함에서 상품을 확인할 수 있어요."],
      ["gift", "마이페이지 > 보관함", "교환 상황은 보관함에서 확인 가능해요."],
    ];
    return `
      <section class="rs-exchange-guide">
        <h3>교환 안내</h3>
        <div class="rs-exchange-guide__card">
          ${items
            .map(
              ([icon, title, desc]) => `
                <article>
                  <span>${C.icon(icon)}</span>
                  <div>
                    <strong>${escape(title)}</strong>
                    <small>${escape(desc)}</small>
                  </div>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function rewardCard(reward, used = false, index = 0) {
    return `
      <article class="rs-reward-card ${used ? "is-used" : ""}">
        <div class="rs-reward-card__media">${namedAsset("product-npay.png", reward.name)}</div>
        <div class="rs-reward-card__body">
          <div>
            ${used ? "" : `<span class="rs-chip is-green">${escape(reward.dday)}</span>`}
          </div>
          <strong>${escape(reward.name)}</strong>
          <small>${C.icon("cookie")} 50 쿠키 교환</small>
          <small>${C.icon("gift")} ${escape(reward.date)}</small>
        </div>
        <button class="rs-reward-card__button" data-route="${used ? "rewardUsed" : "rewardDetail"}">${used ? "사용완료" : "사용하기"}</button>
      </article>
    `;
  }

  function barcodeCard(copied = false) {
    return `
      <section class="rs-barcode-card ${copied ? "is-copied" : ""}">
        <div class="rs-barcode-card__header">
          <span>
            <small>바코드 번호</small>
            <strong>1234 5678 9101 1112</strong>
          </span>
          <span class="rs-chip ${copied ? "is-green" : "is-soft"}">${copied ? "복사 완료" : "사용 가능"}</span>
        </div>
        <div class="rs-barcode" aria-label="1234 5678 9101 1112"></div>
        ${
          copied
            ? `<button class="rs-copy-button is-copied" disabled>번호가 복사되었습니다</button>`
            : `<button class="rs-copy-button" data-route="rewardCopied">바코드 번호 복사</button>`
        }
      </section>
    `;
  }

  function rankingDaily() {
    const topRows = [
      { rank: 1, name: "무게대마왕", score: "850점", medal: "1등 메달.svg" },
      { rank: 2, name: "웰툰도하", score: "850점", medal: "2등메달.svg" },
      { rank: 3, name: "격살추가족", score: "850점", medal: "3등 메달.svg" },
    ];
    const nearbyRows = [
      { rank: 4, name: "무게대마왕", score: "850점" },
      { rank: 5, name: "바람의검신", score: "830점" },
      { rank: 6, name: "은하철도999", score: "810점" },
      { rank: 7, name: D.user.name, score: "790점", isMe: true },
    ];

    return C.shell({
      title: "일간 랭킹",
      back: "home",
      activeNav: "rankingDaily",
      className: "ranking-shop-screen ranking-daily-screen",
      content: `
        ${rankingTabs("daily")}

        <section class="rs-ranking-daily-card">
          <div class="rs-ranking-daily-card__top">
            <div class="rs-ranking-me-block">
              ${rankingAsset("쿠키.svg", "쿠키", "rs-ranking-me-block__cookie")}
              <span>
                <b>${escape(D.user.name)}</b>
                <small>32위 822점</small>
              </span>
            </div>
            <div class="rs-ranking-goal-block">
              ${rankingAsset("트로피.svg", "트로피")}
              <span><b>1등까지</b><small>+ 256점</small></span>
            </div>
            <button type="button" data-route="quiz">점수 올리러 가기</button>
          </div>

          <p class="rs-ranking-live"><span>${rankingAsset("live.svg", "LIVE")}</span> 일간 랭킹은 오늘 본 웹툰 퀴즈의 총점의 합으로 경쟁합니다.</p>

          <div class="rs-ranking-benefit-card rs-ranking-benefit-card--daily">
            <div class="rs-ranking-benefits">
              <article>${rankingAsset("왕관.svg", "왕관")}<strong>1등</strong>${rankingCookieCount("50")}</article>
              <article>${rankingAsset("클로버.svg", "클로버")}<strong>행운의 특송</strong>${rankingCookieCount("20")}</article>
              <article>${rankingAsset("불.svg", "불")}<strong>TOP 30</strong>${rankingCookieCount("1")}</article>
            </div>
            <div class="rs-ranking-benefit-card__bg">${rankingAsset("배경.svg", "오븐 배경")}</div>
            <div class="rs-ranking-benefit-card__art">${rankingAsset("고민하는쿠키.svg", "고민하는 쿠키")}</div>
          </div>

          <div class="rs-ranking-timer">${rankingAsset("시계.svg", "시계")} 자정까지 남은 시간 <strong>03:41:29</strong></div>
        </section>

        <section class="rs-daily-rank-table">
          <div class="rs-daily-rank-table__head">
            <span>순위</span><span>닉네임</span><span>점수</span>
          </div>
          <div class="rs-daily-rank-table__body">
            ${topRows.map(dailyRankRow).join("")}
            ${nearbyRows.map(dailyRankRow).join("")}
          </div>
        </section>

        <section class="rs-lucky-card">
          <span class="rs-lucky-card__icon" aria-hidden="true">${rankingAsset("행운쿠키.svg", "행운 쿠키")}</span>
          <div>
            <strong>오늘의 행운 구간</strong>
            <b>10위~30위 사이</b>
            <p>시간이 지날수록 올라가요!</p>
          </div>
          <span class="rs-lucky-card__range">${rankingAsset("행운구간.svg", "행운 구간")}</span>
        </section>

      `,
    });
  }

  function rankingSeason() {
    const seasonRows = [
      { rank: 4, name: "무게대마왕", score: "22,110" },
      { rank: 5, name: D.user.name, score: "22,110" },
      { rank: 6, name: "은빛여우", score: "18,672" },
      { rank: 30, name: "불꽃기사", score: "17,954", isMe: true },
      { rank: 31, name: "어둠의주술사", score: "16,738" },
      { rank: 32, name: "빛의수호자", score: "15,623" },
    ];

    return C.shell({
      title: "시즌 랭킹",
      back: "rankingDaily",
      activeNav: "rankingDaily",
      className: "ranking-shop-screen ranking-season-screen",
      content: `
        ${rankingTabs("season")}

        <section class="rs-season-reward-card">
          <header>
            <b>SEASON 05</b>
            <span>시즌 랭킹은 상위 20%까지 쿠키 보상 지급!</span>
            <button type="button" data-modal="rankingSeasonReward" aria-label="시즌 보상 세부안">i</button>
          </header>
          <div class="rs-season-reward-card__body">
            <div class="rs-season-rewards">
              <article>${rankingAsset("1등 메달.svg", "1등")} ${rankingCookieCount("50")}</article>
              <article>${rankingAsset("2등메달.svg", "2등")} ${rankingCookieCount("30")}</article>
              <article>${rankingAsset("3등 메달.svg", "3등")} ${rankingCookieCount("20")}</article>
            </div>
            <div class="rs-season-reward-card__cookie">${rankingAsset("금메달 단상대 쿠키.svg", "금메달 단상대 쿠키")}</div>
          </div>
          <footer>
            ${rankingAsset("시계.svg", "시계")}
            <div>
              <span>이번 시즌 남은 시간</span>
              <strong>25일 03:41:29</strong>
              <small>시즌에 3일 이상 참여하면 랭킹 보상에 도전할 수 있어요!</small>
            </div>
          </footer>
        </section>

        <section class="rs-season-podium">
          <article class="is-second">
            <strong>2위</strong>
            ${rankingAsset("시즌랭킹 프로필.svg", "프로필")}
            <span>내가그린기린그림</span>
            <b>${rankingAsset("별.svg", "별")}22,680</b>
          </article>
          <article class="is-first">
            ${rankingAsset("왕관.svg", "왕관", "rs-season-crown")}
            <strong>1위</strong>
            ${rankingAsset("시즌랭킹 프로필.svg", "프로필")}
            <span>격살추가족</span>
            <b>${rankingAsset("별.svg", "별")}22,680</b>
          </article>
          <article class="is-third">
            <strong>3위</strong>
            ${rankingAsset("시즌랭킹 프로필.svg", "프로필")}
            <span>무게대마왕</span>
            <b>${rankingAsset("별.svg", "별")}22,680</b>
          </article>
        </section>

        <section class="rs-season-table">
          <div class="rs-season-table__body">
            ${seasonRows.slice(0, 3).map(seasonRankRow).join("")}
            <div class="rs-ranking-separator">${rankingAsset("점점점.svg", "생략")}</div>
            ${seasonRows.slice(3).map(seasonRankRow).join("")}
          </div>
        </section>
      `,
    });
  }

  function rankingYesterday() {
    return `
      <section class="screen rs-yesterday-screen" data-route="rankingDaily">
        <div class="rs-yesterday-bg" aria-hidden="true"></div>
        <div class="rs-yesterday-content">
          <h1>어제의 일간순위를<br />발표합니다!</h1>
          <div class="rs-yesterday-cards">
            <article class="is-first">
              ${rankingAsset("왕관.svg", "왕관")}
              <strong>1위</strong>
              ${rankingAsset("랭킹 프로필.svg", "프로필")}
              <span>무게대마왕</span>
              <b>${rankingAsset("별.svg", "별")} 9,990</b>
              ${rankingCookieCount("50")}
            </article>
            <article class="is-lucky">
              ${rankingAsset("클로버.svg", "클로버")}
              <strong>27위</strong>
              ${rankingAsset("랭킹 프로필.svg", "프로필")}
              <span>웰튼도하</span>
              <b>${rankingAsset("별.svg", "별")} 5,680</b>
              ${rankingCookieCount("20")}
            </article>
          </div>
          ${rankingAsset("금메달 단상대 쿠키.svg", "금메달 쿠키", "rs-yesterday-cookie")}
        </div>
      </section>
    `;
  }

  function shop() {
    const recommended = Array.from({ length: 2 }, () => ({
      ...D.products[0],
      name: "네이버페이 포인트 5,000원",
      meta: "네이버페이 포인트",
      price: 50,
      image: "npay",
    }));
    const popularProducts = Array.from({ length: 4 }, () => ({
      ...D.products[1],
      name: "구글 플레이 기프트 카드 5000원",
      meta: "Google Play",
      price: 50,
      image: "googlePlay",
    }));
    const categories = [
      ["전체", "shopCategoryAll"],
      ["상품권", "shopCategoryGift"],
      ["편의점", "shopCategoryConvenience"],
      ["카페", "shopCategoryCafe"],
      ["음식", "shopCategoryFood"],
      ["기타", "shopCategoryEtc"],
    ];

    return C.shell({
      title: "상점",
      back: "home",
      activeNav: "shop",
      className: "ranking-shop-screen shop-screen",
      content: `
        <section class="rs-shop-hero">
          <div class="rs-shop-hero__main">
            <div>
              <span class="rs-chip is-strong">쿠키 1개 = 100원</span>
              <h2>모은 쿠키로<br />원하는 기프티콘으로!</h2>
              <p>열심히 모은 쿠키로 다양한 상품권을 교환해 보세요!</p>
            </div>
            <div class="rs-shop-hero__art">${namedAsset("character-shop-clean.png", "상점 캐릭터")}</div>
          </div>
          <div class="rs-shop-balance-row">
            <button type="button">
              <span>지금까지 모은 내 쿠키</span>
              <i aria-hidden="true">›</i>
              <strong>${C.icon("cookie")} ${escape(D.user.cookie)}개</strong>
            </button>
            <button type="button" data-route="vault">보관함</button>
          </div>
        </section>

        <div class="rs-category-tabs" aria-label="상점 카테고리">
          ${categories
            .map(
              ([label, icon], index) => `
                <button class="rs-category-tab ${index === 0 ? "is-active" : ""}">
                  <span aria-hidden="true">${C.icon(icon)}</span>
                  <strong>${escape(label)}</strong>
                </button>
              `,
            )
            .join("")}
        </div>

        <section class="rs-section">
          <div class="rs-section__header">
            <h3>추천상품</h3>
            <button class="rs-shop-more-button" type="button">더보기 ›</button>
          </div>
          <div class="rs-shop-recommend-strip">
            ${recommended.map((product, index) => shopRecommendCard(product, index)).join("")}
          </div>
        </section>

        <section class="rs-section">
          <div class="rs-filter-bar">
            <div>
              <h3>인기상품</h3>
            </div>
            <div class="rs-sort-tabs" aria-label="상품 정렬">
              <button class="is-active">인기순</button>
            </div>
          </div>
          <div class="rs-shop-popular-grid">
            ${popularProducts.map((product) => shopGridCard(product)).join("")}
          </div>
        </section>

        <section class="rs-shop-invite-card" data-modal="invite">
          ${namedAsset("character-shop-clean.png", "친구 초대 캐릭터", "rs-shop-invite-card__character")}
          <div>
            <strong>친구 초대하고 쿠키 더 받아요</strong>
            <p>초대한 친구가 가입하면 10쿠키를 드려요!</p>
          </div>
          <button type="button">초대하기 ›</button>
        </section>

        <section class="rs-event-card">
          <div>
            <span class="rs-chip is-soft">스페셜 이벤트</span>
            <strong>웹툰만 보면<br />아이패드 응모권이 열려요</strong>
            <p>매주 추첨을 통해 아이패드를 드려요.</p>
            <button class="rs-primary-button" data-route="mission">이벤트 참여</button>
          </div>
          ${namedAsset("product-ipad.png", "아이패드", "rs-event-card__image")}
        </section>
      `,
    });
  }

  function productDetail() {
    const recommendations = shopCatalog().slice(1, 4);

    return C.shell({
      title: "상품 정보",
      back: "shop",
      className: "ranking-shop-screen product-detail-screen",
      content: `
        <section class="rs-detail-hero">
          <div class="rs-detail-hero__image">${namedAsset("product-npay.png", "네이버페이 포인트 5,000P")}</div>
          <h2>네이버페이 포인트 5,000P</h2>
          <strong class="rs-price">${C.icon("cookie")} 50</strong>
        </section>

        <section class="rs-panel rs-product-info-panel">
          ${detailInfoCards()}
          <h3>상품설명</h3>
          <ul class="rs-copy-list">
            <li>네이버페이 포인트 5,000원권입니다.</li>
            <li>네이버페이 가맹점에서 사용할 수 있습니다.</li>
            <li>교환 완료 시 알림으로 안내드려요.</li>
          </ul>
        </section>

        <section class="rs-section">
          <div class="rs-section__header">
            <h3>추천 상품</h3>
          </div>
          <div class="rs-product-strip">
            ${recommendations.map((product) => productCard(product, true)).join("")}
          </div>
        </section>

        <div class="fixed-bottom-action rs-sticky-action">${C.button("교환 신청하기", { route: "exchangeApply" })}</div>
      `,
    });
  }

  function exchangeApply(checked = false) {
    return C.shell({
      title: "교환 신청",
      back: "productDetail",
      className: "ranking-shop-screen exchange-screen",
      content: `
        ${exchangeSummary()}
        ${exchangeCookieBalance()}
        ${exchangeGuide()}

        <section class="rs-exchange-warning">
          <div>
            <strong>꼭 확인해주세요!</strong>
            <ul>
              <li>교환 신청 후 취소 및 환불이 불가능해요.</li>
              <li>부정 사용시 서비스 이용이 제한될 수 있습니다.</li>
              <li>유효기간이 만료되면 사용이 불가능합니다.</li>
            </ul>
          </div>
          ${namedAsset("character-shop-clean.png", "확인 캐릭터", "rs-exchange-warning__character")}
        </section>

        <button class="rs-check-row ${checked ? "is-checked" : ""}" data-action="check">
          <span class="rs-check-row__mark">✓</span>
          <span>위 내용을 모두 확인했어요</span>
        </button>

        <div class="fixed-bottom-action rs-sticky-action">${C.button("신청 확정하기", { route: "exchangeDone", variant: "dark" })}</div>
      `,
    });
  }

  function exchangeDone() {
    return C.shell({
      title: "교환 완료",
      back: "shop",
      className: "ranking-shop-screen exchange-done-screen",
      content: `
        <section class="rs-complete-hero">
          ${namedAsset("character-shop-clean.png", "교환 완료 캐릭터", "rs-complete-hero__character")}
          <h2>교환 신청이 완료되었어요!</h2>
          <p>신청한 상품은 아래 내용으로 지급될 예정이에요.</p>
        </section>

        <section class="rs-panel rs-exchange-receipt">
          <div class="rs-info-list">
            <div><span>상품명</span><strong>네이버페이 포인트 5,000원</strong></div>
            <div><span>사용쿠키</span><strong>50개</strong></div>
            <div><span>교환일시</span><strong>2026.05.21 14:30</strong></div>
          </div>
        </section>

        <section class="rs-wallet-card is-compact rs-exchange-balance-card">
          <div>
            <span>현재 보유 쿠키</span>
            <strong>${C.icon("cookie")} 30 <small>개</small></strong>
          </div>
          <button class="rs-text-button" data-route="cookieHistory">쿠키 내역 보러가기 ›</button>
        </section>

        <div class="fixed-bottom-action rs-sticky-action stack-sm">
          ${C.button("보관함에서 확인하기", { route: "vault" })}
          ${C.button("상점으로 돌아가기", { route: "shop", variant: "outline" })}
        </div>
      `,
    });
  }

  function vault(used = false) {
    return C.shell({
      title: "보관함",
      back: "shop",
      className: "ranking-shop-screen vault-screen",
      content: `
        <div class="rs-tabs" aria-label="보관함 탭">
          <button class="rs-tab ${used ? "" : "is-active"}" data-route="vault">사용 가능</button>
          <button class="rs-tab ${used ? "is-active" : ""}" data-route="vaultUsed">사용 완료</button>
        </div>

        <h2 class="rs-vault-count">${used ? "사용 완료 2" : "사용 가능 2"}</h2>

        <div class="rs-reward-list">
          ${D.rewards.map((reward, index) => rewardCard(reward, used, index)).join("")}
        </div>

        ${used ? "" : `
          <section class="rs-vault-notice">
            <strong>안내사항</strong>
            <p>유효기간이 지난 기프티콘은 자동으로 사용 완료 처리됩니다.</p>
          </section>
        `}

        <section class="rs-vault-empty">
          ${namedAsset("character-vault-empty.svg", "보관함 캐릭터", "rs-vault-empty__character")}
          <strong>사용 가능한 보상이 더 없어요!</strong>
          <p>다양한 활동으로 쿠키를 모아<br />멋진 보상을 교환해보세요</p>
          <button type="button" data-route="mission">쿠키 모으러 가기</button>
        </section>
      `,
    });
  }

  function rewardDetail(copied = false) {
    return C.shell({
      title: "상품권 상세",
      back: "vault",
      className: "ranking-shop-screen reward-detail-screen",
      content: `
        <section class="rs-detail-hero is-voucher">
          <div class="rs-detail-hero__image">${namedAsset("product-npay.png", "네이버페이 포인트 5,000P")}</div>
          <h2>네이버페이 포인트 5,000P</h2>
        </section>

        ${barcodeCard(copied)}

        <section class="rs-panel rs-reward-info-panel">
          <div class="rs-info-list">
            <div><span>신청기간</span><strong>2026.05.20 14:30</strong></div>
            <div><span>지급일</span><strong>2026.05.21 14:30</strong></div>
            <div><span>유효기간</span><strong><em>D-28</em> 2026.06.19</strong></div>
            <div><span>사용쿠키</span><strong>50개</strong></div>
          </div>
        </section>

        ${copied ? `<div class="rs-copy-toast">바코드 번호가 복사되었습니다.</div>` : ""}
        <div class="fixed-bottom-action rs-sticky-action">${C.button("완료", { route: "vault" })}</div>
      `,
    });
  }

  window.StoritScreenRegistry.register({
    rankingDaily,
    rankingSeason,
    rankingYesterday,
    shop,
    productDetail,
    exchangeApply: () => exchangeApply(false),
    exchangeApplyChecked: () => exchangeApply(true),
    exchangeDone,
    vault: () => vault(false),
    vaultUsed: () => vault(true),
    rewardUsed: () => vault(true),
    rewardDetail: () => rewardDetail(false),
    rewardCopied: () => rewardDetail(true),
  });
})();
