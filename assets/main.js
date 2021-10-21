const arrayProductos = [
  { img: "assets/img/porongo.png", nombre: "Yerba Porongo", precio: 499 },
  { img: "assets/img/playadito.jpg", nombre: "Yerba Playadito", precio: 399 },
  { img: "assets/img/andresito.jpg", nombre: "Yerba Andresito", precio: 299 },
  { img: "assets/img/pipore.jpg", nombre: "Yerba Piporé", precio: 299 },
  { img: "assets/img/cbse.jpg", nombre: "Yerba CBSé", precio: 199 },
  { img: "assets/img/chamigo.png", nombre: "Yerba Chamigo", precio: 699 },
];
const $contenedorProductos = document.querySelector(".productos-contenedor");

//CARGA DINAMICA DE LOS ARTICULOS
arrayProductos.forEach((producto) => {
  const $div = document.createElement("div");
  $div.className = "productos-ind";
  $div.innerHTML = `
  <img src=${producto.img} alt="">
  <h3>${producto.nombre} </h3>
  <div class="estrellas">
    <i class="fas fa-star"></i>
    <i class="fas fa-star"></i>
    <i class="fas fa-star"></i>
    <i class="fas fa-star"></i>
    <i class="fas fa-star"></i>
  </div>
  <div class="precio">$${producto.precio} </div>
  <div class="cantidad">
    <span>Cantidad:</span>
    <input type="number" min="1" max="1000" value="1" name="" id="">
    <span>/Kg</span>
  </div>
  <button type="button">Agregar al Carrito</button>
  `;
  $contenedorProductos.appendChild($div);
});

//WINDOW ONSCROLL- PARA HEADER FIJO.
const $header = document.querySelector(".header__nav");
const $logo = document.querySelector(".logo_nav");
window.onscroll = () => {
  if (window.scrollY > 100) {
    $header.classList.add("active");
    $logo.classList.remove("oculto");
  } else {
    $header.classList.remove("active");
  }
};
