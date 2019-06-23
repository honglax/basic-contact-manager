document.addEventListener('DOMContentLoaded', function () {
    const contactTable = document.getElementById('contact-info');
    const contactBody = contactTable.children[1];
    let contacts = [];
    const url = 'http://localhost:9081/contacts';
    const editBtn = '<button type="button" class="btn btn-outline-info btn-sm" data-type="edtBtn">Edit Contact</button>';
    const deleteBtn = '<button type="button" class="btn btn-outline-danger btn-sm" data-type="delBtn" data-toggle="modal" data-target="#myModal">Delete Contact</button>';
    const addBtn = document.getElementById('addNewBtn');
    const btnConfirmDelete = document.getElementById('btnConfirmDelete');
    const txtSearch = document.getElementById('txtSearch');
    const searchMethod = document.getElementById('searchMethod');

    axios.get(url).then(function (response) {
        contacts = response.data;
        render(contacts);
    });

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

    function render(contacts) {
        var content = contacts.map(function (contact) {
            return '<tr data-id="' + contact.id + '"><th scope="row">' + (contacts.indexOf(contact) + 1) + '</th><td>' + contact.info.name + '</td><td>' + contact.info.address + '</td><td>' + contact.info.phone + '</td><td>' + editBtn + '</td><td>' + deleteBtn + '</td></tr>'
        });
        contactBody.innerHTML = content.join('');
    };

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
        newContacts = contacts.filter(function (contact) {
            return contact.id != id;
        });
        render(newContacts);
        contacts = newContacts;
        axios.delete(url + '/' + id).then(function (response) {});
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
                    return contact.info.phone.includes(searchKey);
                });
                break;
            default:
                break;
        };
        render(resultedContacts);
    };

});