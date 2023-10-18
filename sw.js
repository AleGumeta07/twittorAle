//importaciones para usar metodos de un archivo 

importScripts ('js/sw-utils.js');

const STATIC_CACHE = 'static-v3';
const DINAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-va';

const APP_SHELL =[
    //'/', se comenta para poder subilo
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE =[
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

self.addEventListener('install',e =>{  //como ya hay constantes soo hay que remplazar
    const cacheStatic = caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SHELL)); //va abrir el archivo static 1 (o el nombre designado)
    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => cache.addAll(APP_SHELL_INMUTABLE));  //abre y añade los elementos
   
    e.waitUntil(Promise.all([cacheStatic,cacheInmutable]));  //devuelve los resultados de la promesa
});

//borra las caches viejas y se queda solamente con el nuevo 
self.addEventListener('activate',e =>{  //espera el skip (la orden)
    const respuesta=caches.keys().then(keys=>{ //ordena las caches y las va a leer si encuentra una distinta a la especificada
        keys.forEach(key=>{
            if(key!= STATIC_CACHE && key.includes('static')){
                return caches.delete(key);
            }
        });
    });
});

self.addEventListener('fetch',e =>{
    const respuesta = caches.match(e.request).then(resp=>{ //resuelve en el Response asociado con la primera solicitud coincidente en el objeto Cache
        if(resp){
            return resp;
        }else{
           // console.log(e.request.url);
           return fetch(e.request).then(newResp=>{
            return actualizaCacheDinamico(DINAMIC_CACHE,e.request,newResp);
           });
        }
    });
    e.respondWith(respuesta)
});















