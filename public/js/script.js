document.addEventListener('DOMContentLoaded', function () {
    const contactTable = document.getElementById('contact-info');
    const contactBody = contactTable.children[1];
    const editBtn = '<button type="button" class="btn btn-outline-info btn-sm" data-type="edtBtn">Edit Contact</button>';
    const deleteBtn = '<button type="button" class="btn btn-outline-danger btn-sm" data-type="delBtn" data-toggle="modal" data-target="#myModal">Delete Contact</button>';
    const addBtn = document.getElementById('addNewBtn');
    const btnConfirmDelete = document.getElementById('btnConfirmDelete');
    const txtSearch = document.getElementById('txtSearch');
    const searchMethod = document.getElementById('searchMethod');

    let contacts = [];
    const db = firebase.firestore();

    function getContacts() {
        db.collection('contacts').get().then(function (snapshot) {
            collections = snapshot.docs;
            render(collections);
        });
    }

    getContacts();
    contactBody.addEventListener('click', onContactClicked);
    addBtn.addEventListener('click', function (event) {
        window.location = './add-contact.html';
    });

    btnConfirmDelete.addEventListener('click', function (event) {
        let id = btnConfirmDelete.dataset.id;
        deleteContact(id);
        $('#myModal').modal('toggle');
    });

    txtSearch.addEventListener('input', searchContact);
    txtSearch.focus();
    searchMethod.addEventListener('change', searchContact);

    function render(collections) {
        let content = collections.map(function (contact) {
            let data = contact.data();
            let newContact = {
                id: contact.id,
                info: {
                    name: data.info.name,
                    address: data.info.address,
                    phoneNum: data.info.phoneNum
                }
            }
            contacts.push(newContact);
            return '<tr data-id="' + newContact.id + '"><th scope="row">' + (contacts.indexOf(newContact) + 1) + '</th><td>' + newContact.info.name + '</td><td>' + newContact.info.address + '</td><td>' + newContact.info.phoneNum + '</td><td>' + editBtn + '</td><td>' + deleteBtn + '</td></tr>'
        });
        contactBody.innerHTML = content.join('');
    };

    function renderByArr(contacts) {
        let content = contacts.map(function (contact) {
            return '<tr data-id="' + contact.id + '"><th scope="row">' + (contacts.indexOf(contact) + 1) + '</th><td>' + contact.info.name + '</td><td>' + contact.info.address + '</td><td>' + contact.info.phoneNum + '</td><td>' + editBtn + '</td><td>' + deleteBtn + '</td></tr>'
        });
        contactBody.innerHTML = content.join('');
    }

    function onContactClicked(event) {
        var button = event.target;
        if (button.localName != 'button') {
            return;
        }
        var id = button.parentNode.parentNode.dataset.id;
        if (button.dataset.type == 'edtBtn') {
            window.location = './edit-contact.html#' + id;
        }
        if (button.dataset.type == 'delBtn') {
            btnConfirmDelete.setAttribute('data-id', id);
        }
    };

    function deleteContact(id) {
        // newContacts = contacts.filter(function (contact) {
        //     return contact.id != id;
        // });
        db.collection('contacts').doc(id).delete().then(function () {
            getContacts();
        }).catch(function (error) {
            console.log('Error removing document: ', error);
        });
        newContacts = contacts.filter(function (contact) {
            return contact.id != id;
        });
        contacts = newContacts;
    };

    function searchContact(event) {
        let method = searchMethod.value;
        let searchKey = txtSearch.value.toLowerCase();
        let resultedContacts = [];
        switch (method) {
            case 'name':
                resultedContacts = contacts.filter(function (contact) {
                    return contact.info.name.toLowerCase().includes(searchKey);
                });

                break;
            case 'phone':
                resultedContacts = contacts.filter(function (contact) {
                    return contact.info.phoneNum.includes(searchKey);
                });
                break;
            default:
                break;
        };
        renderByArr(resultedContacts);
    };

});