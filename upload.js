export function upload(selector) {
    const input = document.querySelector(selector);
    const buttonOpen = document.createElement('button');

    buttonOpen.classList.add('btn');
    buttonOpen.textContent = 'Открыть';
    input.insertAdjacentElement('afterend', buttonOpen);
}