const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const finished = pageCount === readPage;

    const newNote = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        createdAt,
        updatedAt,
    };

    books.push(newNote);

    const isSuccess = books.filter((note) => note.id === id).length > 0;
    if (typeof name == 'undefined' || name === "") {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    } else if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    } else if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    } else {
        const response = h.response({
            status: 'success',
            message: 'Buku gagal ditambahkan',
        });
        response.code(500);
        return response;
    }
};

const getAllBooksHandler = (request, h) => {

    const { name, reading, finished } = request.query;
    let filteredBook = books;
    if (typeof name == 'string') {
        filteredBook = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    } else if (typeof reading != 'undefined' && reading == 1) {
        filteredBook = books.filter((book) => book.reading == true);
    } else if (typeof reading != 'undefined' && reading == 0) {
        filteredBook = books.filter((book) => book.reading == false);
    } else if (typeof finished != 'undefined' && finished == 1) {
        filteredBook = books.filter((book) => book.finished == true);
    } else if (typeof finished != 'undefined' && finished == 0) {
        filteredBook = books.filter((book) => book.finished == false);
    }

    const response = h.response({
        status: 'success',
        data: {
            books: filteredBook,
        },
    });
    response.code(200);
    return response;

};

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const book = books.filter((n) => n.id === id)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book: book,
            },
        };
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
    } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((note) => note.id === id);

    if (typeof name == 'undefined' || name === "") {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    } else if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    } else if (index === -1) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    } else {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            updatedAt,
        };
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }
};

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = books.findIndex((note) => note.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };