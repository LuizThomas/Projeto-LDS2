document.addEventListener('DOMContentLoaded', () => {
    const cadastroForm = document.getElementById('cadastroForm');
  
    cadastroForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
  
      if (password !== confirmPassword) {
        alert('As senhas não coincidem!');
        return;
      }
  
      const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        profile: document.getElementById('profile').value,
      };
  
      console.log('Novo cadastro:', formData);
      alert('Cadastro realizado com sucesso!');
      window.location.href = 'login.html';
    });
  });