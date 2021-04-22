const gloAcademyList = document.querySelector(".glo-academy-list");
const trendingList = document.querySelector(".trending-list");
const musicList = document.querySelector(".music-list");
const API_KEY = "AIzaSyD0sMe0l_xe7aIxN1ctT4DoAvopRwX1QaA";
const CLIENT_ID = "118018668082-irallb30fmncoc0n9uih2lp0rlq5dsek.apps.googleusercontent.com";
const SECRET = "Xkc-1KluTwdslirpazaLx7ya";

const createCard = (dataVideo) => {
        const imgUrl = dataVideo.snippet.thumbnails.high.url;
        const videoId = typeof dataVideo.id === "string" ? dataVideo.id : dataVideo.id.videoId;
        const titleVideo = dataVideo.snippet.title;
        const dateVideo = dataVideo.snippet.publishedAt;
        const chanelTitle = dataVideo.snippet.channelTitle;
        const card = document.createElement("li");
        card.classList.add("video-card");
        card.innerHTML = `                    
      <div class="video-thumb">
        <a class="link-video youtube-modal" href="https://www.youtube.com/watch?v=${videoId}">
            <img src="${imgUrl}" alt="" class="thumbnail">
        </a>
    </div>
    <h3 class="video-title">${titleVideo}</h3>
    <div class="video-info">
    ${dataVideo.statistics ? `<span class="video-views">${Math.floor(dataVideo.statistics.viewCount/1000)}k views</span>` : ""}
        <span class="video-counter"><span class="video-date">${dateVideo}</span></span>
        <span class="video-channel">${chanelTitle}</span>
    </div>
`
    return card;
}

const createList = (wrapper, listVideo = []) => {
    // Очищаем
    wrapper.textContent = "";
    for (let item of listVideo) {
        const card = createCard(item);
        wrapper.append(card);
    }
}

createList(gloAcademyList, gloAcademy);
createList(trendingList, trending);
createList(musicList, music);

// Реализация через API

const authButton = document.querySelector(".auth-btn");
const userAvatar = document.querySelector(".user-avatar");

const handleSucessAuth = data => {
    console.log(data);
    authButton.classList.add("hide");
    userAvatar.classList.remove('hide');
    userAvatar.src = data.getImageUrl();
    userAvatar.alt = '';
    getChanel();
}

const handleNoAuth = () => {
    authButton.classList.remove("hide");
    userAvatar.classList.add('hide');
    userAvatar.src = '';
    userAvatar.alt = '';
}

const handleAuth = () => {
    gapi.auth2.getAuthInstance().signIn();
}

const handleSignOut = () => {
    gapi.auth2.getAuthInstance().signOut();
}

const updateStatusAuth = data => {
    data.isSignedIn.listen(() => {
        updateStatusAuth(data);
    })
    if (data.isSignedIn.get()) {
        const userData = data.currentUser.get().getBasicProfile();
        handleSucessAuth(userData);
    } else {
        handleNoAuth();
    }
};

function initClient() {
    gapi.client.init({
        'clientId': CLIENT_ID,
        'scope': 'https://www.googleapis.com/auth/youtube.readonly',
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
    }).then(() => {
        updateStatusAuth(gapi.auth2.getAuthInstance());
        authButton.addEventListener('click', handleAuth);
        userAvatar.addEventListener('click', handleSignOut);
    });
  }

  gapi.load('client:auth2', initClient);

  const getChanel = () => {
    gapi.client.youtube.channels.list({
        part: 'snippet, contentDetails, statistics',
        // ID канала
        id: 'UCVswRUcKC-M35RzgPRv8qUg',
    }).then((response) => {
        console.log(response);
    })
  }