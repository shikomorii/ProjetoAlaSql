document.addEventListener('DOMContentLoaded', function() {
   
    alasql('CREATE LOCALSTORAGE DATABASE IF NOT EXISTS agrosqldb');
    alasql('ATTACH LOCALSTORAGE DATABASE agrosqldb');

   
    alasql('CREATE TABLE IF NOT EXISTS agrosqldb.clientes (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255) NOT NULL, cpf VARCHAR(14) UNIQUE, data_nascimento DATE, telefone VARCHAR(15), celular VARCHAR(15), cep VARCHAR(10), rua VARCHAR(255), estado VARCHAR(50), pais VARCHAR(50), endereco_principal VARCHAR(255), outros_enderecos VARCHAR)');

    
    function loadTableData() {
        var res = alasql('SELECT * FROM agrosqldb.clientes');
        var tableBody = document.querySelector('#clients-table tbody');
        tableBody.innerHTML = ''; 

        if (res.length > 0) {
            res.forEach(function(cliente) {
                var row = document.createElement('tr');
                row.innerHTML = '<td data-label="Nome">' + (cliente.nome || '') + '</td>' +
                                '<td data-label="CPF">' + (cliente.cpf || '') + '</td>' +
                                '<td data-label="Data de Nascimento">' + (cliente.data_nascimento || '') + '</td>' +
                                '<td data-label="Telefone">' + (cliente.telefone || '') + '</td>' +
                                '<td data-label="Celular">' + (cliente.celular || '') + '</td>' +
                                '<td data-label="CEP">' + (cliente.cep || '') + '</td>' +
                                '<td data-label="Rua">' + (cliente.rua || '') + '</td>' +
                                '<td data-label="Estado">' + (cliente.estado || '') + '</td>' +
                                '<td data-label="País">' + (cliente.pais || '') + '</td>' +
                                '<td data-label="Ações"><button class="delete-button" data-id="' + cliente.id + '">Excluir</button></td>';
                tableBody.appendChild(row);
            });
        } else {
            tableBody.innerHTML = '<tr><td colspan="10">Nenhum cliente cadastrado.</td></tr>'; 
        }
    }

    loadTableData();

   
    document.getElementById('formCliente').addEventListener('submit', function(event) {
        event.preventDefault(); 

        
        var nome = document.getElementById('Nome').value;
        var cpf = document.getElementById('cpf').value;
        var dataNascimento = document.getElementById('Data').value;
        var telefone = document.getElementById('telefone').value;
        var celular = document.getElementById('celular').value;
        var cepPrincipal = document.getElementById('cep').value;
        var ruaPrincipal = document.getElementById('rua').value;
        var estadoPrincipal = document.getElementById('Estado').value;    
        var paisPrincipal = document.getElementById('Pais').value;

        
        var existingClient = alasql('SELECT * FROM agrosqldb.clientes WHERE cpf = ?', [cpf]);
        if (existingClient.length > 0) {
            alert('CPF já cadastrado. Por favor, verifique.');
            return;
        }

        
        var outrosEnderecos = [];
        var outrosEnderecosInputs = document.querySelectorAll('#outrosEnderecos .endereco');
        outrosEnderecosInputs.forEach(function(input) {
            var endereco = input.querySelector('input[name="outroEndereco"]').value;
            var cep = input.querySelector('input[name="cep"]').value;
            var rua = input.querySelector('input[name="rua"]').value;
            var estado = input.querySelector('input[name="Estado"]').value;
            var pais = input.querySelector('input[name="Pais"]').value;
            outrosEnderecos.push({ endereco: endereco, cep: cep, rua: rua, estado: estado, pais: pais });
        });

        
        alasql('INSERT INTO agrosqldb.clientes (nome, cpf, data_nascimento, telefone, celular, cep, rua, estado, pais, endereco_principal, outros_enderecos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
               [nome, cpf, dataNascimento, telefone, celular, cepPrincipal, ruaPrincipal, estadoPrincipal, paisPrincipal, JSON.stringify(outrosEnderecos)]);

        
        document.getElementById('formCliente').reset();

        
        loadTableData();

        
        alert('Cliente cadastrado com sucesso!');
    });

    
    document.querySelector('#clients-table').addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-button')) {
            var id = event.target.getAttribute('data-id');
            alasql('DELETE FROM agrosqldb.clientes WHERE id = ?', [parseInt(id)]);
            loadTableData();
        }
    });

    
    document.getElementById('export-json').addEventListener('click', function() {
        var data = alasql('SELECT * FROM agrosqldb.clientes');
        
        data.forEach(function(cliente) {
            cliente.outros_enderecos = JSON.parse(cliente.outros_enderecos || '[]');
        });
        var json = JSON.stringify(data, null, 2);
        var blob = new Blob([json], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'clientes.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    
    document.getElementById('upload-sql').addEventListener('click', function() {
        console.log('Botão de upload de SQL clicado'); 
        var fileInput = document.getElementById('upload-sql-file');
        var file = fileInput.files[0];
        
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var sql = e.target.result;
                console.log('Conteúdo do arquivo SQL:', sql); 
                alasql.promise(sql).then(function() {
                    loadTableData();
                    document.getElementById('importSuccessMessage').style.display = 'block';
                    setTimeout(function() {
                        document.getElementById('importSuccessMessage').style.display = 'none';
                    }, 3000);
                }).catch(function(err) {
                    console.error('Erro ao executar o SQL:', err); 
                });
            };
            reader.readAsText(file);
        } else {
            console.log('Nenhum arquivo selecionado'); 
        }
    });

    
    document.getElementById('addEndereco').addEventListener('click', function() {
        var outrosEnderecosDiv = document.getElementById('outrosEnderecos');
        var enderecoDiv = document.createElement('div');
        enderecoDiv.classList.add('endereco');
        enderecoDiv.innerHTML = '<hr>' +
                                '<label for="outroEndereco">Endereço:</label>' +
                                '<input type="text" id="outroEndereco" name="outroEndereco">' +
                                '<label for="cep">CEP:</label>' +
                                '<input type="text" id="cep" name="cep">' +
                                '<label for="rua">Rua:</label>' +
                                '<input type="text" id="rua" name="rua">' +
                                '<label for="Estado">Estado:</label>' +
                                '<input type="text" id="Estado" name="Estado">' +
                                '<label for="Pais">País:</label>' +
                                '<input type="text" id="Pais" name="Pais">' +
                                '<button type="button" class="removeEndereco">X</button>';
        outrosEnderecosDiv.appendChild(enderecoDiv);
    });

    
    document.getElementById('outrosEnderecos').addEventListener('click', function(event) {
        if (event.target.classList.contains('removeEndereco')) {
            event.target.parentElement.remove();
        }
    });
});
