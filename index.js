
const API_KEY= "d0a0973ab893b8084fec7038ae4e47b4";
const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
const errScr=document.querySelector(".errorscr");

//variables
let currentTab=userTab;

currentTab.classList.add("current-tab");
getFromSessionStorage();

function switchTab(clickedTab){
   
    if (clickedTab!=currentTab) {
        errScr.classList.remove("active");
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");
        

        if(!searchForm.classList.contains("active")){
        //kya search wala invisible tha, agar tha to visible kardo
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
        // pehle se search wale me tha ab your weather me jana tha
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //now in your weather tab so we have to display the data
            //we will check local storage if data(co-ordinates) is stored
            getFromSessionStorage();
        }
    }
    
}
userTab.addEventListener("click",()=>{
    switchTab(userTab);
})

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
})

function getFromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    //make grant access tab invisisble
    grantAccessContainer.classList.remove("active");
    //show loading screen
    loadingScreen.classList.add("active");

    //api call
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const  data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");

        

    }
}

function renderWeatherInfo(info){
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weaterDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windSpeed=document.querySelector("[data-windSpeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-clouds]");
    console.log(info);

    cityName.innerText=info?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${info?.sys?.country.toLowerCase()}.png`;
    desc.innerText=info?.weather[0]?.description;
    weatherIcon.src=`https://openweathermap.org/img/w/${info?.weather?.[0]?.icon}.png`;
    temp.innerText=`${info?.main?.temp} °C`;
    windSpeed.innerText=`${info?.wind?.speed} m/s`;
    humidity.innerText=`${info?.main?.humidity} %`;
    cloudiness.innerText=`${info?.clouds?.all} %`;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);

    }
    else{
        alert("No gelolocation support available")
    }
}

function showPosition(position) {
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates)
}

const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);
const searchInput=document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName===""){
        return ;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city){
    errScr.classList.remove("active");
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try {
        const res=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await res.json();
        
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (error) {
        errScr.classList.add("active");
        userInfoContainer.classList.remove("active");
    }
    
}
