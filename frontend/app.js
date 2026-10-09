const form = document.getElementById("predictionForm");

const loading = document.getElementById("loading");
const result = document.getElementById("result");
const error = document.getElementById("error");

const priceElement = document.getElementById("price");

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    loading.classList.remove("hidden");
    result.classList.add("hidden");
    error.classList.add("hidden");

    const data = {
        carpet_area_sqft: Number(
            document.getElementById("carpet_area_sqft").value
        ),

        floor_num: Number(
            document.getElementById("floor_num").value
        ),

        bathroom: Number(
            document.getElementById("bathroom").value
        ),

        balcony_num: Number(
            document.getElementById("balcony_num").value
        ),

        location_grouped:
            document.getElementById("location_grouped").value,

        Furnishing:
            document.getElementById("Furnishing").value,

        Transaction:
            document.getElementById("Transaction").value,

        Ownership:
            document.getElementById("Ownership").value,

        facing:
            document.getElementById("facing").value
    };

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/predict",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            }
        );

        const resultData = await response.json();

        if (!response.ok) {
            throw new Error(
                resultData.detail || "Prediction failed"
            );
        }

        const price = resultData.predicted_price;

        priceElement.textContent =
            `${price.toLocaleString()} ${resultData.currency}`;

        result.classList.remove("hidden");

    } catch (err) {

        error.textContent =
            "Error: " + err.message;

        error.classList.remove("hidden");

    } finally {

        loading.classList.add("hidden");

    }

});