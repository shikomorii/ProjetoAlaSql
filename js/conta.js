document.addEventListener('DOMContentLoaded', function() {
   
    alasql('CREATE LOCALSTORAGE DATABASE IF NOT EXISTS agrosqldb');
    alasql('ATTACH LOCALSTORAGE DATABASE agrosqldb');

    
    alasql('CREATE TABLE IF NOT EXISTS agrosqldb.usuarios (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL)');

   
    document.getElementById('registerForm').addEventListener('submit', function(event) {
        event.preventDefault(); 

       
        const username = document.getElementById('newUsername').value;
        const password = document.getElementById('newPassword').value;

        
        const existingUser = alasql('SELECT * FROM agrosqldb.usuarios WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            alert('Usuário já existe. Por favor, escolha outro nome de usuário.');
        } else {
            
            alasql('INSERT INTO agrosqldb.usuarios (username, password) VALUES (?, ?)', [username, password]);

            
            document.getElementById('registerForm').reset();

            
            alert('Conta criada com sucesso!');
            window.location.href = 'login.html';
        }
    });
});
