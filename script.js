const searchInput = document.getElementsByClassName('search-input');
const apikey = "AIzaSyBiNHaAr63ao4E9YLSrirA9TM4j63yc4lU"

async function fetchVideos(searchValue){
        let endpoint = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${searchValue}&key=${apikey}`;
    try{
        let response = await fetch(endpoint);
        let result = await response.json();
        for(let i=0; i<result.items.length; i++){
            let video = result.items[i];
            let videoStats = await videoStatistics(video.id.videoId);
            if(videoStats.items.length === 0){
                result.items[i].videoStatistics = "NA";
            }
            else{
                result.items[i].videoStatistics =videoStats.items[0].statistics;
            }
        }
        populateSearchVideo(result.items);
    }catch(e){
        console.log(e);
    }
    
};

function populateSearchVideo(items){
    const searchContainer = document.getElementById('search-container');
    searchContainer.innerHTML='';
    for(let i=0; i<items.length; i++){
        let videoCard = document.createElement('div');
        videoCard.className = 'video-card';

        let data = items[i];
        let viewCount = data.videoStatistics.likeCount;
        if(viewCount > 1000 && viewCount < 1000000){
            if(viewCount%1000 !== 0){
                viewCount = `${(viewCount/1000).toFixed(1)}k`;
            }
            else viewCount = `${(viewCount/1000)}k`;
        }
        else if(viewCount > 1000000 && viewCount < 1000000000){
            if(viewCount%1000000 !== 0){
                viewCount = `${(viewCount/1000000).toFixed(1)}M`;
            }
            else viewCount = `${(viewCount/1000000)}M`;
        }
        else if(viewCount > 1000000000){
            if(viewCount%1000000000 !== 0){
                viewCount = `${(viewCount/1000000000).toFixed(1)}B`;
            }
            else viewCount = `${(viewCount/1000000000)}B`;
        }
        const videoChildern = 
        `<a href="https://www.youtube.com/watch?v=${data.id.videoId}">
        <img class="thumbnail style="width: 25%;" src="${data.snippet.thumbnails.high.url}"><div style="display: flex; gap: 10px;" class="video-card-detail">
        <div class="video-content">
        <img style="width: 25px; height: 25px;" src="./yt-shots.png" alt="">
        <div class="video-details">
            <p style="font-size: 15px;" class="title">${data.snippet.title}</p>
            <p style="font-size: small; margin-top:10px; color: grey" id="channel-name">${data.snippet.channelTitle}</p>
            <div style="display: flex; font-size: small; align-items: center; gap:5px;">
                <p style="color: grey">${viewCount} views</p>
                <li style="color: grey;">${calculatePublishDated(data.snippet.publishTime)}</li>
            </div>
            
        </div>
    </div>
        </a>`;
        videoCard.innerHTML = videoChildern;

        searchContainer.append(videoCard);
    }
};

function searchVideos(){
    let searchValue = searchInput.value;
    fetchVideos(searchValue);
}

async function videoStatistics(videoId){
    let endpoint = `https://youtube.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apikey}`;

    let response = await fetch(endpoint);
    let result = await response.json();
    return result;
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

window.onload = fetchVideos('js');


