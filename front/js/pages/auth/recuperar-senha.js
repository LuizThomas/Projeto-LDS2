document.addEventListener('DOMContentLoaded', () => {
    const recoverForm = document.getElementById('recoverForm');
  
    recoverForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
  
      console.log('Solicitação de recuperação para:', email);
      alert(`Link de recuperação enviado para ${email}`);
    });
  });