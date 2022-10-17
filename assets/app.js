const effect3D = (() => {

	const percent = 40
	const calcRotate = (poss, size) => (poss / (size / 2)) * percent - percent

	const add = element => {

		element.classList.add('effect3D')

		let height = element.clientHeight
		let width = element.clientWidth

		element.addEventListener('mouseover', () => {
			height = element.clientHeight
			width = element.clientWidth
		})

		let count = 0
		element.addEventListener('mousemove', ({ offsetX, offsetY }) => {
			count++
			if (count % 2 !== 0) return
			element.style.setProperty('--x', `${calcRotate(offsetX, width)}deg`)
			element.style.setProperty('--y', `${calcRotate(offsetY, height) * -1}deg`)
		})
	}

	console.log(document.querySelectorAll('[effectHover3D]'))

	document.querySelectorAll('[effectHover3D]').forEach(element => add(element))

})()


