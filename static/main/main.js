const mainElement = document.querySelector("main");
const loadingdummy = document.getElementById("loading-dummy");
const cardList = document.getElementById("card-list");
const sortLike = document.getElementById("like");
const sortRecent = document.getElementById("recent");
const underLine = document.querySelector(".sort-bar-underline");
const selectButton = document.querySelector(".home-tag-right-selecter");
const selectValue = document.querySelector(".home-tag-right-value");
const selectBar = document.querySelector(".home-tag-right-selecter-bar");
const selectBarList = document.querySelector(".home-tag-right-list");
const notBoardsBox = document.querySelector(".notBoards");
const pathParts = window.location.pathname.split("/");
const PER_PAGE = 8; // 한번에 가져올 페이지개수

// 변수
let sortType = pathParts[1];
let sortDate = pathParts[2];
let page = 1; // 기본페이지
let hasMoreData = true; //데이터를 더 가져올 수 있는지 여부
let isLoading = false;
let isVisible = false; //셀렉트바 가시성

// 더미 생성 함수
const createLoadingDummy = () => {
  loadingdummy.innerHTML = "";
  const dummyElements = new Array(PER_PAGE).fill().map(() => {
    const postElement = document.createElement("li");
    postElement.classList.add("card");
    postElement.innerHTML = `
      <span>
        <div class="card-image-box dummy">
          <img class="dummy-card-image"/>
        </div>
      </span>
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
    return postElement;
  });
  loadingdummy.append(...dummyElements);
};

// boardList 생성 함수
const createBoardList = (data) => {
  data.forEach((board) => {
    const postElement = document.createElement("li");
    postElement.classList.add("card");
    postElement.innerHTML = `
        ${
          board.img_src &&
          `
          <a href="/boards/${board.id}">
            <div class="card-image-box">
              <img class="card-image" src="${board.img_src}" alt="${board.title}_image" />
            </div>
          </a>
          `
        }
        <div class="card-main">
          <a href="/boards/${board.id}">
            <h4 class="card-main-title">${board.title}</h4>
            <div class="card-main-content">
              <p>${board.intro}</p>
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
const hideDummy = () => (loadingdummy.style.display = "none");

// boardList 초기화 함수
const resetBoardList = () => {
  cardList.innerHTML = "";
  page = 1;
  hasMoreData = true;
};

// boardList 요청 함수
const loadboards = async () => {
  notBoardsBox.classList.remove("visible");

  // 로딩중이거나 가져올 데이터가 없을 때
  if (isLoading || !hasMoreData) return;

  isLoading = true;

  if (isLoading) {
    loadingdummy.style.display = "grid";
  }

  try {
    const response = await fetch(
      `/api/boards/${sortType || "recent"}/${
        sortDate || "week"
      }?&page=${page}&per_page=${PER_PAGE}`
    );

    if (!response.ok) {
      throw new Error("요청 오류");
    }

    const data = await response.json();

    // 데이터 여부에 따른 화면
    if (data.length === 0) {
      hasMoreData = false;
      hideDummy();
      notBoardsBox.classList.add("visible");
    } else {
      notBoardsBox.classList.remove("visible");
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
  const childrenArray = selectBarList.children;
  const filterElement = [...childrenArray].find(
    (element) => sortDate === element.id
  );

  selectValue.textContent = filterElement
    ? filterElement.textContent
    : "이번주";

  if (filterElement) {
    [...childrenArray].forEach((element) => {
      element.classList.remove("selected");
    });

    filterElement.classList.add("selected");
  }

  createLoadingDummy();
  resetBoardList();
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
  resetBoardList();
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

const showSelectBar = () => selectBar.classList.add("visible");
const hideSelectBar = () => selectBar.classList.remove("visible");

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
  const { id, textContent } = e.target;
  selectValue.textContent = textContent;

  e.target.classList.add("selected");
  [...selectBarList.children].forEach((element) => {
    if (element !== e.target) {
      element.classList.remove("selected");
    }
  });

  sortDate = id;
  hideSelectBar();
  history.pushState(null, null, `/${sortType}/${sortDate}`);

  resetBoardList();
  loadboards();
});
