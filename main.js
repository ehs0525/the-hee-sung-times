let news = [];
let page = 1;
let total_pages = 0;
let menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByTopic(event))
);

let searchButton = document.getElementById("search-button");
let url;

// 각 함수에서 필요한 url을 만든다.
// api 호출 함수를 부른다
const getNews = async () => {
  try {
    let header = new Headers({
      "x-api-key": "buk7cWxDg1hETRnYDguATXFh4ONhc9GPPiLIC1k8hGo",
    });
    url.searchParams.set("page", page); // &page=
    let response = await fetch(url, { headers: header });
    let data = await response.json();
    if (response.status == 200) {
      if (data.total_hits == 0) {
        throw new Error("검색된 결과값이 없습니다.");
      }
      news = data.articles;
      total_pages = data.total_pages;
      page = data.page;
      console.log(news);
      render();
      pagination();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log("잡힌 에러는", error.message);
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=10`
  );
  getNews();
};

const getNewsByTopic = async (event) => {
  console.log("클릭됨", event.target.textContent);
  let topic = event.target.textContent.toLowerCase();
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`
  );
  getNews();
};

const getNewsByKeyword = async () => {
  // 1. 검색 키워드 읽어오기
  // 2. url에 검색 키워드 붙히기
  // 3. 헤더 준비
  // 4. url 부르기
  // 5. 데이터 가져오기
  // 6. 데이터 보여주기

  let keyword = document.getElementById("search-input").value;
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=1`
  );
  getNews();
};

const render = () => {
  let newsHTML = "";
  newsHTML = news
    .map((item) => {
      return `
        <div class="row news">
        <div class="col-lg-4">
        <img
        class="news-img-size"
        src="${item.media}"
        />
        </div>
        <div class="col-lg-8">
        <h2>${item.title}</h2>
        <p>
        ${item.summary}
        </p>
        <div>${item.rights} * ${item.published_date}</div>
        </div>
        </div>
        `;
    })
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (message) => {
  let errorHTML = `
    <div class="alert alert-danger text-center" role="alert">
      ${message}
    </div>
  `;
  document.getElementById("news-board").innerHTML = errorHTML;
};

// TODO : total page 3일 경우 3개의 페이지만 프린트하는 법 last, first
//        << >> 맨 처음, 맨 끝으로 가는 버튼 만들기
//        현재 그룹1일 때 << < 버튼 없애기
//        현재 마지막 그룹일 때 > >> 버튼 없애기
const pagination = () => {
  let paginationHTML = ``;

  // total_page, page, page group, last, first, first~last 페이지 프린트
  let pageGroup = Math.ceil(page / 5);
  let last = pageGroup * 5;
  let first = last - 4;

  paginationHTML = `
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${
        page - 1
      })">
      <span aria-hidden="true">&lt;</span>
    </a>
    </li>
  `;

  for (let i = first; i <= last; i++) {
    paginationHTML += `
      <li class="page-item ${
        page == i ? "active" : ""
      }"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>
    `;
  }

  paginationHTML += `
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${
        page + 1
      })>
        <span aria-hidden="true">&gt;</span>
      </a>
    </li>
  `;

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const moveToPage = (pageNum) => {
  // 1. 이동하고 싶은 페이지를 알아야함
  page = pageNum;

  // 2. 이동하고 싶은 페이지를 가지고 api를 다시 호출해주자
  getNews();
};

searchButton.addEventListener("click", getNewsByKeyword);
getLatestNews();
