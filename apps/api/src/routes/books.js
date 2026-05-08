import { Router } from "express";
import { validate, normalize } from "../bookValidator.js";

export function createBooksRouter({ bookRepository }) {
  const router = Router();

  router.get("/", async (_request, response, next) => {
    try {
      const books = await bookRepository.all();
      response.json({ data: books, error: null });
    } catch (error) {
      next(error);
    }
  });

  router.post("/test", async (request, response) => {
    console.log(request);
    const input = request.body;
    console.log(input);
    const errors = validate(input);
    console.log(errors);
    if (errors.length > 0) {
      return response.status(422).json({ data: null, error: errors[0] });
    }
    const book = await bookRepository.create(normalize(input));
    console.log("book: this is book object", book);
    response.json({ data: book });
  });

  // curl -s -X POST http://localhost:3000/api/books/test \
  // -H "Content-Type: application/json" \
  // -d '{"title": "The Pragmatic Programmer", "author": "Dave Thomas", "status": "reading"}' | jq

  // router.post("/", async (request, response, next) => {
  //   try {
  //     // request.body is the parsed JSON - same as readJsonBody() in PHP
  //     const input = request.body;
  //     // validate returns an array of errors strings, empty array means valid
  //     const errors = validate(input);
  //     // if there are erros, send 422 with the first error message
  //     if (errors.length > 0) {
  //       return response.status(422).json({ data: null, error: errors[0] });
  //     }
  //     // normalize cleans the data, then persists it
  //     const book = await bookRepository.create(normalize(input));
  //     // 201 Created - return the full book object
  //     response.status(201).json({ data: book, error: null });
  //   } catch (error) {
  //     next(error);
  //   }
  // });

  // // PUT method
  // router.put("/", async (request, response, next) => {
  //   try {
  //     const id = request.id;
  //     if (id === null){
  //       return response.status(422).json({ data: null, error: "a valid book id is required" });
  //     }
  //     const input = request.body;
  //     const errors = validate(input);
  //     if (errors.length > 0){
  //       return
  //     }
  //   }
  // });
  // read the id
  // if id is null, then respond with 'a book id is required', 400

  // read the JSON body
  // validate the input, check for errors
  // if errors exist, respond with null, 422

  // update the repo after the input is normalized
  // if book does not exist, return with null and 404

  // respond with book
  return router;
}
