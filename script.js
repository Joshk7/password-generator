const rangeSlider = document.getElementById("slider");
const thumbWidth = 28;

const handleSliderInput = (e) => {
    const { min, max, value } = rangeSlider;
    const total = Number(max) - Number(min);
    const percent = ((Number(value) - Number(min)) / total) * 100;
    const offset = thumbWidth / 2 / 100;
    e.target.style.background = `linear-gradient(to right, var(--lime-green) 0%, var(--lime-green) ${
        percent - offset
    }%, var(--black) ${percent - offset}%, var(--black) 100%`;
};

rangeSlider.addEventListener("input", handleSliderInput);
