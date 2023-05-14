export const typewriterEffect = (element, textData, speed = 50) => {
	let text = "";
	let index = 0;
	const words = textData.split(' ');

	const type = () => {
		if (index < words.length) {
			text += words[index++] + ' ';
			element.innerHTML = text + '<span class="cursor">|</span>';
			setTimeout(() => type(), speed);
		} else {
			// Remove the cursor when the typing is complete
			element.querySelector(".cursor").remove();
		}
	};

	type();
};