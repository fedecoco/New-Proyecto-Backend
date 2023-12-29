const form = document.getElementById('loginForm');
const pass = document.getElementById('pass');
const showPass = document.getElementById('showPass');

//request a la api de JWT
form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
            //aca se setean los headers para el acceso con jwt
        }
    }).then(result => {
        if (result.status === 200) {
            result.json()
            .then(json => { 
                window.location.replace('/users');
            } 
            )}
            else {
                alert('Usuario o contraseña incorrectos');
            };
    });
});

showPass.addEventListener('click', e => {
    e.preventDefault();
    if (pass.type === "password"){
        pass.setAttribute ('type', 'text');
    } else {
        pass.setAttribute ('type', "password") ;
    }
})