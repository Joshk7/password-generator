const form = document.querySelector("form");
const password = document.getElementById("password");
const copied = document.getElementById("copied");
const clipboard = document.getElementById("clipboard");
const rangeSlider = document.getElementById("slider");
const sliderValue = document.getElementById("slider--value");
const thumbWidth = 28;
const strengthValue = document.getElementById("strength-value");
const strengthBars = document.getElementById("strength-bars");

const generatePassword = ({
    length,
    uppercase,
    lowercase,
    numbers,
    symbols,
}) => {
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()-_=+[]{}|;:',.<>?/`~";

    let availableChars = "";
    const mandatoryChars = [];

    if (uppercase) {
        availableChars += uppercaseChars;
        mandatoryChars.push(
            uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)]
        );
    }
    if (lowercase) {
        availableChars += lowercaseChars;
        mandatoryChars.push(
            lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)]
        );
    }
    if (numbers) {
        availableChars += numberChars;
        mandatoryChars.push(
            numberChars[Math.floor(Math.random() * numberChars.length)]
        );
    }
    if (symbols) {
        availableChars += symbolChars;
        mandatoryChars.push(
            symbolChars[Math.floor(Math.random() * symbolChars.length)]
        );
    }

    if (availableChars === "" || length <= 0) {
        return "";
    }

    let password = mandatoryChars.join("");
    while (password.length < length) {
        password +=
            availableChars[Math.floor(Math.random() * availableChars.length)];
    }

    password = password
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");

    return password;
};

const calculatePasswordStrength = ({
    length,
    uppercase,
    lowercase,
    numbers,
    symbols,
}) => {
    let score = 0;

    if (length >= 12) {
        score += 2;
    } else if (length >= 8) {
        score += 1;
    }

    if (uppercase) {
        score += 1;
    }

    if (lowercase) {
        score += 1;
    }

    if (numbers) {
        score += 1;
    }

    if (symbols) {
        score += 1;
    }

    if (score >= 6) {
        return "strong";
    } else if (score >= 4) {
        return "medium";
    } else if (score >= 2) {
        return "weak";
    } else {
        return "vulnerable";
    }
};

const strengths = {
    vulnerable: "TOO WEAK!",
    weak: "WEAK",
    medium: "MEDIUM",
    strong: "STRONG",
};

const validate = ({ length, uppercase, lowercase, numbers, symbols }) => {
    if (length < uppercase + lowercase + numbers + symbols) {
        return false;
    }

    if (!(uppercase || lowercase || numbers || symbols)) {
        return false;
    }

    return true;
};

const handleClipboardClick = (e) => {
    if (password.dataset.value) {
        navigator.clipboard
            .writeText(password.dataset.value)
            .then(() => {
                copied.classList.remove("invisible");
            })
            .catch((err) => {
                console.error("Failed to copy: ", err);
            });
    }
};

const handleSliderInput = (e) => {
    const { min, max, value } = rangeSlider;
    const total = Number(max) - Number(min);
    const percent = ((Number(value) - Number(min)) / total) * 100;
    const offset = thumbWidth / 2 / 100;
    e.target.style.background = `linear-gradient(to right, var(--lime-green) 0%, var(--lime-green) ${
        percent - offset
    }%, var(--black) ${percent - offset}%, var(--black) 100%`;
    sliderValue.textContent = value;
};

const handleSubmit = (e) => {
    e.preventDefault();
    copied.classList.add("invisible");
    const formData = {};
    const fields = e.target.querySelectorAll("input");
    for (const field of fields) {
        if (field.type === "checkbox") {
            formData[field.name] = field.checked;
        } else {
            formData[field.name] = field.value;
        }
    }

    const valid = validate(formData);
    if (!valid) {
        password.textContent = "P4$5W0rD!";
        password.dataset.value = "";
        password.classList.add("empty");
        strengthValue.textContent = "";
        strengthBars.dataset.strength = "";
    } else {
        const newPassword = generatePassword(formData);
        password.textContent = newPassword;
        password.dataset.value = newPassword;
        password.classList.remove("empty");
        const passwordStrength = calculatePasswordStrength(formData);
        strengthValue.textContent = strengths[passwordStrength];
        strengthBars.dataset.strength = passwordStrength;
    }
};

clipboard.addEventListener("click", handleClipboardClick);
rangeSlider.addEventListener("input", handleSliderInput);
form.addEventListener("submit", handleSubmit);
