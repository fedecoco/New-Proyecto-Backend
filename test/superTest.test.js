import chai from "chai";
import supertest from "supertest";
import userModel from "../src/services/dao/mongo/models/userModel.js";
import{CartModel}  from "../src/services/dao/mongo/models/cartModel.js";

const expect = chai.expect;
const requester = supertest("http://localhost:9090");

const idProd = "64f017f75d2d6ec97df7f858"
const idProd2 = "64f017f75d2d6ec97df7f859"
const idCart = "64efa2f083cc181932b9e7e4"
const userData = {
    userId :"64f8fd6ad888f4f6fb9382c2",
    products: [],    
    }
let idProdCreado;
let idCartCreado;
let idUserCreado;
let cookie;

const userTest = {
    first_name: "Test",
    last_name: "Test",
    email: "Test",
    age: 1,
    password: "XXXX",
}

const productTest = {
    title: "Test",
    description: "Test",
    price: 1,
    thumbnail: "Test",
    code: "Test",
    stock: 1,
    available: true
};

const productTestUpdate = {
    title: "Test",
    description: "Test",
    price: 1,
    thumbnail: "Test",
    code: "Test",
    stock: 9,
    available: true
}


describe("testing App", () => {

    describe("Test api/products", ()=>{
        it("Debe retornar todos los productos", async ()=>{
            const {statusCode, _body} = await requester.get("/api/products");
            expect(statusCode).to.eql(200);
            expect(_body).is.ok.and.not.empty;
            expect(_body).to.be.an("object");
        
        });
        it("Debe retornar un producto por id", async ()=>{
            const {statusCode, _body} = await requester.get(`/api/products/findOne/${idProd}`);
            expect(statusCode).to.eql(200);
            expect(_body).is.ok.and.not.empty;
            expect(_body).to.be.an("object"); 
        });
        it("Debe retornar un error por id", async ()=>{
            const {statusCode} = await requester.get(`/api/products/findOne/1`);
            expect(statusCode).to.eql(400);
        });
        it("Debe crear un producto" , async ()=>{
            const {statusCode, _body} = await requester.post(`/api/products/createOne`).send(productTest);
            expect(statusCode).to.eql(200);
            expect(_body.payload).is.ok.and.to.have.property("_id")
            expect(_body).to.be.an("object");
            idProdCreado = _body.payload._id;
        })

        it("Debe actualizar un producto", async ()=>{
            const {statusCode, _body} = await requester.put(`/api/products/updateOne/${idProdCreado}`).send(productTestUpdate);
            expect(statusCode).to.eql(200);
            expect(_body).is.ok.and.not.empty;
            expect(_body).to.be.an("object");
            expect(_body.payload).is.ok.and.to.have.property("modifiedCount")
        })
        it("Debe borrar un producto", async ()=>{
            const {statusCode, _body} = await requester.delete(`/api/products/deleteOne/${idProdCreado}`);
            expect(statusCode).to.eql(200);
            expect(_body).is.ok.and.not.empty;
            expect(_body).to.be.an("object");
            expect(_body.payload).is.ok.and.to.have.property("deletedCount")
        })
    });
    describe("Test api/carts", ()=>{
        it("Debe crear un carrito", async ()=>{
            const {statusCode, _body} = await requester.post("/api/carts").send(userData);
            expect(statusCode).to.eql(200);
            expect(_body).is.ok.and.not.empty;
            expect(_body).to.be.an("object");
            idCartCreado = _body.payload._id;       
        });
        it("Debe retornar un carrito por id", async ()=>{
            const {statusCode, _body} = await requester.get(`/api/carts/search/${idCart}`);
            expect(statusCode).to.eql(200);
            expect(_body).is.ok.and.not.empty;
            expect(_body).to.be.an("object"); 
        });
        it("Debe retornar un error por id", async ()=>{
            const {statusCode} = await requester.get(`/api/carts/search/1`);
            expect(statusCode).to.eql(500);
        });

        it("Debe agregar un producto al carrito", async ()=>{
            const {statusCode, _body} = await requester.put(`/api/carts/${idCartCreado}/products/add/${idProd}`);
            expect(statusCode).to.eql(200);
            expect(_body).is.ok.and.not.empty;
            expect(_body).to.be.an("object");      
        });

        it("Debe reducir la cantidad de un producto del carrito", async ()=>{
            const cartAdd = await requester.put(`/api/carts/${idCartCreado}/products/add/${idProd}`);
            const {statusCode, _body} = await requester.delete(`/api/carts/${idCartCreado}/products/reduce/${idProd}`);
            expect(statusCode).to.eql(200);
            expect(_body).is.ok.and.not.empty;
            expect(_body).to.be.an("object");   
        })

        it("Debe eliminar un producto del carrito", async ()=>{
            const {statusCode, _body} = await requester.delete(`/api/carts/${idCartCreado}/products/delete/${idProd}`);
            expect(statusCode).to.eql(200);
            expect(_body).is.ok.and.not.empty;
            expect(_body).to.be.an("object");      
        });

        it("Debe limpiar el carrito por completo", async ()=>{
            const cartAdd = await requester.put(`/api/carts/${idCartCreado}/products/add/${idProd2}`);
            const {statusCode, _body} = await requester.put(`/api/carts/${idCartCreado}/clean`);
            expect(statusCode).to.eql(200);
            expect(_body).is.ok.and.not.empty;
            expect(_body.payload.products).is.empty
            expect(_body).to.be.an("object");      
        });
        it("Debe borrar un carrito", async ()=>{
            const {statusCode, _body} = await requester.delete(`/api/carts/deleteCart/${idCartCreado}`);
            expect(statusCode).to.eql(200);
            expect(_body).is.ok.and.not.empty;
            expect(_body).to.be.an("object");
            expect(_body.payload).is.ok.and.to.have.property("deletedCount")
        });

    })
    describe("Test api/users", ()=>{  

        
        it("Debe crear y resgistrar un usuario", async ()=>{
            const {statusCode, _body} = await requester.post("/api/users/register").send(userTest);
            expect(statusCode).to.eql(200);
            expect(_body).is.ok
            expect(_body).to.be.an("object");
            idUserCreado = _body.payload._id;
            console.log("userID: " + idUserCreado);       
        });
        it("Debe loguear un usuario por id", async ()=>{
            const userMock = {
                email: `${userTest.email}`,
                password:  `${userTest.password}`
            }
            const {statusCode, _body, headers} = await requester.post(`/api/users/login`).send(userMock);
            const cookies = headers['set-cookie'][0];

            expect(statusCode).to.eql(200);
            expect(_body).is.ok.and.have.property("message")

            const cookieData = cookies.split('=');
            cookie = {
                name: cookieData[0],
                value: cookieData[1]
            };

            expect(cookie.name).to.be.ok.and.eql('jwtCookieToken')
            expect(cookie).to.be.ok
        });
        
        it("Debe desloguear un usuario ", async ()=>{
            const {statusCode} = (await requester.get(`/api/users/logout`))
            expect(statusCode).to.eql(200);
        })
    })
})