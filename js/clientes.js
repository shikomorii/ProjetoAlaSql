

document.addEventListener('DOMContentLoaded', function() {
    
    var clientes = alasql('SELECT * FROM agrosqldb.clientes');


    if (clientes.length > 0) {
        
        var clientesListHTML = '<ul>';
        clientes.forEach(function(cliente) {
            clientesListHTML += '<li>';
            clientesListHTML += '<strong>Nome:</strong> ' + cliente.nome + '<br>';
            clientesListHTML += '<strong>CPF:</strong> ' + cliente.cpf + '<br>';
            clientesListHTML += '<strong>Data de Nascimento:</strong> ' + cliente.data_nascimento + '<br>';
            clientesListHTML += '<strong>Telefone:</strong> ' + cliente.telefone + '<br>';
            clientesListHTML += '<strong>Celular:</strong> ' + cliente.celular + '<br>';
            clientesListHTML += '<strong>CEP:</strong> ' + cliente.cep + '<br>';
            clientesListHTML += '<strong>Rua:</strong> ' + cliente.rua + '<br>';
            clientesListHTML += '<strong>Estado:</strong> ' + cliente.estado + '<br>';
            clientesListHTML += '<strong>País:</strong> ' + cliente.pais + '<br>';
            clientesListHTML += '</li>';
        });
        clientesListHTML += '</ul>';

        
        document.getElementById('clientes-list').innerHTML = clientesListHTML;
    } else {
     
        document.getElementById('clientes-list').innerHTML = '<p>Nenhum cliente cadastrado.</p>';
    }
});
