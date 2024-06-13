const loadingdummy = document.getElementById("loading-dummy");
const cardList = document.getElementById("card-list");
const sortLike = document.getElementById("like");
const sortRecent = document.getElementById("recent");
const underLine = document.querySelector(".sort-bar-underline");
const selectButton = document.querySelector(".home-tag-right-selecter");
const selectValue = document.querySelector(".home-tag-right-value");
const selectBar = document.querySelector(".home-tag-right-selecter-bar");
const selectBarList = document.querySelector(".home-tag-right-list");
const PER_PAGE = 20; // 한번에 가져올 페이지개수

// 변수공간
let sortType = "";
let sortDate = "";
let page = 1; // 기본페이지
let hasMoreData = true; //데이터를 더 가져올 수 있는지 여부
let isLoading = false;
let isVisible = false; // 셀렉트창

// 더미 생성 함수
const createLoadingDummy = () => {
  Array.from({ length: PER_PAGE }).forEach(() => {
    const postElement = document.createElement("li");
    postElement.classList.add("card");
    postElement.innerHTML = `
            <span>
              <div class="card-image-box dummy">
                <img class="dummy-card-image"/>
              </div>
            </ㅔ>
            <div class="card-main">
              <div class="card-main-title dummy dummy-text"></div>
              <div class="card-main-content dummy">
                <p></p>
              </div>
              <div class="card-sub-info dummy dummy-text">
                <span class="card-date dummy dummy-text"></span>
                <span class="dummy dummy-text"></span>
                <span class="dummy dummy-text"></span>
              </div>
            </div>
            <div class="card-footer">
              <div class="card-footer-user dummy dummy-text">
                <span></span>
              </div>
              <div class="card-footer-like dummy dummy-text"></div>
            </div>
            `;
    loadingdummy.appendChild(postElement);
  });
};

const createBoardList = (data) => {
  data.forEach((board) => {
    const postElement = document.createElement("li");
    postElement.classList.add("card");
    postElement.innerHTML = `
        <a href="/boards/${board.id}">
          <div class="card-image-box">
            <img class="card-image" src="" alt="" />
          </div>
        </a>
        <div class="card-main">
          <a href="/boards/${board.id}">
            <h4 class="card-main-title">${board.title}</h4>
            <div class="card-main-content">
              <p>${board.content}</p>
            </div>
          </a>
          <div class="card-sub-info">
            <span class="card-date">${board.updated_dttm}</span>
            <span>·</span>
            <span>0개의 댓글</span>
          </div>
        </div>
        <div class="card-footer">
          <div class="card-footer-user">
            by <span>${board.writer}</span>
          </div>
          <div class="card-footer-like"><i class="bi bi-heart-fill"></i>0</div>
        </div>
        `;
    cardList.appendChild(postElement);
  });
};

// 더미 숨기는 함수
const hideDummy = () => {
  loadingdummy.style.display = "none";
};

const resetCardList = () => {
  cardList.innerHTML = "";
  page = 1;
  hasMoreData = true;
};

// boards 요청 함수
const loadboards = async () => {
  // 로딩중이거나 가져올 데이터가 없을 때
  if (isLoading || !hasMoreData) return;

  isLoading = true;

  if (isLoading) {
    loadingdummy.style.display = "grid";
  }

  try {
    const response = await fetch(
      `/api/boards/${sortType ?? "recent"}/${
        sortDate ?? "week"
      }?&page=${page}&per_page=${PER_PAGE}`
    );

    if (!response.ok) {
      throw new Error("요청 오류");
    }

    const data = await response.json();

    // 보드가 없을 때
    if (data.length === 0) {
      hasMoreData = false;
      hideDummy();
      console.log("포스트 없습니다.");
      return;
    }

    createBoardList(data);
    page++; // 페이지 증가

    // 가져온 데이터의 개수가 PER_PAGE보다 작으면 로딩 화면을 숨김
    if (data.length < PER_PAGE) {
      hideDummy();
      hasMoreData = false;
    }
  } catch (e) {
    console.log("에러발생", e);
  } finally {
    hideDummy();
    isLoading = false;
  }
};

const handleScroll = () => {
  if (isLoading) return;

  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    loadboards();
  }
};

window.addEventListener("scroll", handleScroll);
document.addEventListener("DOMContentLoaded", () => {
  createLoadingDummy();
  loadboards();
});

// home-tag-left
sortLike.addEventListener("click", () => changeSortType("like"));
sortRecent.addEventListener("click", () => changeSortType("recent"));

const changeSortType = (type) => {
  if (type === "recent") {
    underLine.style.left = "44%";
    sortLike.classList.remove("sort-active");
    sortRecent.classList.add("sort-active");
  }

  if (type === "like") {
    underLine.style.left = "3%";
    sortRecent.classList.remove("sort-active");
    sortLike.classList.add("sort-active");
  }

  sortType = type;
  history.pushState(null, null, `/${sortType}`);
  resetCardList();
  loadboards();
};

// home-tag-right
const toggleSelectBar = () => {
  if (isVisible) {
    hideSelectBar();
  } else {
    showSelectBar();
  }
  isVisible = !isVisible;
};

const showSelectBar = () => {
  selectBar.classList.add("visible");
};

const hideSelectBar = () => {
  selectBar.classList.remove("visible");
};

// 버튼 클릭 시 토글
selectButton.addEventListener("click", (e) => {
  e.stopPropagation(); // 이벤트 버블링 방지
  toggleSelectBar();
});

// 다른 영역 클릭 시에도 숨기기
document.addEventListener("click", (e) => {
  if (isVisible && !selectBar.contains(e.target) && e.target !== selectButton) {
    hideSelectBar();
    isVisible = false;
  }
});

selectBarList.addEventListener("click", (e) => {
  const childrenArray = selectBarList.children;
  const { id, textContent } = e.target;
  selectValue.textContent = textContent;

  [...childrenArray].forEach((element) => {
    element.classList.remove("selected");
  });

  e.target.classList.add("selected");

  sortDate = id;
  history.pushState(null, null, `/${sortType}/${sortDate}`);
  resetCardList();
  loadboards();
});
