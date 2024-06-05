// Reference: https://forum.obsidian.md/t/obsidian-publish-api-how-to-track-changing-theme/73637/4

export const themeObserver = new MutationObserver(function (mutations) {
	mutations.forEach(function (mutation) {
		const target = mutation.target as HTMLElement;
		if (
			// dark -> dark & light -> light
			mutation.oldValue?.contains("theme-dark") &&
			!mutation.oldValue?.contains("theme-light") && // key line, avoid calling twice
			target.classList.value.contains("theme-light")
		) {
			console.log("light theme detected");
			setPseudocodeTheme();
		} else if (
			// light -> empty -> dark
			mutation.oldValue?.contains("theme-light") && // key line, avoid calling twice
			!mutation.oldValue?.contains("theme-dark") &&
			target.classList.value.contains("theme-dark")
		) {
			console.log("dark theme detected");
			setPseudocodeTheme();
		}
	});
});

export function setPseudocodeTheme(psBlock?: Element) {

	const bodyElement = document.body;
	const backgroundValue = getComputedStyle(bodyElement)
		.getPropertyValue("--background-primary")
		.trim();
	const fontValue = getComputedStyle(bodyElement)
		.getPropertyValue("--text-normal")
		.trim();
	console.log(backgroundValue, fontValue);

	const psRootElements = psBlock
		? psBlock.querySelectorAll(".ps-root")
		: document.querySelectorAll(".ps-root");
	// console.log(psRootElements);

	// Loop through each element and modify the CSS properties
	psRootElements.forEach((element) => {
		const htmlElement = element as HTMLElement;
		htmlElement.style.backgroundColor = backgroundValue;
		htmlElement.style.opacity = "1";
		htmlElement.style.color = fontValue;

		// Change border colors for .ps-algorithm and .ps-algorithm.with-caption > .ps-line:first-child
		const algorithmElements = htmlElement.querySelectorAll(".ps-algorithm");
		algorithmElements.forEach((algElement) => {
			const algHtmlElement = algElement as HTMLElement;
			algHtmlElement.style.borderTopColor = fontValue;
			algHtmlElement.style.borderBottomColor = fontValue;
		});

		const lineElements = htmlElement.querySelectorAll(
			".ps-algorithm.with-caption > .ps-line:first-child"
		);
		lineElements.forEach((lineElement) => {
			const lineHtmlElement = lineElement as HTMLElement;
			lineHtmlElement.style.borderBottomColor = fontValue;
		});
	});
}

export const setObserver = () => {
	themeObserver.observe(document.body, {
		attributes: true,
		attributeOldValue: true,
		attributeFilter: ["class"],
	});
};

export const detachObserver = () => {
	themeObserver.disconnect();
};
