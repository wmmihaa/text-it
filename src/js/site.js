(() => {
    const viewModel = {
        sender: ko.observable(),
        recipient: ko.observable(),
        message: ko.observable(),
        responseMessage: ko.observable(),
        errorMessage: ko.observable(),
        send: async (vm) => {
            vm.responseMessage('');
            vm.errorMessage('');
            const model = ko.toJS(vm);
            const response = await post('/sendMessage', model);
            if(response.error){
                vm.errorMessage(response.error);
            }
            else{
                vm.responseMessage('Success');    
            }
        }
    }
    ko.applyBindings(viewModel, document.getElementById("message-container"));
})()


function get(url) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                resolve(response);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                reject(thrownError);

                if (xhr.status === 401) {
                    location.reload();
                }
            },
            processData: false,
            async: true
        });
    });
}
function post(url, payload) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(payload),
            success: function (response) {
                resolve(response);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                reject(thrownError);
                if (xhr.status === 401) {
                    location.reload();
                }
            },
            processData: false,
            async: true
        });
    });
}