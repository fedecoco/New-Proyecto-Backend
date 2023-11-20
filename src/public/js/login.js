const form = document.getElementById('loginForm');

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
            else if (result.status === 401) {
                alert('Usuario o contraseña incorrectos');
            };
    });
});