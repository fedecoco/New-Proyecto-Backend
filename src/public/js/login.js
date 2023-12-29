document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const pass = document.getElementById('pass');
    const showPass = document.getElementById('showPass');

    // Verifica que los elementos existan antes de agregar eventos
    if (form && pass && showPass) {
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
                    
                }
            }).then(result => {
                if (result.status === 200) {
                    result.json()
                        .then(json => {
                            // Si la autenticación es exitosa, redirige a la página deseada
                            window.location.replace('/users');
                        });
                } else {
                    // Si la autenticación falla, muestra un mensaje de error al usuario
                    alert('Usuario o contraseña incorrectos');
                }
            }).catch(error => {
                console.error('Error en la solicitud:', error);
                // Muestra un mensaje de error al usuario
                alert('Error en la solicitud. Por favor, inténtelo de nuevo.');
            });
        });

        // Verifica que showPass no sea null antes de agregar el evento click
        if (showPass) {
            showPass.addEventListener('click', e => {
                e.preventDefault();
                if (pass.type === "password") {
                    pass.setAttribute('type', 'text');
                } else {
                    pass.setAttribute('type', 'password');
                }
            });
        }
    }
});
