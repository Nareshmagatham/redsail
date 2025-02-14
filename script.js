const API_KEY = 'AIzaSyBPETcAKdCHl69_XKI3FiqCipIYAl8BufE';
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';
const VIDEO_DETAILS_URL = 'https://www.googleapis.com/youtube/v3/videos';

async function searchVideos() {
    const query = document.getElementById("search-input").value.trim();
    if (!query) {
        alert("Please enter a search query!");
        return;
    }

    const url = `${BASE_URL}?part=snippet&q=${encodeURIComponent(query)}&type=video,channel&maxResults=50&key=${API_KEY}`;

    try {
        console.log("Fetching videos from:", url);
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", data.error);
            alert("Error fetching videos. Please try again later.");
            return;
        }

        const videoIds = data.items.map(video => video.id.videoId).filter(id => id).join(",");
        if (videoIds) {
            fetchVideoDetails(data.items, videoIds);
        } else {
            displayVideos(data.items, new Map());
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        alert("Failed to fetch videos. Check your internet connection.");
    }
}

async function fetchVideoDetails(videos, videoIds) {
    if (!videoIds) {
        console.error("No valid video IDs found.");
        return;
    }

    const statsUrl = `${VIDEO_DETAILS_URL}?part=statistics,snippet&id=${videoIds}&key=${API_KEY}`;

    try {
        console.log("Fetching video details from:", statsUrl);
        const response = await fetch(statsUrl);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const statsData = await response.json();

        if (statsData.error) {
            console.error("API Error:", statsData.error);
            alert("YouTube API error: " + statsData.error.message);
            return;
        }

        const statsMap = new Map();
        statsData.items.forEach(video => {
            statsMap.set(video.id, {
                likes: video.statistics?.likeCount || 0,
                comments: video.statistics?.commentCount || 0,
                publishedAt: new Date(video.snippet.publishedAt).toDateString()
            });
        });

        displayVideos(videos, statsMap);
    } catch (error) {
        console.error("Fetch Error:", error);
        alert("Failed to fetch video details. Check your API key and quota.");
    }
}


function displayVideos(videos, statsMap) {
    const videoResults = document.getElementById("video-results");
    videoResults.innerHTML = "";

    videos.forEach(video => {
        const videoStats = statsMap.get(video.id.videoId) || {};
        const videoElement = document.createElement("div");
        videoElement.classList.add("video");

        videoElement.innerHTML = `
            <img src="${video.snippet.thumbnails.medium.url}" class="thumbnail" alt="Video Thumbnail" onclick="openVideoModal('${video.id.videoId}')">
            <div class="video-info">
                <div class="video-details">
                    <h4 class="video-title">${video.snippet.title}</h4>
                    <p class="channel-name">${video.snippet.channelTitle}</p>
                   
                </div>
            </div>
        `;

        videoResults.appendChild(videoElement);
    });
}


function openVideoModal(videoId) {
    const modal = document.getElementById("video-modal");
    const frame = document.getElementById("video-frame");
    
    frame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    modal.style.display = "flex"; 
}

function closeVideoModal() {
    const modal = document.getElementById("video-modal");
    const frame = document.getElementById("video-frame");
    frame.src = "";  
    modal.style.display = "none";
}

function closeAuthModal() {
    document.getElementById("authModal").style.display = "none";
    document.getElementById("message").innerText = "";
}


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("close-video-btn").addEventListener("click", closeVideoModal);
    document.getElementById("close-auth-btn").addEventListener("click", closeAuthModal);
});


function openAuthModal() {
    document.getElementById("authModal").style.display = "flex";
}


document.getElementById("Logo").addEventListener("click", function () {
    location.reload(); 
});

function closeAuthModal() {
    document.getElementById("authModal").style.display = "none";
    document.getElementById("message").innerText = "";
}


function switchToSignUp() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("signUpForm").style.display = "block";
    document.getElementById("modalTitle").innerText = "Sign Up";
}

function switchToLogin() {
    document.getElementById("signUpForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("modalTitle").innerText = "Login";
}


function signUp() {
    let name = document.getElementById("signUpName").value;
    if (name && document.getElementById("signUpEmail").value && document.getElementById("signUpPassword").value) {
        document.getElementById("message").innerText = "Account successfully created!";
        setTimeout(closeAuthModal, 2000);
    } else {  
        document.getElementById("message").innerText = "Please fill in all fields!";
    }
}


function login() {
    document.getElementById("authModal").style.display = "block";
    let name = document.getElementById("loginName").value;
    if (name && document.getElementById("loginEmail").value) {
        document.getElementById("message").innerText = `Welcome, ${name}!`;
        setTimeout(closeAuthModal, 2000);
    } else {
        document.getElementById("message").innerText = "Please fill in all fields!";
    }
}
