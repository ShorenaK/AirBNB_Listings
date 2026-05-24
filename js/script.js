const listingsContainer = document.querySelector("#listings");
const searchBox = document.querySelector("#searchBox");

let allListings = [];

async function loadListings() {
    const response = await fetch("airbnb_sf_listings_500.json");
    const data = await response.json();

    allListings = data.slice(0, 50);
    displayListings(allListings);
}

function displayListings(listings) {
    listingsContainer.innerHTML = "";

    listings.forEach((listing) => {
        const card = document.createElement("div");
        card.className = "card";

        const name = listing.name || "No Name";
        const description = listing.description || "No description available.";

        const amenities = Array.isArray(listing.amenities)
            ? listing.amenities.slice(0, 6).join(", ")
            : "No amenities";

        const hostName =
            listing.host_name ||
            listing.host?.host_name ||
            "Unknown Host";

        const hostImage =
            listing.host_picture_url ||
            listing.host_thumbnail_url ||
            listing.host?.host_picture_url ||
            listing.host?.host_thumbnail_url ||
            "https://placehold.co/100x100?text=Host";

        const thumbnail =
            listing.picture_url ||
            listing.thumbnail_url ||
            listing.medium_url ||
            listing.xl_picture_url ||
            listing.images?.picture_url ||
            listing.images?.thumbnail_url ||
            "https://placehold.co/600x400?text=No+Image";

        let price =
            listing.price?.$numberDecimal ||
            listing.price ||
            "N/A";

        if (typeof price === "string") {
            price = price.replace("$", "");
        }

        card.innerHTML = `
            <img class="thumbnail" src="${thumbnail}" alt="${name}">

            <div class="card-content">
                <h2>${name}</h2>

                <p>${description}</p>

                <p><strong>Amenities:</strong> ${amenities}</p>

                <div class="host">
                    <img src="${hostImage}" alt="${hostName}">
                    <span>${hostName}</span>
                </div>

                <p class="price">$${price} per night</p>

                <button onclick="saveListing(this)">♡ Save</button>
            </div>
        `;

        listingsContainer.appendChild(card);
    });
}

function saveListing(button) {
    button.classList.toggle("saved");

    if (button.classList.contains("saved")) {
        button.textContent = "♥ Saved";
    } else {
        button.textContent = "♡ Save";
    }
}

searchBox.addEventListener("input", () => {
    const searchTerm = searchBox.value.toLowerCase();

    const filteredListings = allListings.filter((listing) => {
        const name = listing.name || "";
        const description = listing.description || "";
        const hostName = listing.host_name || listing.host?.host_name || "";

        return (
            name.toLowerCase().includes(searchTerm) ||
            description.toLowerCase().includes(searchTerm) ||
            hostName.toLowerCase().includes(searchTerm)
        );
    });

    displayListings(filteredListings);
});

loadListings();