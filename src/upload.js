const bytesToSize = bytes => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (!bytes) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}

const element = (tag, classes = [], content) => {
    const node = document.createElement(tag);
    if (classes.length) {
        node.classList.add(...classes)
    }
    if (content) {
        node.textContent = content;
    }
    return node;
};

const noop = () => {};

export function upload(selector, options={}) {
    let files = [];
    const onUpload = options.onUpload ?? noop;
    const input = document.querySelector(selector);
    const preview = element('div', ['preview']);
    
    const buttonOpen = element('button', ['btn'], 'Открыть');

    const buttonUpload = element('button', ['btn', 'btn-primary'], 'Загрузить'); 
    buttonUpload.style.display = 'none';

    if (options.multiple) {
        input.setAttribute('multiple', true);
    }
    if (options.accept && Array.isArray(options.accept)) {
        input.setAttribute('accept', options.accept.join(','));
    }

    input.insertAdjacentElement('afterend', preview);
    input.insertAdjacentElement('afterend', buttonUpload);
    input.insertAdjacentElement('afterend', buttonOpen);

    const triggerInput = () => input.click();
    const changeHandler = event => {
        if (!event.target.files.length) return false; /* if it isn't file in upload */
        files = Array.from(event.target.files);
        preview.innerHTML = ''; /* reset files before new upload */
        buttonUpload.style.display = 'inline-block';
        files.forEach( file => {
            if(!file.type.match('image')) return false; /* if it isn't image in upload */
            const reader = new FileReader();

            reader.onload = ev => {
                const src = ev.target.result;
                preview.insertAdjacentHTML('afterbegin', `
                    <div class="preview-image">
                        <div class="preview-remove" data-name="${file.name}">&times;</div> 
                        <img src="${src}" alt="${file.name}" />
                        <div class="preview-info">
                            <span>${file.name}</span>
                            ${bytesToSize(file.size)}
                        </div>
                    </div>
                `);
            };
            reader.readAsDataURL(file);
        });
    };
    const removeHandler = event => {
        if (!event.target.dataset.name) return false;
        const {name} = event.target.dataset;
        files = files.filter(file => file.name !== name);

        if (!files.length) { /* if remove all files from array => disable button upload */
            buttonUpload.style.display = 'none';
        }

        const block = preview
            .querySelector(`[data-name="${name}"]`)
            .closest('.preview-image');

        block.classList.add('removing');    
        /* block.parentNode.removeChild(block); */
        setTimeout(() => block.remove(), 300);     
    };
    const clearPreview = element => {
        element.style.bottom = '4px';
        element.innerHTML = '<div class="preview-info-progress"></div>';
    }
    const uploadHandler = () => {
        preview
            .querySelectorAll('.preview-remove')
            .forEach( el => el.remove()); /* remove all close buttons in upload files */
        const previewInfo = preview.querySelectorAll('.preview-info')
        previewInfo.forEach(clearPreview)    

        onUpload(files, previewInfo);
    } 
    buttonOpen.addEventListener('click', triggerInput);
    buttonUpload.addEventListener('click', uploadHandler);
    input.addEventListener('change', changeHandler);
    preview.addEventListener('click', removeHandler);
}