const videoCardContainer = document.querySelector('.home-page-container');
const searchVideoCard = document.getElementById("serach-video-container");


const api_key1 = "AIzaSyBiNHaAr63ao4E9YLSrirA9TM4j63yc4lU";
const api_key2 = "AIzaSyBiNHaAr63ao4E9YLSrirA9TM4j63yc4lU";
const api_key3 = "AIzaSyBiNHaAr63ao4E9YLSrirA9TM4j63yc4lU";
const api_key4 = "AIzaSyBiNHaAr63ao4E9YLSrirA9TM4j63yc4lU";

let video_http = "https://www.googleapis.com/youtube/v3/videos?";
let channel_http = "https://www.googleapis.com/youtube/v3/channels?";


// homepage display

const showData = () => {
    videoCardContainer.innerHTML = "";
    searchVideoCard.innerHTML = "";
    fetch(video_http + new URLSearchParams({
        key: api_key1,
        part: 'snippet',
        chart: 'mostPopular',
        maxResults: 50,
        regionCode: 'IN'
    }))
    .then(res => res.json())
    .then( data => {
        data.items.forEach(item =>{
            getStatistics(item);
            getChannelIcon(item);
        })
    })
    .catch(err => console.log(err));
    
    const getChannelIcon = (video_data) => {
        fetch(channel_http + new URLSearchParams({
            key: api_key2,
            part: 'snippet',
            id: video_data.snippet.channelId
        }))
        .then(res => res.json())
        .then(data => {
            video_data.channelThumbnail = data.items[0].snippet.thumbnails.default.url;
        })
    }
    const getStatistics = (video_data) => {
        fetch(channel_http + new URLSearchParams({
            key: api_key3,
            part: 'statistics',
            id: video_data.snippet.channelId
        }))
        .then(res => res.json())
        .then(data => {
            video_data.videoStatistics = data.items[0].statistics;
            makeVideoCard(video_data);
        })
    }
}

showData();
// localStorage.setItem("", json.stringify(data))
function makeVideoCard(data) {
    // console.log("need : "+JSON.stringify(data));
    // console.log(data.videoStatistics.viewCount);
    //     let viewCount = data.videoStatistics.viewCount;
    //     if(viewCount > 1000 && viewCount < 1000000){
    //         if(viewCount%1000 !== 0){
    //             viewCount = `${(viewCount/1000).toFixed(1)}k`;
    //         }
    //         else viewCount = `${(viewCount/1000)}k`;
    //     }
    //     else if(viewCount > 1000000 && viewCount < 1000000000){
    //         if(viewCount%1000000 !== 0){
    //             viewCount = `${(viewCount/1000000).toFixed(1)}M`;
    //         }
    //         else viewCount = `${(viewCount/1000000)}M`;
    //     }
    //     else if(viewCount > 1000000000){
    //         if(viewCount%1000000000 !== 0){
    //             viewCount = `${(viewCount/1000000000).toFixed(1)}B`;
    //         }
    //         else viewCount = `${(viewCount/1000000000)}B`;
    //     }
    let viewCount = 0;
    videoCardContainer.innerHTML += `
    <div class="video"  onclick="location.href = 'HTML/individual_video.html?${data.id}'">
        <img src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt="">
        <div class="content">
            <img src="${data.channelThumbnail}" class="channel-icon" alt="">
            <div class="info">
                <h4 class="title">${data.snippet.title}</h4>
                <p class="channel-name">${data.snippet.channelTitle}</p>
                <p>${calculatePublishDated(data.snippet.publishTime)}</p>
            </div>
        </div>
    </div>
    `;
}


// search bar

const searchBtn = document.querySelector('.search-btn');


searchBtn.addEventListener('click', () => {
    
const searchInput = document.getElementById('search').value;
    console.log(searchInput)
    if(searchInput.length)
    {
        url = `https://www.googleapis.com/youtube/v3/search?q=${searchInput}&key=${api_key3}&type=video&maxResults=30&part=snippet`;
        videoCardContainer.innerHTML="";
        searchVideoCard.innerHTML = "";
        fetch(url)
        .then(res => res.json())
        .then(data => {
            data.items.forEach(item =>   {
                getChannelIcon(item);
            })
        })
        .catch(err => console.log(err));
        
        const getChannelIcon = (video_data) => {
            fetch(channel_http + new URLSearchParams({
                key: api_key3,
                part: 'snippet',
                id: video_data.snippet.channelId
            }))
            .then(res => res.json())
            .then(data => {
                video_data.channelThumbnail = data.items[0].snippet.thumbnails.default.url;
                makeSearchVideoCard(video_data);
            })
        }
    }
})

const makeSearchVideoCard = (data) => {
    searchVideoCard.innerHTML += `
    <div class="search-card"  onclick="location.href = 'HTML/individual_video.html?${data.id.videoId}'">
        <div class="thumbnail-cont">
            <img src="${data.snippet.thumbnails.high.url}" class="thumbnail2" />
        </div>
        <div>
            <h2 class="title2">${data.snippet.title}</h2>
            <div class="channelInfo">
                <img src="${data.channelThumbnail}" class="channel-icon"/>
                    &#183;
                <p class = "channel-name">${data.snippet.channelTitle}</p>
            </div>
            <p class="desc">${data.snippet.description.substring(0,200)}...</p>
        </div>
        </div>
    `;
}   

function calculatePublishDated(date) {
    // Parse the input string as a date
    const givenDate = new Date(date);
  
    // Get the current date
    const currentDate = new Date();
  
    // Calculate the time difference in milliseconds
    const timeDiff = Math.abs(givenDate.getTime() - currentDate.getTime());
  
    // Convert the time difference from milliseconds to days
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if(daysDiff > 365){
        return `${parseInt(daysDiff/365)} year ago`;
    }
    else if(daysDiff < 365 && daysDiff > 30){
        return `${parseInt(daysDiff/30)} months ago`;
    }
    else if(daysDiff === 0){
        return `${Math.ceil(timeDiff / (1000 * 3600))} hours ago`
    }
    else return `${daysDiff} days ago`;
}

  
