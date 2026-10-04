let searchInput = document.getElementById("searchInput");
let searchButton = document.getElementById("searchButton");
let bookContainer = document.getElementById("bookContainer");

let loading = document.getElementById("loading");
let error = document.getElementById("error");
let resultCount = document.getElementById("resultCount");

let yearFilter = document.getElementById("yearFilter");
let sortSelect = document.getElementById("sortSelect");
let themeButton = document.getElementById("themeButton");

let detailsModal = document.getElementById("detailsModal");
let detailsTitle = document.getElementById("detailsTitle");
let detailsContent = document.getElementById("detailsContent");
let closeModal = document.getElementById("closeModal");

let books = [];


searchButton.addEventListener("click", function () {

    let searchText = searchInput.value.trim();

    if (searchText === "") {
        error.textContent = "Please enter a book title.";
        return;
    }

    searchBooks(searchText);
});


searchInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        searchButton.click();
    }

});


async function searchBooks(searchText) {

    loading.classList.remove("hidden");

    error.textContent = "";
    resultCount.textContent = "";
    bookContainer.innerHTML = "";

    try {

        let url =
            "https://openlibrary.org/search.json?title=" +
            encodeURIComponent(searchText) +
            "&limit=40";

        let response = await fetch(url);

        if (!response.ok) {
            throw new Error("Something went wrong");
        }

        let data = await response.json();

        books = data.docs;

        loading.classList.add("hidden");

        displayBooks(books);

    } catch (err) {

        loading.classList.add("hidden");

        error.textContent =
            "Unable to load books. Please try again.";

    }
}


function displayBooks(bookList) {

    bookContainer.innerHTML = "";

    if (bookList.length === 0) {

        resultCount.textContent = "No books found.";
        return;

    }

    resultCount.textContent =
        bookList.length + " books found";


    bookList.forEach(function (book) {

        let card = document.createElement("div");

        card.className =
            "bg-white dark:bg-pink-900 border border-pink-200 dark:border-pink-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300";


        let cover;

        if (book.cover_i) {

            cover = `
                <img
                    src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg"
                    alt="Book Cover"
                    class="w-full h-72 object-cover">
            `;

        } else {

            cover = `
                <div class="w-full h-72 bg-pink-100 dark:bg-pink-800 flex flex-col items-center justify-center">
                    <span class="text-6xl">📚</span>

                    <p class="text-sm text-pink-500 dark:text-pink-200 mt-3">
                        Cover not available
                    </p>
                </div>
            `;

        }


        let author = "Unknown";

        if (book.author_name) {
            author = book.author_name.slice(0, 2).join(", ");
        }


        card.innerHTML = `

            ${cover}

            <div class="p-5">

                <h3 class="text-lg font-bold mb-3 text-pink-950 dark:text-white line-clamp-2">
                    ${book.title || "Unknown Title"}
                </h3>

                <p class="text-sm text-pink-700 dark:text-pink-200 mb-2">

                    <span class="font-semibold">
                        Author:
                    </span>

                    ${author}

                </p>

                <p class="text-sm text-pink-600 dark:text-pink-300 mb-5">

                    <span class="font-semibold">
                        First published:
                    </span>

                    ${book.first_publish_year || "Unknown"}

                </p>

                <button
                    class="detailsButton w-full py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition">

                    📖 Detailed Info

                </button>

            </div>
        `;


        bookContainer.appendChild(card);


        let detailsButton =
            card.querySelector(".detailsButton");


        detailsButton.addEventListener("click", function () {

            showDetails(book);

        });

    });

}


yearFilter.addEventListener("change", function () {
    applyFilters();
});


sortSelect.addEventListener("change", function () {
    applyFilters();
});


function applyFilters() {

    let result = [...books];


    if (yearFilter.value === "old") {

        result = result.filter(function (book) {

            return book.first_publish_year &&
                book.first_publish_year < 2000;

        });

    }


    if (yearFilter.value === "new") {

        result = result.filter(function (book) {

            return book.first_publish_year &&
                book.first_publish_year >= 2000;

        });

    }


    if (sortSelect.value === "az") {

        result.sort(function (a, b) {

            return (a.title || "").localeCompare(
                b.title || ""
            );

        });

    }


    if (sortSelect.value === "za") {

        result.sort(function (a, b) {

            return (b.title || "").localeCompare(
                a.title || ""
            );

        });

    }


    displayBooks(result);
}


