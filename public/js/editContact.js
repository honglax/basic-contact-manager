document.addEventListener('DOMContentLoaded', function () {
    const addNewBtn = document.getElementById('addNewBtn');
    const saveBtn = document.getElementById('saveBtn');
    const txtName = document.getElementById('txtName');
    const txtAddress = document.getElementById('txtAddress');
    const txtPhoneNum = document.getElementById('txtPhoneNum');

    const pathName = window.location.hash.split('#');
    const id = pathName[1];
    const db = firebase.firestore();

    if (id) {
        formRender();
    }

    txtName.focus();

    if (backBtn) {
        backBtn.addEventListener('click', backToHome);
    }

    if (addNewBtn) {
        addNewBtn.addEventListener('click', addNewContact);
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', saveContact);
    }

    function formRender() {
        const docRef = db.collection('contacts').doc(id);
        docRef.get().then(function (doc) {
            if (doc.exists) {
                data = doc.data();
                txtName.value = data.info.name;
                txtAddress.value = data.info.address;
                txtPhoneNum.value = data.info.phoneNum;
            } else {
                console.log('No such document!');
            }
        }).catch(function (err) {
            console.log('Error getting document: ', err);
        })
    }

    function formValidation() {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        const forms = document.getElementsByClassName('needs-validation');
        let validation = Array.prototype.filter.call(forms, function (form) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    };

    function addNewContact(event) {
        const fullName = txtName.value;
        const address = txtAddress.value;
        const phoneNum = txtPhoneNum.value;

        if ((!fullName) || (!address) || (!phoneNum)) {
            formValidation();
        } else {
            let newContact = {
                info: {
                    name: fullName,
                    address: address,
                    phoneNum: phoneNum
                }
            };
            db.collection('contacts').add(newContact).then(function (docRef) {
                console.log('Document written with ID: ', docRef.id);
                window.location = './';
            }).catch(function (err) {
                console.log('Error adding document: ', err);
            });

        }
    };

    function saveContact(event) {
        const fullName = txtName.value;
        const address = txtAddress.value;
        const phoneNum = txtPhoneNum.value;

        if ((!fullName) || (!address) || (!phoneNum)) {
            formValidation();
        } else {
            let editedContact = {
                info: {
                    name: fullName,
                    address: address,
                    phoneNum: phoneNum
                }
            };
            db.collection('contacts').doc(id).set(editedContact).then(function () {
                window.location = './';
            }).catch(function (err) {
                console.log('Error writing document: ', err);
            })
        }
    }

    function backToHome() {
        window.location = './';
    }
});