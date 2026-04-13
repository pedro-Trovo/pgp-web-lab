<h1 align="center">PGP Web Lab</h1>
<p align="center">
<strong>Criptografia OpenPGP diretamente no navegador</strong><br>
Gerador de chaves PGP, criptografia e descriptografia de mensagens e arquivos - 100% client-side.
</p>
<h2 align="center">Sobre o PGP Web Lab</h2>
**PGP Web Lab** é uma ferramenta para criptografia de mensagens e arquivos utilizando o padrão **OpenPGP**.
- Geração de pares de chaves PGP (públicas e privadas)
- Criptografia e descriptografia de mensagens
- Criptografia e descriptografia de arquivos
- **Processamento 100% local** - suas chaves nunca saem do navegador
<h2 align="center">Funcionalidades</h2>
- **Gerar Chaves PGP** - Crie seu par de chaves pública/privada
- **Criptografar Mensagem** - Cifre mensagens usando a chave pública do destinatário
- **Descriptografar Mensagem** - Decifre mensagens usando sua chave privada
- **Criptografar Arquivo** - Cifre arquivos usando a chave pública do destinatário
- **Descriptografar Arquivo** - Decifre arquivos usando sua chave privada
<h2 align="center">Tecnologias</h2>
<h2 align="center">Tecnologias</h2>

O **PGP Web Lab** foi desenvolvido como uma aplicação **100% client-side**, sem necessidade de backend.

O **frontend** foi construído com **Angular 18**, utilizando **Bootstrap 5** para estilização e **Bootstrap Icons** para os ícones da interface.

A **criptografia** é realizada inteiramente no navegador utilizando a biblioteca **OpenPGP.js**, garantindo que nenhuma chave privada seja enviada para servidores externos.

O **deploy** da aplicação é feito na **Vercel**, com build automatizado a partir do repositório GitHub.

<table align="center">
  <tr>
    <th></th>
    <th>Frontend</th>
    <th>Criptografia</th>
    <th>Deploy</th>
  </tr>

  <tr>
    <th>Linguagens</th>
    <td>
      <a href="https://www.typescriptlang.org/">
        <img alt="TypeScript" src="https://img.shields.io/badge/typescript-%233178C6.svg?style=for-the-badge&logo=typescript&logoColor=white"/>
      </a>
      <a href="https://developer.mozilla.org/en-US/docs/Web/HTML">
        <img alt="HTML5" src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white"/>
      </a>
      <a href="https://developer.mozilla.org/en-US/docs/Web/CSS">
        <img alt="CSS3" src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white"/>
      </a>
    </td>
    <td>
      <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">
        <img alt="JavaScript" src="https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black"/>
      </a>
    </td>
    <td>
      <a href="https://vercel.com/">
        <img alt="Vercel" src="https://img.shields.io/badge/vercel-000000.svg?style=for-the-badge&logo=vercel&logoColor=white"/>
      </a>
    </td>
  </tr>

  <tr>
    <th>Frameworks / Bibliotecas</th>
    <td>
      <a href="https://angular.dev/">
        <img alt="Angular" src="https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white"/>
      </a>
      <a href="https://getbootstrap.com/">
        <img alt="Bootstrap" src="https://img.shields.io/badge/bootstrap-%237952B3.svg?style=for-the-badge&logo=bootstrap&logoColor=white"/>
      </a>
      <a href="https://icons.getbootstrap.com/">
        <img alt="Bootstrap Icons" src="https://img.shields.io/badge/bootstrap%20icons-%237952B3.svg?style=for-the-badge&logo=bootstrap&logoColor=white"/>
      </a>
    </td>
    <td>
      <a href="https://openpgpjs.org/">
        <img alt="OpenPGP.js" src="https://img.shields.io/badge/openpgp.js-009688.svg?style=for-the-badge"/>
      </a>
    </td>
    <td>
      <a href="https://git-scm.com/">
        <img alt="Git" src="https://img.shields.io/badge/git-F05032.svg?style=for-the-badge&logo=git&logoColor=white"/>
      </a>
      <a href="https://github.com/">
        <img alt="GitHub" src="https://img.shields.io/badge/github-181717.svg?style=for-the-badge&logo=github&logoColor=white"/>
      </a>
    </td>
  </tr>

  <tr>
    <th>IDE / Editor</th>
    <td>
      <a href="https://code.visualstudio.com/">
        <img alt="Visual Studio Code" src="https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white"/>
      </a>
    </td>
    <td>
      <a href="https://code.visualstudio.com/">
        <img alt="Visual Studio Code" src="https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white"/>
      </a>
    </td>
    <td>
      <a href="https://code.visualstudio.com/">
        <img alt="Visual Studio Code" src="https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white"/>
      </a>
    </td>
  </tr>
</table>
<h2 align="center">Segurança</h2>
Todo o processamento ocorre **exclusivamente no seu navegador**. Suas chaves privadas nunca são enviadas a servidores externos.
<h2 align="center">Executando Localmente</h2>
```bash
git clone https://github.com/pedro-Trovo/pgp-web-lab
cd pgp-web-lab
npm install
npm start
Acesse: http://localhost:4200
<h2 align="center">License</h2>
