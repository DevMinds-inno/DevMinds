const loadingdummy = document.getElementById("loading-dummy");
const cardList = document.getElementById("card-list");
const sortLike = document.getElementById("like");
const sortRecent = document.getElementById("recent");
const underLine = document.querySelector(".sort-bar-underline");
let sortType = "recent"; //기본정렬값
let page = 1; // 기본페이지

// 로딩 더미 생성 함수
const createLoadingDummy = () => {
  Array.from({ length: 20 }).forEach(() => {
    const postElement = document.createElement("li");
    postElement.classList.add("card");
    postElement.innerHTML = `
            <a href="">
              <div class="card-image-box dummy">
                <img class="dummy-card-image"/>
              </div>
            </a>
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

// // 로딩 더미 초기 생성
// createLoadingDummy();

/* posts가져오기함수 */
const loadPosts = async () => {
  //   loadingdummy.style.display = "block"; // 로딩화면 보이기

  try {
    const perPage = 20; // 한번에 가져올 페이지개수
    const response = await fetch(
      `/posts?sortType=${sortType}&page=${page}&per_page=${perPage}`
    );
    if (!response.ok) {
      throw new Error("요청 오류");
    }
    const data = await response.json();
    console.log(data);

    // if (!data) {
    //   cardList.innerHTML = "";
    //   const postElement = document.createElement("div");
    //   postElement.textContent = "게시물이 없습니다.";
    //   cardList.appendChild(postElement);
    //   return;
    // }

    data.forEach((post) => {
      const postElement = document.createElement("li");
      postElement.classList.add("card");
      postElement.innerHTML = `
          <a href="">
            <div class="card-image-box">
              <img class="card-image" src="" alt="" />
            </div>
          </a>
          <div class="card-main">
          <div>${post.id}</div>
            <div class="card-main-title">${post.title}</div>
            <div class="card-main-content">${post.content}</div>
            <div class="card-sub-info">
              <span class="card-date">${post.updated_dttm}</span>
              <span>·</span>
              <span>댓글수</span>
            </div>
          </div>
          <div class="card-footer">
            <div class="card-footer-user">
              by <span>${post.writer}</span>
            </div>
            <div class="card-footer-like">좋아요수: 0</div>
          </div>
          `;
      cardList.appendChild(postElement);
    });
    page++; // 페이지 증가
  } catch (e) {
    console.log("에러발생", e);
  } finally {
    loadingdummy.style.display = "none"; // 로딩화면 숨기기
  }
};

const handleScroll = () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    console.log("추가 포스트를 불러오는중...");
    loadPosts();
  }
};

window.addEventListener("scroll", handleScroll);

// 초기 데이터 불러오기
setTimeout(() => loadPosts(true), 1000);

// 좋아요 정렬 버튼 클릭 시
sortLike.addEventListener("click", function () {
  underLine.style.left = "3%";
  this.classList.add("sort-active");
  sortRecent.classList.remove("sort-active");
  sortType = "like";
  cardList.innerHTML = ""; // 리스트 초기화
  page = 1; // 기본페이지
  loadPosts();
});

// 최신순 정렬 버튼 클릭 시
sortRecent.addEventListener("click", function () {
  underLine.style.left = "44%";
  sortType = "recent";
  this.classList.add("sort-active");
  sortLike.classList.remove("sort-active");
  cardList.innerHTML = ""; // 리스트 초기화
  page = 1; // 기본페이지
  loadPosts();
});
