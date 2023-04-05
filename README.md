# API Requirements
- [x] endpoint para cadastro de usuários `/register`
- [x] endpoint de termos de uso e polítcas de privacidade `/privacy-policy`
- [x] endpoint de login `/login`
- [x] endpoint de logout `/logout`
- [x] endpoint com lista de items padrão `/movies`
    - [x] busca que suporta paginação
    - [x] suporta campo de busca como query parameter 
    - [ ] suporte a filtro por campo relevante
    - [ ] suporte a parametros de ordenação
- [x] endpoint para editar cadastro de usuário
- [x] endpoint de envio de token para email cadastrado
- [x] endpoint para a validação do token digitado
- [x] endpoint com lista de itens restritos
    - [x] busca que suporta paginação
    - [x] suporta campo de busca como query parameter 
    - [ ] suporte a filtro por campo relevante
    - [ ] suporte a parametros de ordenação

Next:
- [ ] Endpoint para alterar senha com a confirmação da atual
- [ ] Testes unitários
- [ ] Documentação usando OpenAPI


# Como executar localmente?
1. Instale as dependências, execute o compando abaixo na raiz do repositório
    `npm install`
2. Builde o projeto usando `npm run tsc`
3. Execute usando `npm start`

# Documentation
[API Docs](https://documenter.getpostman.com/view/21314939/2s93RXsAHX)
