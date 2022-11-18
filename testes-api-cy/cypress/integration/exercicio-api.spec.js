/// <reference types="cypress" />
import contrato from '../contracts/usuario.contract'

describe('Testes da Funcionalidade Usuários', () => {
     let token
     before(() => {
          cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
     });

     it.only('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)

          })

     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
               expect(response.duration).to.be.lessThan(20)
          })

     });

     it('Deve cadastrar um usuário com sucesso', () => {
          cy.request({
               method: 'POST',
               url: 'usuarios',
               headers: { authorization: token },
               body: {
                    "nome": "Fulano da Silva",
                    "email": "beltrano@qa.com.br",
                    "password": "teste",
                    "administrador": "true"
               },

          }).then((response) => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastrado realizado com sucesso')
          })

     });

     it('Deve validar um usuário com email inválido', () => {
          cy.request({
               method: 'POST',
               url: 'usuarios',
               headers: { authorization: token },
               body: {
                    "nome": "Fulano da Silva",
                    "email": "beltrano@qa.com.br",
                    "password": "teste",
                    "administrador": "true"
               },
               failOnStatusCode: false

          }).then((response) => {
               expect(response.status).to.equal(400)
               expect(response.body.message).to.equal('Este email já está sendo usado')
          })

     });

     it('Deve editar um usuário previamente cadastrado', () => {
          cy.request('usuarios').then(response => {
               let id = response.body.usuarios[3]._id
               cy.request({
                    method: 'PUT',
                    url: `usuarios/${id}`,
                    headers: { authorization: token },
                    body: {
                         "nome": "Isabela Marcal",
                         "email": "isabelamarcal@gmail.com",
                         "password": "teste",
                         "administrador": "true"
                    }
               }).then(response => {
                    expect(response.body.message).to.equal('Registro alterado com sucesso')

               })
          });

          it('Deve deletar um usuário previamente cadastrado', () => {
               cy.request('usuarios').then(response => {
                    let id = response.body.usuarios[4]._id
                    cy.request({
                         method: 'PUT',
                         url: `usuarios/${id}`,
                         headers: { authorization: token },
                         body: {
                              "nome": "Fulano Beltrano dos Santos",
                              "email": "fulanobeltranosantos@qa.com.br",
                              "password": "teste",
                              "administrador": "true",
                         }
                    })
               })

          });


     })
})
