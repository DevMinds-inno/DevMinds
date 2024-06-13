const loadingdummy = document.getElementById("loading-dummy");
const cardList = document.getElementById("card-list");
const sortLike = document.getElementById("like");
const sortRecent = document.getElementById("recent");
const underLine = document.querySelector(".sort-bar-underline");
const PER_PAGE = 12; // 한번에 가져올 페이지개수

// 변수공간
let sortType = "recent"; //기본정렬값
let page = 1; // 기본페이지
let hasMoreData = true; //데이터를 더 가져올 수 있는지 여부
let isLoading = false;

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
              <div class="card-main-content dummy"></div>
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

// 더미 초기화 함수
const hideDummy = () => {
  loadingdummy.style.display = "none";
};

// boards 가져오기함수
const loadboards = async () => {
  // 로딩중이거나 가져올 데이터가 없을 때
  if (isLoading || !hasMoreData) return;

  isLoading = true;

  if (isLoading) {
    loadingdummy.style.display = "grid";
  }

  try {
    const response = await fetch(
      `/boards?sortType=${sortType}&page=${page}&per_page=${PER_PAGE}`
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

    data.forEach((board) => {
      const postElement = document.createElement("li");
      postElement.classList.add("card");
      postElement.innerHTML = `
          <a href="">
            <div class="card-image-box">
              <img class="card-image" src="" alt="" />
            </div>
          </a>
          <div class="card-main">
          <div>${board.id}</div>
            <div class="card-main-title">${board.title}</div>
            <div class="card-main-content">${board.content}</div>
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
            <div class="card-footer-like">좋아요수: 0</div>
          </div>
          `;
      cardList.appendChild(postElement);
    });

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

// 좋아요 정렬 버튼 클릭 시
sortLike.addEventListener("click", () => changeSortType("like"));

// 최신순 정렬 버튼 클릭 시
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

  cardList.innerHTML = ""; // 리스트 초기화
  page = 1; // 기본페이지
  sortType = type; // 정렬 타입 설정
  loadboards(); // 게시물 로드 함수 호출 (loadPosts -> loadboards로 이름을 수정했음)
};

window.addEventListener("scroll", handleScroll);
document.addEventListener("DOMContentLoaded", () => {
  createLoadingDummy();
  loadboards();
});
