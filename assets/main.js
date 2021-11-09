const $contenedorProductos = document.querySelector(".productos-contenedor");
const $fragment = document.createDocumentFragment();

const $templateFooter = document.querySelector(".template-footer").content;
const $templateCarrito = document.querySelector(".template-carrito").content;
const $items = document.querySelector("#articulos-tabla");
const $footer = document.querySelector("#footer-tabla");

let carritoDeCompra = JSON.parse(localStorage.getItem("carrito")) || {};

//CARGA DINAMICA DE LOS ARTICULOS MEDIANTE jquery

const cargarProductos = (productos) => {
  productos.forEach((art) => {
    $(".productos-contenedor").append(`

    <div class="productos-ind">
      <img src="${art.img}" alt="">
      <h3>${art.nombre}</h3>
      <div class="estrellas">
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
      </div>
      <div class="precios">
        <span>$${art.precio}</span>
        <p class="precio"></p>
      </div>
      <div class="cantidad">
        <span>Cantidad:</span>
        <input type="number" min="1" max="1000" value="1" name="" id="" class="cantidad">
        <span>/Kg</span>
      </div>
      <button type="button" class="btn" id="${art.id}">Agregar al Carrito</button>
    </div>
  `);
  });
};

//CARGA DINAMICA DE LOS ARTICULOS MEDIANTE AJAX/JQUERY
$.get("./productos.json", (res) => {
  cargarProductos(res);
});

// $("document").ready(() => {
//   //cargarProductos();
// });

$contenedorProductos.addEventListener("click", (e) => {
  agregarArticulo(e);
  e.stopPropagation();
});

$(".logo").fadeOut(1000).fadeIn(2000).css("color", "green");

const agregarArticulo = (e) => {
  if (e.target.classList.contains("btn")) {
    agregarACarrito(e.target.parentElement);
  }
  e.stopPropagation();
};

const agregarACarrito = (carrito) => {
  const articulo = {
    id: carrito.querySelector(".btn").dataset.id,
    nombre: carrito.querySelector("h3").textContent,
    precio: carrito.querySelector("p").textContent,
    cantidad: Number(carrito.querySelector("input").value),
    img: carrito.querySelector("img").src,
  };
  if (carritoDeCompra.hasOwnProperty(articulo.id)) {
    const cantidad = Number(carrito.querySelector("input").value);
    articulo.cantidad = carritoDeCompra[articulo.id].cantidad + cantidad;
  }
  carritoDeCompra[articulo.id] = { ...articulo };
  renderizarCarrito();
};

const renderizarCarrito = () => {
  $items.innerHTML = "";
  Object.values(carritoDeCompra).forEach((articulo) => {
    $templateCarrito.querySelector("img").setAttribute("src", articulo.img);
    $templateCarrito.querySelectorAll("td")[1].textContent = articulo.nombre;
    $templateCarrito.querySelectorAll("td")[2].textContent = articulo.cantidad;
    $templateCarrito.querySelector(".btn-carrito-agregar").dataset.id =
      articulo.id;
    $templateCarrito.querySelector(".btn-carrito-eliminar").dataset.id =
      articulo.id;
    $templateCarrito.querySelector("span").textContent =
      articulo.cantidad * articulo.precio;

    const clon = $templateCarrito.cloneNode(true);
    $fragment.appendChild(clon);
  });
  $items.appendChild($fragment);
  renderizarFooter();
  localStorage.setItem("carrito", JSON.stringify(carritoDeCompra));
};

const renderizarFooter = () => {
  $footer.innerHTML = "";
  if (Object.keys(carritoDeCompra).length === 0) {
    $footer.innerHTML = `
            <th scope="row" colspan="5">Comprate alguna Yerbita...</th>
            `;
    return;
  }
  const totalCarritoCantidades = Object.values(carritoDeCompra).reduce(
    (acum, { cantidad }) => acum + cantidad,
    0
  );
  const totalCarritoPrecio = Object.values(carritoDeCompra).reduce(
    (acum, { cantidad, precio }) => acum + cantidad * precio,
    0
  );
  $templateFooter.querySelectorAll("td")[1].textContent =
    totalCarritoCantidades;
  $templateFooter.querySelector("span").textContent = totalCarritoPrecio;

  const clon = $templateFooter.cloneNode(true);
  $fragment.appendChild(clon);
  $footer.appendChild($fragment);

  const $btnVaciarCarrito = (document.querySelector("#vaciar-carrito").onclick =
    vaciarCarrito);

  const $btnComprar = document.querySelector(".realizar");
  $btnComprar.addEventListener("click", (e) => {
    const okCompra = confirm("Confirma Compra?");
    if (okCompra) {
      alert("Gracias! Por su compra");
      vaciarCarrito();
    }
  });
};

const vaciarCarrito = () => {
  carritoDeCompra = {};
  renderizarCarrito();
};

$items.addEventListener("click", (e) => {
  btnAumentarOdisminuir(e);
});

const btnAumentarOdisminuir = (e) => {
  if (e.target.classList.contains("btn-carrito-agregar")) {
    const articulo = carritoDeCompra[e.target.dataset.id];
    articulo.cantidad++;

    renderizarCarrito();
  }
  if (e.target.classList.contains("btn-carrito-eliminar")) {
    const articulo = carritoDeCompra[e.target.dataset.id];
    articulo.cantidad--;
    if (articulo.cantidad === 0) {
      delete carritoDeCompra[e.target.dataset.id];
    }

    renderizarCarrito();
  }
  e.stopPropagation();
};

//WINDOW ONSCROLL- PARA HEADER FIJO.
const $header = document.querySelector(".header__nav");

window.onscroll = () => {
  if (window.scrollY > 100) {
    $header.classList.add("active");
  } else {
    $header.classList.remove("active");
  }
};
