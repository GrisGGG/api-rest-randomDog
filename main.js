//Instancia de axios
const api = axios.create({
    baseURL: 'https://api.thedogapi.com/v1',
    headers: { 'x-api-key': '7d61f0a3-e3c3-4c2c-84c5-0c5b32d127ad' }
});
//Configuraciones de la api
const API_URL_RANDOM = 'https://api.thedogapi.com/v1/images/search?limit=4';
const API_URL_FAVORITES = 'https://api.thedogapi.com/v1/favourites';
const API_URL_FAVORITES_DELETE = (id) => `https://api.thedogapi.com/v1/favourites/${id}`;
const API_URL_UPLOAD = 'https://api.thedogapi.com/v1/images/upload';

//Elemento de error
const spanError = document.getElementById('error')
/*Configuración de api con fetch
fetch(URL)// fetch nos devuelve una promesa y las promesas podemos resolverlas con el método then
    .then(res => res.json())//La respuesta de la api debemos convertirla a algo que js pueda entender como un objeto
    .then(data => {// la respuesta es una promesa, en este then ya vamos a objener los datos
        const img = document.querySelector('img'); //Seleccionamos el elemento img de html
        img.src= data.message; //cambiamos el atributo src a la imágen de la api que esta en el atributo message
    });
*/
async function loadRandomPerritos() {
    const res = await fetch(API_URL_RANDOM)// La promesa que devuelve ferch se guarda en una constante llamada res, como esta variable tiene un llamada asincrono, le colocamos la palabra await
    const data = await res.json() // llamado asincrono del llamado json de nuestra respuesta
    if (res.status !== 200) {
        spanError.innerHTML = 'Hubo un error Random' + res.status
    } else {
        const img = document.getElementById('img1');
        const img1 = document.getElementById('img2');
        const img2 = document.getElementById('img3');
        const img3 = document.getElementById('img4');
        const btnRandom1 = document.getElementById('btnRandom1');
        const btnRandom2 = document.getElementById('btnRandom2');
        const btnRandom3 = document.getElementById('btnRandom3');
        const btnRandom4 = document.getElementById('btnRandom4');
        img.src = data[0].url;
        img1.src = data[1].url
        img2.src = data[2].url;
        img3.src = data[3].url;
        btnRandom1.onclick = () => saveFavouritesPerritos(data[0].id)
        btnRandom2.onclick = () => saveFavouritesPerritos(data[1].id)
        btnRandom3.onclick = () => saveFavouritesPerritos(data[2].id)
        btnRandom4.onclick = () => saveFavouritesPerritos(data[3].id)


    }
}


async function favoritesPerritos() {
    const res = await fetch(API_URL_FAVORITES, {
        method: 'GET',
        headers: {
            'x-api-key': '7d61f0a3-e3c3-4c2c-84c5-0c5b32d127ad'
        },
    })// La promesa que devuelve ferch se guarda en una constante llamada res, como esta cariable tiene un llamada asincrono, le colocamos la palabra await
    const data = await res.json() // llamado asincrono del llamado json de nuestra respuesta
    if (res.status !== 200) {
        spanError.innerHTML = "Hubo un error" + res.status;
    } else {
        const section = document.getElementById('favoritesDogs');
        section.innerHTML = ""
        const h2 = document.createElement('h2')
        // const h2Text = document.createTextNode('Perritos Favoritos')
        // h2.appendChild(h2Text)
        // section.appendChild(h2)

        data.forEach(perrito => {
            const article = document.createElement('article');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnText = document.createTextNode('Remove 💖');

            img.src = perrito.image.url;
            img.width = 200;
            img.height = 250;
            btn.appendChild(btnText);
            btn.onclick = () => deleteFavoritesPerritos(perrito.id)

            article.appendChild(img);
            article.appendChild(btn);
            section.appendChild(article)
        });
    }
}

async function saveFavouritesPerritos(id) {
    const { data, status } = await api.post('/favourites', {
        image_id: id
    });

    // const res = await fetch(API_URL_FAVORITES, {
    //     method: 'POST',
    //     headers:{
    //         'Content-Type': 'application/json',
    //         'x-api-key' : '7d61f0a3-e3c3-4c2c-84c5-0c5b32d127ad'
    //     },
    //     body: JSON.stringify({
    //     image_id: id
    //     }),
    // });
    // const data = await res.json();
    // console.log(res);``
    if (status !== 200) {
        console.log(status + "más" + data.message);
    }
    console.log(data);
    favoritesPerritos()

}

async function deleteFavoritesPerritos(id) {
    const res = await fetch(API_URL_FAVORITES_DELETE(id), {
        method: 'DELETE',
        headers: {
            'x-api-key': '7d61f0a3-e3c3-4c2c-84c5-0c5b32d127ad'
        }
    })
    const data = await res.json()
    if (res.status !== 200) {
        console.log(res.status + "delete" + data.message);
    } else {
        console.log("Elemento borrado");
        favoritesPerritos()
    }
}
async function uploadPerritoFoto() {
    const form = document.getElementById('uploadingForm')
    const formData = new FormData(form);
    const res = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        headers: {
            'x-api-key': '7d61f0a3-e3c3-4c2c-84c5-0c5b32d127ad'
        },
        body: formData,
    })
    const data = await res.json()
    if (res.status !== 201) {
        spanError.innerHTML = `Hubo un error al subir al perrito: ${res.status} ${data.message}`
    }
    else {
        console.log("Foto de michi cargada :)");
        console.log({ data });
        console.log(data.url);
        saveFavouritesPerritos(data.id) //para agregar el michi cargado a favoritos.
        favoritesPerritos()
    }
}

loadRandomPerritos() //Se llama cuando se carga la página
favoritesPerritos()
//

