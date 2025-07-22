# URL Shorter API

## Visão Geral

Este projeto é um encurtador de URLs desenvolvido com **NestJS**, seguindo princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**. A API permite que os usuários encurtem URLs longas, gerenciem seus links e acessem os links originais através de um código curto. A aplicação é totalmente containerizada com Docker para facilitar a configuração e o deploy do ambiente.

## Tecnologias e Metodologias

A construção deste projeto se baseia em tecnologias modernas e práticas de desenvolvimento que garantem escalabilidade, manutenibilidade e robustez.

### Tecnologias

-   **Backend:** [NestJS](https://nestjs.com/), [TypeScript](https://www.typescriptlang.org/), [Node.js](https://nodejs.org/)

-   **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/) com [Prisma](https://www.prisma.io/) como ORM

-   **Autenticação:** Autenticação baseada em [JSON Web Tokens (JWT)](https://jwt.io/)

-   **Segurança:** Hash de senhas utilizando [Argon2](https://argon2.online/)

-   **Containerização:** [Docker](https://www.docker.com/) e Docker Compose

-   **API:** REST com documentação automatizada via [OpenAPI (Swagger)](https://swagger.io/)
### Arquitetura e Metodologias

-   **Clean Architecture:** O projeto é estruturado em camadas (`domain`, `application`, `infrastructure`), garantindo a separação de responsabilidades e um baixo acoplamento entre os componentes. A camada de domínio é o núcleo do sistema e não depende de detalhes de implementação externos.

-   **Domain-Driven Design (DDD):** Conceitos de DDD como Entidades (`User`, `Url`), Repositórios (`UserRepository`, `UrlRepository`) e Value Objects (`EmailVO`) são utilizados para modelar o domínio do negócio de forma clara e precisa.

-   **Use Cases:** A lógica de negócio é encapsulada em classes de _Use Cases_ (`CreateNewUrlUseCase`, `LoginUserUseCase`, etc.), cada uma representando uma única ação que um usuário pode realizar. Essa abordagem, alinhada com a Clean Architecture, substitui o uso de "Services" genéricos, pois a complexidade não exigia uma camada adicional de serviços, resultando em classes mais coesas e com uma única responsabilidade (Single Responsibility Principle).

-   **Injeção de Dependência:** O NestJS gerencia o ciclo de vida dos objetos e suas dependências, facilitando a troca de implementações (como usar um repositório em memória para testes e um repositório Prisma para produção).

## Como Executar o Ambiente

Para configurar e executar o ambiente de desenvolvimento, você precisará ter o **Docker** e o **Docker Compose** instalados.

### 1. Clonar o Repositório
```Bash
git clone https://github.com/damiaoterto/url-shorter.git
cd url-shorter
```

### 2. Criar o Arquivo de Variáveis de Ambiente

O projeto utiliza um arquivo `.env` para configurar as variáveis de ambiente. Você deve criar uma cópia do arquivo de exemplo `.env.example`.

```Bash
cp .env.example .env
```

**Observação:** O arquivo `.env.example` já contém valores padrão para um ambiente de desenvolvimento local, mas você pode ajustá-los se necessário.

### 3. Subir os Serviços com Docker Compose

Com o Docker em execução, utilize o comando abaixo para construir as imagens e iniciar os contêineres em modo "detached" (-d):
```Bash
docker compose --env-file .env up -d --build
```

Este comando irá:

-   Construir a imagem da aplicação NestJS.

-   Iniciar um contêiner para o banco de dados PostgreSQL.

-   Executar as migrações do Prisma para criar as tabelas no banco de dados.

-   Iniciar a aplicação, que estará disponível na porta `3000`.


Para verificar se os serviços estão em execução, você pode usar o comando:
```Bash
docker compose ps
```

## Endpoints e Documentação

Após iniciar os serviços, a aplicação estará acessível em `http://localhost:3000`.

### Documentação da API (Swagger)

A API possui uma documentação completa e interativa gerada com OpenAPI (Swagger). Para acessá-la, navegue até:

**[http://localhost:3000/swagger](https://www.google.com/search?q=http://localhost:3000/swagger)**

Lá você encontrará todos os endpoints disponíveis, seus parâmetros, schemas de DTOs e poderá testá-los diretamente pela interface.
