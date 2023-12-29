const form = document.getElementById('registerForm');
const pass = document.getElementById('pass');
const showPass = document.getElementById('showPass');


form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    console.log("Objeto formado:");
    console.log(obj);

    fetch('/api/users/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }

    }).then(result => {
        if (result.status === 200) {
            alert("Usuario creado con exito");
            window.location.replace('/users/login')
        }else if (result.status === 401) {
            alert("El Email ya se encuentra registrado");
        }
    })
})



//Mostrar contraseña
showPass.addEventListener('click', e => {
    e.preventDefault();
    if (pass.type === "password"){
        pass.setAttribute ('type', 'text');
    } else {
        pass.setAttribute ('type', "password") ;
    }
})