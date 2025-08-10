export function recoverPasswordTemplate(name: string, recoveryCode: string) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Olá, ${name}!</h2>
      <p>Você solicitou a recuperação de senha da sua conta no <strong>Cattus</strong>.</p>
      <p>Use o código abaixo para redefinir sua senha:</p>
      <h1 style="color: #4CAF50;">${recoveryCode}</h1>
      <p style="font-size: 0.9em;">Se você não solicitou isso, ignore este e-mail.</p>
      <hr/>
      <p style="font-size: 0.8em;">© 2025 Cattus. Todos os direitos reservados.</p>
    </div>
  `;
}
