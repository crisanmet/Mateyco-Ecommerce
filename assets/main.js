const arrayProductos = [
  {
    id: 1,
    img: "assets/img/porongo.png",
    nombre: "Yerba Porongo",
    precio: 499,
  },
  {
    id: 2,
    img: "assets/img/playadito.jpg",
    nombre: "Yerba Playadito",
    precio: 399,
  },
  {
    id: 3,
    img: "assets/img/andresito.jpg",
    nombre: "Yerba Andresito",
    precio: 299,
  },
  { id: 4, img: "assets/img/pipore.jpg", nombre: "Yerba Piporé", precio: 299 },
  { id: 5, img: "assets/img/cbse.jpg", nombre: "Yerba CBSé", precio: 199 },
  {
    id: 6,
    img: "assets/img/chamigo.png",
    nombre: "Yerba Chamigo",
    precio: 699,
  },
];
const $contenedorProductos = document.querySelector(".productos-contenedor");
const $fragment = document.createDocumentFragment();
const $template = document.querySelector(".template-productos").content;
const $templateFooter = document.querySelector(".template-footer").content;
const $templateCarrito = document.querySelector(".template-carrito").content;
const $items = document.querySelector("#articulos-tabla");
const $footer = document.querySelector("#footer-tabla");

let carritoDeCompra = JSON.parse(localStorage.getItem("carrito")) || {};

//CARGA DINAMICA DE LOS ARTICULOS MEDIANTE TEMPLATE Y FRAGMENT
arrayProductos.forEach((producto) => {
  $template.querySelector("h3").textContent = producto.nombre;
  $template.querySelector("p").textContent = producto.precio;
  $template.querySelector("button").dataset.id = producto.id;
  $template.querySelector("img").setAttribute("src", producto.img);

  const clon = $template.cloneNode(true);
  $fragment.appendChild(clon);
});
$contenedorProductos.appendChild($fragment);

$contenedorProductos.addEventListener("click", (e) => {
  agregarArticulo(e);
  e.stopPropagation();
});

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
