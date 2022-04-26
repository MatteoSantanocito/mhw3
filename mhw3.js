 //Libri di cucina
 function onJson(json){
    console.log('JSON ricevuto');

    const library = document.querySelector('#library');
    library.innerHTML = '';

    let num_results = json.num_found;

    if(num_results > 2)
    num_results = 2;

    for(let i = 0; i< num_results; i++)
    {
        const doc = json.docs[i]
        const title = doc.title;
        const isbn = doc.isbn[0];

        const cover_url = 'http://covers.openlibrary.org/b/isbn/' + isbn + '-M.jpg';

        const book = document.createElement('div');
        book.classList.add('book');

        const img = document.createElement('img');
        img.src = cover_url;
        
        const caption = document.createElement('span');
        caption.textContent = title;

        book.appendChild(img);
        book.appendChild(caption);
        library.appendChild(book);
    }
}

function onResponse(response){
    console.log('Risposta ricevuta');
    return response.json();
}
function OnError(error){
    console.log('Errore: '+ error)
}

function search(event)
{
    
    event.preventDefault();

    const author_input = document.querySelector('#author');
    const author_value = encodeURIComponent(author_input.value);
    console.log('Eseguo ricerca: ' + author_value);

    rest_url = 'http://openlibrary.org/search.json?author=' + author_value; //è l'endpoint
    console.log('URL: ' + rest_url);

    fetch(rest_url).then(onResponse).then(onJson);
}

const form_search = document.querySelector('.search_box form');
form_search.addEventListener('submit', search);


//Spotify
const Spotify_token_url= "https://accounts.spotify.com/api/token"
const Spotify_auth = "https://api.spotify.com/authorize"

const Spotify_Search = "https://api.spotify.com/v1/search?"
const ClientID= "4e5ec5f49f504198805e6bd7285f5253"
const ClientSecret = "e0fec4ef01344931835066c3344654c1"
let token_spotify = "";

function onBlur(event){
    console.log("blur")
    let input = document.querySelectorAll(".APIrest div input");
    for(let i=0; i<input.length; i++)
    {
        input[i].classList.remove("focus");
    }   

}

function onFocus(event){
    console.log("Focus")

    let input = event.currentTarget;
    input.classList.add("focus");
}


function onJSON_Spotify(json){
    console.log(json);
    let items = json.tracks.items;
    
    let i =json.tracks.limit;

    let random_n= Math.floor( Math.random()*(i));
    
    let sing = items[random_n].name;
    let artists = items[random_n].artists[0].name;
    
    const div = document.querySelector('.Spotify .result');
    div.innerHTML = '';

    const title = document.createElement("h1");
    const content = document.createElement("p");

    title.textContent="Canzone: \n" + sing;
    content.textContent="Artista: \n"+artists;

    title.classList.add("title_result");
    content.classList.add("content_result");

    div.appendChild(title);
    div.appendChild(content);

}

function sendRequestSpotifyAPI(event){

    event.preventDefault();

    const text_input = document.querySelector('#input_spotify');
    const text_value = encodeURIComponent(text_input.value);

    console.log(text_value);

    text=text_value;
    text_input.value="";

    let rest_spotify= Spotify_Search + "q=" + text + "&type=track";

    fetch(rest_spotify,{
        method: 'GET',
            headers:{
                'Authorization' : 'Bearer ' + token_spotify,
            }
        }
    ).then(onResponse, OnError).then(onJSON_Spotify);

}

function sendRequestSpotifyToken(event)
{
    fetch(Spotify_token_url,
    {
        method:"post",
        body: 'grant_type=client_credentials',
        headers:{
            'Content-Type' : 'application/x-www-form-urlencoded',
            'Authorization' : 'Basic ' + btoa(ClientID + ':' + ClientSecret)
        }
    }
    ).then(onTokenResponse).then(onTokenJson);
}

function onTokenJson(json)
{
  token_spotify = json.access_token;
  console.log(json);
  console.log(token_spotify);
}

function onTokenResponse(response) {
  return response.json();
}

let input_box= document.querySelectorAll(".Spotify div input");

for(let i=0; i<input_box.length; i++)
{
    input_box[i].addEventListener('blur', onBlur);
    input_box[i].addEventListener('focus', onFocus);
}

const form_spotify = document.querySelector('.Spotify form');
form_spotify.addEventListener('submit', sendRequestSpotifyAPI);

sendRequestSpotifyToken();