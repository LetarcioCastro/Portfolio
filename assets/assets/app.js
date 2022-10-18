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

	document.querySelectorAll('[effectHover3D]').forEach(el => add(el))

})()

const time = (time = 1000) =>
	new Promise(response => setTimeout(() => response(), time))


const typingEffect = (() => {

	const intervalTime = 130

	const typing = async element => {
		element.setAttribute('typing', '')
		let text = element.word
		let word = ''
		for (let letter of text) {
			await time(intervalTime)
			word += letter
			element.innerText = word
		}
		await time(500)
		element.removeAttribute('typing')
	}

	const erasing = async element => {
		element.setAttribute('typing', '')
		let text = element.word
		let length = text.length
		for (_ of text) {
			await time(70)
			length--
			element.innerText = text.slice(0, length)
		}
		await time(300)
		element.removeAttribute('typing')
	}


	const add = element => {

		element.classList.add('effectTyping')
		element.style.height = element.clientHeight + 'px'
		element.word = element.innerText

		const infiniteLoop = async () => {
			await typing(element)
			await time(3000)
			await erasing(element)
			await time(500)
			await infiniteLoop()
		}

		infiniteLoop()
	}

	document.querySelectorAll('[effectTyping]').forEach(el => add(el))

})()

const getForm = nameForm => {

	const form = document.querySelector(`[form-name="${nameForm}"]`)
	if (!form) return false
	const values = {}
	const inputInvalides = []
	form.querySelectorAll('[form-value]').forEach(element => {
		const value = element.value
		if (!value && element.attributes.required) inputInvalides.push(element)
		values[element.attributes['form-value'].value] = value
	})

	inputInvalides.forEach(el => {
		el.addEventListener('focus', () => el.removeAttribute('invalid'))
		el.setAttribute('invalid', '')
	})
	return inputInvalides[0] ? false : values

}


const disableForm = nameForm => {
	const form = document.querySelector(`[form-name="${nameForm}"]`)
	form.querySelectorAll('[form-value]').forEach(element => {
		element.value = ''
		element.disabled = true
	})
}

const validForm = (obj, keys) => {
	if (!obj) return false
	for (let key in obj) if (!keys.includes(key)) return false
	return true
}


const emailApp = (() => {


	const sendButton = document.querySelector('#envieEmail')

	if (!emailjs || !sendButton) return false

	const disabledForm = () => {
		sendButton.innerHTML = `Email enviado <i class='bx bx-check' ></i>`
		sendButton.onclick = () => { }
		sendButton.setAttribute('block', true)
		disableForm('emails')
		localStorage.setItem('email', 'true')
	}

	if (localStorage.getItem('email') == 'true') {
		disabledForm()
		return true
	}

	emailjs.init("PnosOxDOqQbd_P3zo")

	sendButton.onclick = async () => {

		if (sendButton.attributes.block?.value) return
		sendButton.setAttribute('block', true)
		sendButton.setAttribute('load', '')

		const form = getForm('emails')

		if (!validForm(form, ['name', 'email', 'subject', 'messagem'])) {
			sendButton.removeAttribute('block')
			sendButton.removeAttribute('load')
			console.log('invalidForm')
			return false
		}

		const { text } = await emailjs.send('service_odylwal', 'template_e8bkymp', form)

		sendButton.removeAttribute('load')

		if (text == 'OK') {
			disabledForm()
			return true
		} else {
			sendButton.innerHTML = `Erro ao enviar o email <i class='bx bx-error error' ></i>`
		}

		await time(2000)
		sendButton.innerText = 'ENVIAR EMAIL'
		sendButton.removeAttribute('block')
	}

})()
