//boolean true pega toda a div, false pega só a linha em que está a div, n esquece macaco


document.querySelector("#add-time")
.addEventListener("click", cloneField)

function cloneField() {
    const newFieldContainer = document.querySelector(".schedule-item").cloneNode(true)
    const fields = newFieldContainer.querySelectorAll("input")

    fields.forEach(function(field){
        field.value =""
    })

    document.querySelector("#schedule-items").appendChild(newFieldContainer)
}