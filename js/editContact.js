document.addEventListener('DOMContentLoaded', function () {
    const url = 'http://localhost:9081/contacts';
    const addNewBtn = document.getElementById('addNewBtn');
    const saveBtn = document.getElementById('saveBtn');
    const txtName = document.getElementById('txtName');
    const txtAddress = document.getElementById('txtAddress');
    const txtPhoneNum = document.getElementById('txtPhoneNum');

    const pathName = window.location.hash.split('#');
    const id = pathName[1];

    if (id) {
        formInfoRender();
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

    function formInfoRender() {
        axios.get(url + '/' + id).then(function (response) {
            contact = response.data;
            txtName.value = contact.info.name;
            txtAddress.value = contact.info.address;
            txtPhoneNum.value = contact.info.phone;
        });
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
                    phone: phoneNum
                }
            };
            axios.post(url, newContact).then(function (response) {
                window.location = './';
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
                    phone: phoneNum
                }
            };
            axios.put(url + '/' + id, editedContact).then(function (response) {
                window.location = './';
            });
        }
    }

    function backToHome() {
        window.location = './';
    }
});