let { nanoid } = require("nanoid");
let books = require("./books");

let addBookHandler = (req, h) => {
    let {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = req.payload;

    //validation
    if (!name) {
        return h
            .response({
                status: "fail",
                message: "Gagal menambahkan buku. Mohon isi nama buku",
            })
            .code(400);
    }

    if (readPage > pageCount) {
        return h
            .response({
                status: "fail",
                message:
                    "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
            })
            .code(400);
    }

    //MAIN
    let id = nanoid(16);
    let insertedAt = new Date().toISOString();
    let updatedAt = insertedAt;

    let newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished: pageCount === readPage,
        reading,
        insertedAt,
        updatedAt,
    };

    books.push(newBook);

    let isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        return h
            .response({
                status: "success",
                message: "Buku berhasil ditambahkan",
                data: {
                    bookId: id,
                },
            })
            .code(201);
    }

    return h
        .response({
            status: "error",
            message: "Buku gagal ditambahkan",
        })
        .code(500);
};

let getAllBooksHandler = (req) => {
    let { reading, finished, name } = req.query;

    if (reading !== undefined) {
        let filteredBooks = books.filter((book) => book.reading == reading);
        return {
            status: "success",
            data: {
                books: filteredBooks.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        };
    }
    if (finished !== undefined) {
        let filteredBooks = books.filter((book) => book.finished == finished);
        return {
            status: "success",
            data: {
                books: filteredBooks.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        };
    }

    if (name !== undefined) {
        let filteredBooks = books.filter((book) =>
            book.name.toLowerCase().includes(name.toLowerCase())
        );
        return {
            status: "success",
            data: {
                books: filteredBooks.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        };
    }

    return {
        status: "success",
        data: {
            books: books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    };
};

let getBookByIdHandler = (req, h) => {
    let { bookId } = req.params;
    let book = books.find((book) => book.id === bookId);

    if (!book) {
        return h
            .response({
                status: "fail",
                message: "Buku tidak ditemukan",
            })
            .code(404);
    }

    return h.response({
        status: "success",
        data: {
            book,
        },
    });
};

let updateBookByIdHandler = (req, h) => {
    let { bookId } = req.params;
    let {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = req.payload;

    if (!name) {
        return h
            .response({
                status: "fail",
                message: "Gagal memperbarui buku. Mohon isi nama buku",
            })
            .code(400);
    }

    if (readPage > pageCount) {
        return h
            .response({
                status: "fail",
                message:
                    "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
            })
            .code(400);
    }

    let updateAt = new Date().toISOString();
    let index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
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
            updateAt,
        };

        return h
            .response({
                status: "success",
                message: "Buku berhasil diperbarui",
            })
            .code(200);
    }

    return h
        .response({
            status: "fail",
            message: "Gagal memperbarui buku. Id tidak ditemukan",
        })
        .code(404);
};

let deleteBookByIdHandler = (req, h) => {
    let { bookId } = req.params;
    let index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        return h
            .response({
                status: "success",
                message: "Buku berhasil dihapus",
            })
            .code(200);
    }

    return h
        .response({
            status: "fail",
            message: "Buku gagal dihapus. Id tidak ditemukan",
        })
        .code(404);
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    updateBookByIdHandler,
    deleteBookByIdHandler,
};
