// Book Class : Represents a Book -- Bir kitabı temsilen
class Book {
    constructor(title,author,isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn
    }
}
// UI Class : UI Tasks --- Arayüz islemleri
class UI {
    static displayBooks(){  // Orneklendirme istemedik Static yaptık.
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book))
    }
    static addBookToList(book) {
        const list = document.querySelector("#book-list");
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `
        list.appendChild(row);
    }
    static deleteBook (el) {
        if(el.classList.contains("delete")){
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message,className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div,form) // div'i formdan önce ekle
        //Vanish in 3 seconds -- 3 saniye sonra kaybol
        setTimeout(() =>{document.querySelector('.alert').remove()},3000);
    }

    static clearFields(){
        document.querySelector('#title').value = "";
        document.querySelector('#author').value = "";
        document.querySelector('#isbn').value = "";
    }
    static preventRepeating() {
    // Prevent repeating -- tekrarlamayı önle
    const div_number = document.querySelectorAll(".alert");
    if(div_number.length > 1){
        div_number[1].remove();
    }
    }  
}
// Store Class: Storage -- Local database depolama
class Store {
    static getBooks (){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }
        else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books',JSON.stringify(books));
    }
    static removeBook(isbn){
        const books = Store.getBooks();
        books.forEach((book,index) => {
            if(book.isbn === isbn){
                books.splice(index,1);
            }
        });
        // SET WITH CHANGES AGAIN
        localStorage.setItem('books',JSON.stringify(books));
    }
}
// Events : Display Books -- Kitapları göster
document.addEventListener('DOMContentLoaded',UI.displayBooks)

// Event : Add a Book -- Kitap ekle
document.querySelector('#book-form').addEventListener('submit', (e) => {
    // Prevent Actual Submit -- Submit eventi önleriz çünkü değeri sıfırlar..
    e.preventDefault();
    // Get Form Values -- Form Değerleri alma
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    // Validate -- Inputlar bos mu dolu mu kontrol
    if(title === "" || author === "" || isbn === ""){
        UI.showAlert("Please fill in all the fields.",'danger');
    }
    else {
    // Instanciate book -- Class örneklendiririz...
    const book = new Book(title,author,isbn);
    // Add book to UI
    UI.addBookToList(book);
    // Add book to store
    Store.addBook(book);
    // Success Message 
    UI.showAlert('Book Added !','success');
    // Clear Fields
    UI.clearFields();
    // Prevent Repeating 
    }
    UI.preventRepeating();
})
// Event : Remove a Book -- Kitap sil
document.querySelector('#book-list').addEventListener('click', (e) => {

    //Remove book from UI -- Listeden kitabı sil.
    UI.deleteBook(e.target)
    //Remove Book from Store -- Database'den kitabı sil.
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent); // ISBN KODUNU ALDIK
    //Show Success Message -- Tamamlandı mesajı
    UI.showAlert('Book Removed !','success'); 
})