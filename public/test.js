async function resetCounter() {
	const response = await fetch("/reset");
	const value = await response.text();
	const counterDiv = document.getElementById("counter");
	if (counterDiv) {
		counterDiv.textContent = value;
	}
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
		const counterDiv = document.getElementById("counter");
		if (counterDiv) {
			counterDiv.textContent = text;
		}
	});

const resetButton = document.getElementById("reset-button");
if (resetButton) {
	resetButton.addEventListener("click", () => {
		void resetCounter();
	});
}
