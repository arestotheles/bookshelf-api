const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt, };

  const payload = request.payload;

  //property name tidak ada pada request body
  if (!payload.hasOwnProperty('name')) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  //apakah nilai readPage lebih besar dari pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  //buku berhasil ditambahkan
  else {
    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;
    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });

      response.code(201);
      return response;
    }

  }

};

// Menampilkan semua buku
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name) {
    const tempBooks = books.filter((n) => (n.name).toLowerCase().includes(name.toLowerCase()));
    const result = tempBooks.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,

    }));

    const response = h.response({
      status: 'success',
      data: {
        books: result,
      },
    });
    return response;
  }

  if (reading) {
    const tempBooks = books.filter((n) => n.reading == reading);
    return {
      status: "success",
      data: {
        books: tempBooks.map(book => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    }
  }

  if(finished) {
    const tempBooks = books.filter(n => n.finished == finished);
    return {
      status: "success",
      data: {
        books: tempBooks.map(book => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    }
  }

  const result = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,

  }));

  const response = h.response({
    status: 'success',
    data: {
      books: result,
    },
  });
  return response;

};

// Menampilan buku berdasarkan id buku
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((book) => book.id === bookId)[0];


  if (book !== undefined) {
    return {
      status: "success",
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan"
  });
  response.code(404);
  return response;

};

const editBookByIdHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const payload = request.payload;
  const updatedAt = new Date().toISOString();

  //property name tidak ada pada request body
  if (!payload.hasOwnProperty('name')) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  //apakah nilai readPage lebih besar dari pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  //id yang dilampirkan oleh client tidak ditemukan oleh server
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan"
    });
    response.code(404);
    return response;
  }
  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  const response = h.response({
    status: "success",
    message: "Buku berhasil diperbarui"
  });
  response.code(200);
  return response;

};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex(book => book.id === bookId)
  const bookIsThere = index !== -1;

  if (!bookIsThere) {
    const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan"
    });
    response.code(404);
    return response;
  }

  books.splice(index, 1);
  return {
    status: "success",
    message: "Buku berhasil dihapus"
  }

};

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };
