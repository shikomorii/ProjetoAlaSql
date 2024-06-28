

document.addEventListener('DOMContentLoaded', function() {
    
    alasql('CREATE LOCALSTORAGE DATABASE IF NOT EXISTS agrosqldb');
    alasql('ATTACH LOCALSTORAGE DATABASE agrosqldb');

   
    alasql('CREATE TABLE IF NOT EXISTS agrosqldb.usuarios (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL)');


   
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

      
        const user = alasql('SELECT * FROM agrosqldb.usuarios WHERE username = ? AND password = ?', [username, password]);
        if (user.length > 0) {
            alert('Login bem-sucedido!');
            window.location.href = 'index.html';
        } else {
            alert('Usuário ou senha incorretos.');
        }
    });

    
    document.getElementById('config-icon').addEventListener('click', function() {
        document.getElementById('config-modal').style.display = 'block';
    });

    
    document.querySelector('.close').addEventListener('click', function() {
        document.getElementById('config-modal').style.display = 'none';
    });

    
   

    
    window.onclick = function(event) {
        if (event.target == document.getElementById('config-modal')) {
            document.getElementById('config-modal').style.display = 'none';
        }
    };
});
