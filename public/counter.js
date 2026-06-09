function updateCounterDisplay(value) {
	const counterDiv = document.getElementById("counter");
	if (!counterDiv) {
		return;
	}

	const paddedValue = String(value).padStart(10, "0");

	counterDiv.replaceChildren();
	for (const ch of paddedValue) {
		const digit = document.createElement("span");
		digit.className = "digit";
		digit.textContent = ch;
		counterDiv.appendChild(digit);
	}
}

async function resetCounter() {
	const response = await fetch("/reset");
	const value = await response.text();
	updateCounterDisplay(value);
}

fetch("/message")
	.then((resp) => resp.text())
	.then((text) => {
		const messageDiv = document.getElementById("message");
		if (messageDiv) {
			messageDiv.textContent = text;
		}
	});

fetch("/increment")
	.then((resp) => resp.text())
	.then((text) => {
		updateCounterDisplay(text);
	});

const resetButton = document.getElementById("reset-button");
if (resetButton) {
	resetButton.addEventListener("click", () => {
		void resetCounter();
	});
}
