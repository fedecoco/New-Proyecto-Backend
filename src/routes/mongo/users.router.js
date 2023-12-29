import { Router } from 'express';
import {registerController, loginController,adminView ,logoutController,logAuthenticate,gitHubCallbackController, getAllUsersController, updateUserController, findOneUserController, deleteUserController, imgProfileController,delAllInactiveUsersController, userDUController, userCDController, userECController, /* imgProdController */} from "../../controllers/user.controller.js";
import passport from 'passport';
import { upProdImg, upProfileImg, upUserDocs } from '../../utils.js';



const router = Router();


//Registramos al usuario en la base de datos MongoDB
router.post("/register", registerController );

//Actualizamos un usuario en la base de datos MongoDB
router.put('/update/:uid', updateUserController)

//Actualizamos un usuario en la base de datos MongoDB
router.get('/findOne/:uid', findOneUserController)

//Eliminar un usuario de la base de datos MongoDB
router.delete('/deleteOne/:uid', deleteUserController)

//Obtenemos todos los usuarios de la base de datos MongoDB
router.get('/allUsers', getAllUsersController )

//Obtenemos todos los usuarios inactivos de la base de datos MongoDB
router.delete('/inactiveUsers', delAllInactiveUsersController )

//Logueamos al usuario en la base de datos MongoDB
router.post('/login', loginController)

//Deslogueamos al usuario de la base de datos MongoDB
router.get('/logout', logoutController)

//subir img de perfil
router.post('/uploadAvatar/:user', upProfileImg.single('file'), imgProfileController)

//subir img de producto
/* router.post('/uploadProdImg/:user', upProdImg.single('file'), imgProdController) */

//subir documentos
router.post('/uploadDocs/du/:user', upUserDocs.single('du'), userDUController)
router.post('/uploadDocs/cd/:user', upUserDocs.single('cd'), userCDController)
router.post('/uploadDocs/ec/:user', upUserDocs.single('ec'), userECController)


//Logueo con GitHUb
router.get('/github', passport.authenticate('github', {scope: ['user:email']}))

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/github/error'}),gitHubCallbackController)

router.get('/error', (req, res) => {
    res.render('error', {error: "No se pudo autenticar el usuario usando GitHub"})
});

router.get("/fail-register", (req, res) => {
    res.status(401).send({ status: "error", message: "Error al registrar el usuario" })
})
router.get("/fail-login", (req, res) => {
    res.status(401).send({ status: "error", message: "Error al loguear el usuario" })
})


//Acceso a ruta privada
router.get('/private/:role', auth, (req, res) =>{
    res.render('admin')
});

//Acceso a ruta premium
router.get('/premium/:uid', )

//autenticación
function auth(req, res, next) {
    const role = req.params.role;

    
    if (role === "admin") {
        return next();
    } else {
        return res.status(403).send("Usuario no autorizado para ingresar a este recurso.");
    }
}
// Agregar las rutas en user.router.js
router.get("/", passport.authenticate('jwt', { session: true }), logAuthenticate);
router.delete('/', delAllInactiveUsersController); // Agregar la ruta para limpiar usuarios inactivos
router.get("/admin-view", auth, adminView);


export default router;

