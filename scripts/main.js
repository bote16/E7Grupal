const url = "https://6361a89e67d3b7a0a6cabf15.mockapi.io/users";
let btnBuscar = document.getElementById("btnGet1");
const resultados = document.getElementById("results");
const btnAdd = document.getElementById("btnPost");
const btnModify = document.getElementById("btnPut");
const btnDelete = document.getElementById("btnDelete");
const divAlert = document.getElementById("alertaError");

const checkContenidoModificar = function (event) {
  let input = event.target;
  if (!input.value !== "") {
    btnModify.removeAttribute("disabled");
  } else {
    return;
  }
};

const checkContenidoDelete = function (event) {
  let input = event.target;
  if (!input.value !== "") {
    btnDelete.removeAttribute("disabled");
  } else {
    return;
  }
};

const checkContenidoAgregar = function (event) {
  let name = document.getElementById("inputPostNombre").value;
  let lastname = document.getElementById("inputPostApellido").value;
  if (name === "") {
    return;
  } else if (lastname === "") {
    return;
  } else {
    btnAdd.removeAttribute("disabled");
  }
};

async function getData(url) {
  let res = await fetch(url);
  if (res.ok) {
    let data = await res.json();
    return data;
  } else {
    console.log(res.statusText);
  }
}

//remover elemento del dom, crearlo cada vez que hay status distinto a success
const esconderAlerta = function () {
  let alert = document.querySelector(".alert-danger");
  setInterval(() => {
    alert.remove();
  }, 2000);
};

document.addEventListener("DOMContentLoaded", async function () {
  btnBuscar.addEventListener("click", async () => {
    const inputBuscar = document.getElementById("inputGet1Id");
    let index = inputBuscar.value;
    if (index == undefined || index == "") {
      let data = await getData(url);
      let htmlContentToAppend = ``;
      for (let i = 0; i < data.length; i++) {
        let el = data[i];
        htmlContentToAppend += `
            <li>ID: ${el.id}</li>
            <li>NAME:  ${el.name}</li>
            <li>LASTNAME:  ${el.lastname}</li>
            `;
      }
      resultados.innerHTML = htmlContentToAppend;
    } else {
      let url2 = url + "/" + index;
      let data = await getData(url2);
      if (data == undefined) {
        let a = document.createElement("div");
        a.classList.add("alert");
        a.classList.add("alert-danger");
        a.innerText = "Algo salió mal...";
        document.querySelector("#body").appendChild(a);
        window.setTimeout(esconderAlerta(), 5000);
      } else {
        let htmlContentToAppend = `<li>ID: ${data.id}</li>
        <li>NAME:  ${data.name}</li>
        <li>LASTNAME:  ${data.lastname}</li>`;
        resultados.innerHTML = htmlContentToAppend;
      }
    }
  });

  btnDelete.addEventListener("click", async () => {
    let index = document.getElementById("inputDelete").value;
    const res = await fetch(url + "/" + index, {
      method: "DELETE",
    });

    if (res.ok) {
      let data = await getData(url);
      let htmlContentToAppend = ``;
      for (let i = 0; i < data.length; i++) {
        let el = data[i];
        htmlContentToAppend += `
                    <li>ID: ${el.id}</li>
                    <li>NAME:  ${el.name}</li>
                    <li>LASTNAME:  ${el.lastname}</li>
                    `;
      }
      resultados.innerHTML = htmlContentToAppend;
    } else if (res.status != 200) {
      let a = document.createElement("div");
      a.classList.add("alert");
      a.classList.add("alert-danger");
      a.innerText = "Algo salió mal...";
      document.querySelector("#body").appendChild(a);
      window.setTimeout(esconderAlerta(), 5000);
    }
  });

  btnModify.addEventListener("click", async () => {
    let index = document.getElementById("inputPutId").value;
    let name = document.getElementById("inputPutNombre");
    let lastname = document.getElementById("inputPutApellido");
    let btnModalGuardar = document.getElementById("btnSendChanges");
    let res = await getData(url + "/" + index);
    if (res == undefined) {
      let a = document.createElement("div");
      a.classList.add("alert");
      a.classList.add("alert-danger");
      a.innerText = "El objeto que desea modificar no existe...";
      document.querySelector(".modal-body").appendChild(a);
      window.setTimeout(() => {
        document.querySelector(".modal-body").removeChild(a);
      }, 5000);
    } else {
      btnModify.setAttribute("data-bs-target", "#dataModal");
      btnModalGuardar.setAttribute("disabled", "disabled");
      if (!name.value === "" && !lastname.value === "") {
        btnAdd.addEventListener("click", async () => {
          let name = document.getElementById("inputPostNombre").value;
          let lastname = document.getElementById("inputPostApellido").value;
          let obj = {
            name: name,
            lastname: lastname,
          };

          const resp = await fetch(url, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(obj),
          });

          let data = await getData(url);
          let htmlContentToAppend = ``;
          for (let i = 0; i < data.length; i++) {
            let el = data[i];
            htmlContentToAppend += `
                      <li>ID: ${el.id}</li>
                      <li>NAME:  ${el.name}</li>
                      <li>LASTNAME:  ${el.lastname}</li>
                      `;
          }
          resultados.innerHTML = htmlContentToAppend;
          btnModalGuardar.setAttribute("disabled", "disabled");
        });
      }
    }
  });
});
