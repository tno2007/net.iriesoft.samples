import "./scss/app.scss"

var slider : HTMLInputElement = document.querySelector(".slider-container .slider");

slider.oninput = () => {
    console.log(slider.value)
}