# Gettir Assignment API Service

### Technology Stack
   * Node.js([Express](https://expressjs.com/en/starter/installing.html) Framework)
   * Mongo ([Moongoose](https://mongoosejs.com/) ORM)

### Installation Step

  * Clone repository.
  * Install `Node LTS, nodemon`.
  * RUN `npm install`
  * Default Node Env `local`. set ENV if neccessary `export NODE_ENV=local|prod|staging`.
  * Copy `config/default.yaml` into `config/env_name.yaml`.
  * Change configuration for `Mongo URI` in `config/env_name.yaml`.
  * Run `npm run prod`

### API Refrence
  
  * Use `Gettir_assignment_api_refrence.json` in the repository itself
  * Use this file for API refrence to use to restore in `https://insomnia.rest/` or `https://www.postman.com/`
  * POST http://127.0.0.1:3000/api/v1/records?page=integer&size=integer
    * `page` and `size` are optional and by default it is `page = 1` and `size = 10`
    * ``` JSON body
      {
        "startDate": "string(YYYY-MM-DD)",
        "endDate": "string(YYYY-MM-DD)",
        "minCount": "Integer",
        "maxCount": "Integer"
      }
      ```
Done Enjoy 🍻 🍻 🍻 ...!!!