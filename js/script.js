// Select the HTML elements we want to use
const listingsContainer = document.querySelector("#listings");
const searchBox = document.querySelector("#searchBox");

// Store all listings globally
let allListings = [];


// ================================
// LOAD JSON DATA
// ================================
async function loadListings() {

    // Fetch the JSON file
    const response = await fetch("airbnb_sf_listings_500.json");

    // Convert response into JavaScript object
    const data = await response.json();

    // Get only first 50 listings
    allListings = data.slice(0, 50);

    // Display listings on page
    displayListings(allListings);
}


// ================================
// DISPLAY LISTINGS
// ================================
function displayListings(listings) {

    // Clear old listings before showing new ones
    listingsContainer.innerHTML = "";

    // Loop through each listing
    listings.forEach((listing) => {

        // Create card div
        const card = document.createElement("div");

        // Add CSS class
        card.className = "card";


        // ================================
        // LISTING NAME
        // ================================
        const name =
            listing.name || "No Name";


        // ================================
        // DESCRIPTION
        // ================================
        const description =
            listing.description || "No description available.";


        // ================================
        // AMENITIES
        // JSON stores amenities as STRING
        // so we convert it into an array
        // ================================
        let amenities = "No amenities";

        try {

            // If amenities is a string
            if (typeof listing.amenities === "string") {

                // Convert string into array
                const parsedAmenities =
                    JSON.parse(listing.amenities);

                // Show first 6 amenities
                amenities =
                    parsedAmenities.slice(0, 6).join(", ");
            }

            // If already array
            else if (Array.isArray(listing.amenities)) {

                amenities =
                    listing.amenities.slice(0, 6).join(", ");
            }

        } catch (error) {

            amenities = "No amenities";
        }
        // ================================
        // HOST NAME
        // ================================
        const hostName =
            listing.host_name ||
            listing.host?.host_name ||
            "Unknown Host";


        // ================================
        // HOST IMAGE
        // ================================
        const hostImage =
            listing.host_picture_url ||
            listing.host_thumbnail_url ||
            listing.host?.host_picture_url ||
            listing.host?.host_thumbnail_url ||
            "https://placehold.co/100x100?text=Host";


        // ================================
        // PROPERTY IMAGE
        // ================================
        const thumbnail =
            listing.picture_url ||
            listing.thumbnail_url ||
            listing.medium_url ||
            listing.xl_picture_url ||
            listing.images?.picture_url ||
            listing.images?.thumbnail_url ||
            "https://placehold.co/600x400?text=No+Image";
       
        // PRICE
        let price =
            listing.price?.$numberDecimal ||
            listing.price ||
            "N/A";

        // Remove extra $ if already exists
        if (typeof price === "string") {

            price = price.replace("$", "");
        }
        // ================================
        // CARD HTML
        // ================================
        card.innerHTML = `

            <!-- Listing Image -->
           <img
    class="thumbnail"
    src="${thumbnail}"
    alt="${name}"
    onerror="this.src='https://placehold.co/600x400?text=No+Image'"
>

            <div class="card-content">

                <!-- Listing Name -->
                <h2>${name}</h2>

                <!-- Description -->
                <p>${description}</p>

                <!-- Amenities -->
                <p>
                    <strong>Amenities:</strong>
                    ${amenities}
                </p>

                <!-- Host Information -->
                <div class="host">

                  <img
    class="host-photo"
    src="${hostImage}"
    alt="${hostName}"
    onerror="this.src='https://placehold.co/100x100?text=Host'"
>

                    <p>${hostName}</p>

                </div>

                <!-- Price -->
                <p class="price">
                    $${price} per night
                </p>

                <!-- Save Button -->
                <button onclick="saveListing(this)">
                    ♡ Save
                </button>

            </div>
        `;

        // Add card to page
        listingsContainer.appendChild(card);
    });
}

// SAVE BUTTON FUNCTION
function saveListing(button) {

    // Toggle saved class
    button.classList.toggle("saved");

    // Change button text
    if (button.classList.contains("saved")) {

        button.textContent = "♥ Saved";

    } else {

        button.textContent = "♡ Save";
    }
}


// ================================
// SEARCH FUNCTION
// ================================
searchBox.addEventListener("input", () => {

    // Get search text
    const searchTerm =
        searchBox.value.toLowerCase();

    // Filter listings
    const filteredListings =
        allListings.filter((listing) => {

        const name =
            listing.name || "";

        const description =
            listing.description || "";

        const hostName =
            listing.host_name ||
            listing.host?.host_name ||
            "";

        // Return matching listings
        return (

            name.toLowerCase().includes(searchTerm)

            ||

            description.toLowerCase().includes(searchTerm)

            ||

            hostName.toLowerCase().includes(searchTerm)
        );
    });

    // Display filtered listings
    displayListings(filteredListings);
});


// START APP
loadListings();