function showDetails(book) {

    detailsTitle.textContent =
        book.title || "Unknown Title";


    let authors = book.author_name
        ? book.author_name.join(", ")
        : "Not available";


    let publishers = book.publisher
        ? book.publisher.slice(0, 5).join(", ")
        : "Not available";


    let languages = book.language
        ? book.language.join(", ")
        : "Not available";


    let subjects = book.subject
        ? book.subject.slice(0, 8).join(", ")
        : "Not available";


    let isbn = "Not available";

    if (book.isbn && book.isbn.length > 0) {
        isbn = book.isbn.slice(0, 6).join(", ");
    }


    let pages = "Not available";

    if (book.number_of_pages_median) {
        pages = book.number_of_pages_median;
    }


    let publicationYears = book.publish_year
        ? book.publish_year.slice(0, 8).join(", ")
        : "Not available";


    let editions = book.edition_count || "Not available";


    let places = book.publish_place
        ? book.publish_place.slice(0, 5).join(", ")
        : "Not available";


    detailsContent.innerHTML = `

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div class="bg-pink-50 dark:bg-pink-900 rounded-xl p-4">

                <p class="text-sm text-pink-500 mb-1">
                    Author
                </p>

                <p class="font-semibold">
                    ${authors}
                </p>

            </div>


            <div class="bg-rose-50 dark:bg-rose-900 rounded-xl p-4">

                <p class="text-sm text-rose-500 mb-1">
                    First Published
                </p>

                <p class="font-semibold">
                    ${book.first_publish_year || "Not available"}
                </p>

            </div>


            <div class="bg-fuchsia-50 dark:bg-fuchsia-950 rounded-xl p-4">

                <p class="text-sm text-fuchsia-500 mb-1">
                    Publisher
                </p>

                <p class="font-semibold">
                    ${publishers}
                </p>

            </div>


            <div class="bg-pink-100 dark:bg-pink-900 rounded-xl p-4">

                <p class="text-sm text-pink-600 mb-1">
                    Language
                </p>

                <p class="font-semibold">
                    ${languages}
                </p>

            </div>


            <div class="bg-rose-100 dark:bg-rose-900 rounded-xl p-4">

                <p class="text-sm text-rose-600 mb-1">
                    Pages
                </p>

                <p class="font-semibold">
                    ${pages}
                </p>

            </div>


            <div class="bg-fuchsia-100 dark:bg-fuchsia-900 rounded-xl p-4">

                <p class="text-sm text-fuchsia-600 mb-1">
                    Editions
                </p>

                <p class="font-semibold">
                    ${editions}
                </p>

            </div>


            <div class="md:col-span-2 bg-pink-50 dark:bg-pink-900 rounded-xl p-4">

                <p class="text-sm text-pink-500 mb-1">
                    ISBN
                </p>

                <p class="font-semibold break-words">
                    ${isbn}
                </p>

            </div>


            <div class="md:col-span-2 bg-rose-50 dark:bg-rose-900 rounded-xl p-4">

                <p class="text-sm text-rose-500 mb-1">
                    Publication Years
                </p>

                <p class="font-semibold">
                    ${publicationYears}
                </p>

            </div>


            <div class="md:col-span-2 bg-fuchsia-50 dark:bg-fuchsia-950 rounded-xl p-4">

                <p class="text-sm text-fuchsia-500 mb-1">
                    Publication Place
                </p>

                <p class="font-semibold">
                    ${places}
                </p>

            </div>


            <div class="md:col-span-2 bg-pink-100 dark:bg-pink-900 rounded-xl p-4">

                <p class="text-sm text-pink-600 mb-1">
                    Subjects / Categories
                </p>

                <p class="font-semibold leading-7">
                    ${subjects}
                </p>

            </div>

        </div>
    `;


    detailsModal.classList.remove("hidden");
}


closeModal.addEventListener("click", function () {

    detailsModal.classList.add("hidden");

});


detailsModal.addEventListener("click", function (event) {

    if (event.target === detailsModal) {
        detailsModal.classList.add("hidden");
    }

});


themeButton.addEventListener("click", function () {

    document.documentElement.classList.toggle("dark");

    if (document.documentElement.classList.contains("dark")) {

        themeButton.textContent = "☀️";

    } else {

        themeButton.textContent = "🌙";

    }

});
