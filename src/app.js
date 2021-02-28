import firebase from 'firebase/app';
import 'firebase/storage';
import {upload} from './upload.js';

const firebaseConfig = {
    apiKey: "AIzaSyA1wSNOBDpB56fHNAt3ddBjQPqOhS6o-Vc",
    authDomain: "fe-upload-1da29.firebaseapp.com",
    projectId: "fe-upload-1da29",
    storageBucket: "fe-upload-1da29.appspot.com",
    messagingSenderId: "64858456153",
    appId: "1:64858456153:web:e6112b3acf27b5aa35f148"
};
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

upload('#file', {
    multiple: true,
    accept: ['.png', '.jpg', '.jpeg', '.gif'],
    onUpload(files, blocks)  {
        files.forEach( (file, index) => {
            const ref = storage.ref(`images/${file.name}`);
            const task = ref.put(file);
            task.on('state_changed', snapshot => {
                const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%';
                const block = blocks[index].querySelector('.preview-info-progress');
                block.textContent = percentage;
                block.style.width = percentage;
            }, error => {
                console.log(error);
            }, () => {
                task.snapshot.ref.getDownloadURL().then(url => {
                    console.log(url);
                })
            })
        });
    }
});