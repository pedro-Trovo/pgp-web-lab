import { Injectable, signal } from '@angular/core';

interface LangOption { code: string; label: string; }

const translations: Record<string, Record<string, unknown>> = {
  'pt-BR': {
    nav: { 
      home: 'Início', 
      generateKeys: 'Gerar Chaves', 
      encryptMessage: 'Criptografar Mensagem', 
      decryptMessage: 'Descriptografar Mensagem', 
      encryptFile: 'Criptografar Arquivo', 
      decryptFile: 'Descriptografar Arquivo',
      about: 'Sobre'
    },
    home: {
      generateDesc: 'Crie seu par de chaves PGP para criptografia assimétrica',
      encryptMsgDesc: 'Cifre uma mensagem usando a chave pública do destinatário',
      decryptMsgDesc: 'Decifre uma mensagem usando sua chave privada',
      encryptFileDesc: 'Cifre um arquivo usando a chave pública do destinatário',
      decryptFileDesc: 'Decifre um arquivo usando sua chave privada',
      aboutLink: 'Sobre o projeto'
    },
    common: { 
      generate: 'Gerar', encrypt: 'Criptografar', decrypt: 'Descriptografar', 
      copy: 'Copiar', download: 'Baixar', import: 'Importar', export: 'Exportar', 
      clear: 'Limpar', cancel: 'Cancelar', confirm: 'Confirmar', 
      success: 'Sucesso', error: 'Erro', warning: 'Aviso', info: 'Informação', 
      copied: 'Copiado!', processing: 'Processando...', language: 'Idioma', 
      downloaded: 'Baixado!',
      errorOccurred: 'Erro'
    },
    fingerprint: {
      title: 'Fingerprint'
    },
    about: {
      title: 'Sobre o PGP Web Lab',
      whatIs: {
        title: 'O que é PGP?',
        description: 'PGP (Pretty Good Privacy) é um programa de criptografia que fornece privacidade e autenticação para comunicação digital. Utiliza criptografia de chave pública para proteger mensagens, arquivos e dados sensíveis.'
      },
      howWorks: {
        title: 'Como funciona?',
        description: 'Cada usuário possui um par de chaves: uma pública para criptografar e uma privada para descriptografar. Qualquer pessoa pode usar sua chave pública para enviar mensagens seguras, mas apenas você, com sua chave privada, pode descriptografá-las.'
      },
      clientSide: {
        title: 'Processamento Local',
        description: 'Todo o processamento ocorre exclusivamente no seu navegador. Suas chaves privadas nunca saem do seu dispositivo. Não há servidores envolvidos, garantindo máxima segurança e privacidade.'
      },
      openSource: {
        title: 'Código Aberto',
        description: 'Este projeto é de código aberto e utiliza OpenPGP.js para implementações criptográficas. A transparência do código permite auditoria de segurança pela comunidade.'
      }
    },
    key: {
      generate: { 
        title: 'Gerar Par de Chaves PGP', 
        subtitle: 'Crie um novo par de chaves PGP para criptografia assimétrica',
        usePassphrase: 'Proteger com senha',
        passphrase: 'Senha', 
        passphrasePlaceholder: 'Digite uma senha (mínimo 8 caracteres)', 
        passphraseHint: 'Guarde em local seguro! Não pode ser recuperada.',
        keySize: 'Tamanho da Chave', 
        bits2048: '2048 bits (Rápido)', 
        bits4096: '4096 bits (Recomendado)', 
        generating: 'Gerando chaves...', 
        generateButton: 'Gerar Chaves',
        publicKey: 'Chave Pública', 
        privateKey: 'Chave Privada', 
        fingerprint: 'Impressão Digital', 
        fingerprintHint: 'Compare com o destinatário por canal confiável', 
        download: 'Baixar',
        copyPublic: 'Copiar Pública', 
        copyPrivate: 'Copiar Privada',
        success: 'Chaves geradas com sucesso!',
        warningPrivate: '⚠️ Nunca compartilhe sua chave privada!',
        newPair: 'Gerar Novo Par de Chaves'
      },
      stored: {
        fingerprint: 'Impressão Digital',
        remove: 'Remover'
      },
      card: {
        unknown: 'Desconhecido',
        public: 'Pública',
        private: 'Privada'
      }
    },
    footer: {
      processing: 'Todo processamento ocorre localmente no seu navegador. Nenhuma chave é enviada a servidores.',
      copyright: 'PGP Web Lab © 2026'
    },
    message: {
      encrypt: { 
        title: 'Criptografar Mensagem', 
        subtitle: 'Cifre uma mensagem usando a chave pública do destinatário',
        recipientKey: 'Chave Pública do Destinatário', 
        recipientKeyPlaceholder: 'Cole ou importe a chave pública PGP',
        message: 'Mensagem', 
        messagePlaceholder: 'Digite sua mensagem secreta aqui...', 
        encrypted: 'Mensagem Criptografada', 
        encryptedHint: 'Copie e envie ao destinatário',
        success: 'Mensagem criptografada com sucesso!'
      },
      decrypt: { 
        title: 'Descriptografar Mensagem', 
        subtitle: 'Decifre uma mensagem usando sua chave privada',
        encryptedMessage: 'Mensagem Criptografada', 
        encryptedPlaceholder: 'Cole a mensagem criptografada aqui...', 
        privateKey: 'Sua Chave Privada', 
        privateKeyPlaceholder: 'Cole ou importe sua chave privada PGP',
        usePassphrase: 'Minha chave tem senha',
        passphrase: 'Senha', 
        passphrasePlaceholder: 'Digite sua senha', 
        decrypted: 'Mensagem Descriptografada', 
        decryptedHint: 'Mensagem original',
        success: 'Mensagem descriptografada com sucesso!'
      }
    },
    file: {
      input: {
        placeholder: 'Clique ou arraste arquivo de chave (.asc, .gpg, .pgp)',
        maxSize: 'Máximo 100KB'
      },
      drop: {
        placeholder: 'Arraste um arquivo aqui ou clique para selecionar'
      },
      encrypt: { 
        title: 'Criptografar Arquivo', 
        subtitle: 'Cifre um arquivo usando a chave pública do destinatário',
        selectFile: 'Selecionar Arquivo', 
        dropFile: 'Arraste um arquivo aqui ou clique para selecionar', 
        fileInfo: 'Informações do Arquivo', 
        fileName: 'Nome', 
        fileSize: 'Tamanho', 
        fileType: 'Tipo', 
        recipientKey: 'Chave Pública do Destinatário', 
        recipientKeyPlaceholder: 'Cole ou importe a chave pública PGP', 
        encrypting: 'Criptografando...', 
        downloadEncrypted: 'Baixar Arquivo Criptografado', 
        maxSize: 'Tamanho máximo: 10 MB',
        success: 'Arquivo criptografado com sucesso!'
      },
      decrypt: { 
        title: 'Descriptografar Arquivo', 
        subtitle: 'Decifre um arquivo usando sua chave privada',
        selectFile: 'Selecionar Arquivo Criptografado', 
        dropEncrypted: 'Arraste o arquivo .pgp aqui ou clique para selecionar', 
        privateKey: 'Sua Chave Privada', 
        privateKeyPlaceholder: 'Cole ou importe sua chave privada PGP', 
        usePassphrase: 'Minha chave tem senha',
        passphrase: 'Senha', 
        passphrasePlaceholder: 'Digite sua senha', 
        decrypting: 'Descriptografando...', 
        downloadDecrypted: 'Baixar Arquivo Original',
        success: 'Arquivo descriptografado com sucesso!'
      }
    },
    validation: { 
      required: 'Campo obrigatório', 
      invalidEmail: 'Email inválido', 
      minLength: 'Mínimo de {min} caracteres', 
      invalidKey: 'Chave PGP inválida', 
      fileTooLarge: 'Arquivo muito grande (máximo 100KB para chaves, 10MB para arquivos)'
    }
  },
  en: {
    nav: { 
      home: 'Home', 
      generateKeys: 'Generate Keys', 
      encryptMessage: 'Encrypt Message', 
      decryptMessage: 'Decrypt Message', 
      encryptFile: 'Encrypt File', 
      decryptFile: 'Decrypt File',
      about: 'About'
    },
    home: {
      generateDesc: 'Create your PGP key pair for asymmetric encryption',
      encryptMsgDesc: 'Encrypt a message using the recipients public key',
      decryptMsgDesc: 'Decrypt a message using your private key',
      encryptFileDesc: 'Encrypt a file using the recipients public key',
      decryptFileDesc: 'Decrypt a file using your private key',
      aboutLink: 'About the project'
    },
    common: { 
      generate: 'Generate', encrypt: 'Encrypt', decrypt: 'Decrypt', 
      copy: 'Copy', download: 'Download', import: 'Import', export: 'Export', 
      clear: 'Clear', cancel: 'Cancel', confirm: 'Confirm', 
      success: 'Success', error: 'Error', warning: 'Warning', info: 'Information', 
      copied: 'Copied!', processing: 'Processing...', language: 'Language', 
      downloaded: 'Downloaded!',
      errorOccurred: 'Error'
    },
    fingerprint: {
      title: 'Fingerprint'
    },
    about: {
      title: 'About PGP Web Lab',
      whatIs: {
        title: 'What is PGP?',
        description: 'PGP (Pretty Good Privacy) is an encryption program that provides privacy and authentication for digital communication. It uses public key cryptography to protect messages, files, and sensitive data.'
      },
      howWorks: {
        title: 'How does it work?',
        description: 'Each user has a key pair: a public key to encrypt and a private key to decrypt. Anyone can use your public key to send secure messages, but only you, with your private key, can decrypt them.'
      },
      clientSide: {
        title: 'Local Processing',
        description: 'All processing occurs exclusively in your browser. Your private keys never leave your device. There are no servers involved, ensuring maximum security and privacy.'
      },
      openSource: {
        title: 'Open Source',
        description: 'This project is open source and uses OpenPGP.js for cryptographic implementations. Code transparency allows security auditing by the community.'
      }
    },
    key: {
      generate: { 
        title: 'Generate PGP Key Pair', 
        subtitle: 'Create a new PGP key pair for asymmetric encryption',
        usePassphrase: 'Protect with password',
        passphrase: 'Password', 
        passphrasePlaceholder: 'Enter a password (minimum 8 characters)', 
        passphraseHint: 'Keep it safe! Cannot be recovered.',
        keySize: 'Key Size', 
        bits2048: '2048 bits (Fast)', 
        bits4096: '4096 bits (Recommended)', 
        generating: 'Generating keys...', 
        generateButton: 'Generate Keys',
        publicKey: 'Public Key', 
        privateKey: 'Private Key', 
        fingerprint: 'Fingerprint', 
        fingerprintHint: 'Compare with recipient via trusted channel', 
        download: 'Download',
        copyPublic: 'Copy Public', 
        copyPrivate: 'Copy Private',
        success: 'Keys generated successfully!',
        warningPrivate: '⚠️ Never share your private key!',
        newPair: 'Generate New Key Pair'
      },
      stored: {
        fingerprint: 'Fingerprint',
        remove: 'Remove'
      },
      card: {
        unknown: 'Unknown',
        public: 'Public',
        private: 'Private'
      }
    },
    footer: {
      processing: 'All processing occurs locally in your browser. No keys are sent to servers.',
      copyright: 'PGP Web Lab © 2026'
    },
    message: {
      encrypt: { 
        title: 'Encrypt Message', 
        subtitle: 'Encrypt a message using the recipients public key',
        recipientKey: 'Recipients Public Key', 
        recipientKeyPlaceholder: 'Paste or import the PGP public key',
        message: 'Message', 
        messagePlaceholder: 'Type your secret message here...', 
        encrypted: 'Encrypted Message', 
        encryptedHint: 'Copy and send to the recipient',
        success: 'Message encrypted successfully!'
      },
      decrypt: { 
        title: 'Decrypt Message', 
        subtitle: 'Decrypt a message using your private key',
        encryptedMessage: 'Encrypted Message', 
        encryptedPlaceholder: 'Paste the encrypted message here...', 
        privateKey: 'Your Private Key', 
        privateKeyPlaceholder: 'Paste or import your PGP private key',
        usePassphrase: 'My key has password',
        passphrase: 'Password', 
        passphrasePlaceholder: 'Enter your password', 
        decrypted: 'Decrypted Message', 
        decryptedHint: 'Original message',
        success: 'Message decrypted successfully!'
      }
    },
    file: {
      input: {
        placeholder: 'Click or drag key file (.asc, .gpg, .pgp)',
        maxSize: 'Maximum 100KB'
      },
      drop: {
        placeholder: 'Drag a file here or click to select'
      },
      encrypt: { 
        title: 'Encrypt File', 
        subtitle: 'Encrypt a file using the recipients public key',
        selectFile: 'Select File', 
        dropFile: 'Drag a file here or click to select', 
        fileInfo: 'File Information', 
        fileName: 'Name', 
        fileSize: 'Size', 
        fileType: 'Type', 
        recipientKey: 'Recipients Public Key', 
        recipientKeyPlaceholder: 'Paste or import the PGP public key', 
        encrypting: 'Encrypting...', 
        downloadEncrypted: 'Download Encrypted File', 
        maxSize: 'Maximum size: 10 MB',
        success: 'File encrypted successfully!'
      },
      decrypt: { 
        title: 'Decrypt File', 
        subtitle: 'Decrypt a file using your private key',
        selectFile: 'Select Encrypted File', 
        dropEncrypted: 'Drag the .pgp file here or click to select', 
        privateKey: 'Your Private Key', 
        privateKeyPlaceholder: 'Paste or import your PGP private key',
        usePassphrase: 'My key has password',
        passphrase: 'Password', 
        passphrasePlaceholder: 'Enter your password', 
        decrypting: 'Decrypting...', 
        downloadDecrypted: 'Download Original File',
        success: 'File decrypted successfully!'
      }
    },
    validation: { 
      required: 'Required field', 
      invalidEmail: 'Invalid email', 
      minLength: 'Minimum {min} characters', 
      invalidKey: 'Invalid PGP key', 
      fileTooLarge: 'File too large (max 100KB for keys, 10MB for files)'
    }
  },
  es: {
    nav: { 
      home: 'Inicio', 
      generateKeys: 'Generar Claves', 
      encryptMessage: 'Cifrar Mensaje', 
      decryptMessage: 'Descifrar Mensaje', 
      encryptFile: 'Cifrar Archivo',
      decryptFile: 'Descifrar Archivo',
      about: 'Acerca de'
    },
    home: {
      generateDesc: 'Crea tu par de claves PGP para cifrado asimétrico',
      encryptMsgDesc: 'Cifra un mensaje usando la clave pública del destinatario',
      decryptMsgDesc: 'Descifra un mensaje usando tu clave privada',
      encryptFileDesc: 'Cifra un archivo usando la clave pública del destinatario',
      decryptFileDesc: 'Descifra un archivo usando tu clave privada',
      aboutLink: 'Acerca del proyecto'
    }, 
    common: { 
      generate: 'Generar', encrypt: 'Cifrar', decrypt: 'Descifrar', 
      copy: 'Copiar', download: 'Descargar', import: 'Importar', export: 'Exportar', 
      clear: 'Limpiar', cancel: 'Cancelar', confirm: 'Confirmar', 
      success: 'Éxito', error: 'Error', warning: 'Advertencia', info: 'Información', 
      copied: '¡Copiado!', processing: 'Procesando...', language: 'Idioma', 
      downloaded: '¡Descargado!',
      errorOccurred: 'Error'
    },
    fingerprint: {
      title: 'Fingerprint'
    },
    about: {
      title: 'Acerca de PGP Web Lab',
      whatIs: {
        title: '¿Qué es PGP?',
        description: 'PGP (Pretty Good Privacy) es un programa de cifrado que proporciona privacidad y autenticación para la comunicación digital. Utiliza criptografía de clave pública para proteger mensajes, archivos y datos sensibles.'
      },
      howWorks: {
        title: '¿Cómo funciona?',
        description: 'Cada usuario tiene un par de claves: una pública para cifrar y una privada para descifrar. Cualquier persona puede usar tu clave pública para enviar mensajes seguros, pero solo tú, con tu clave privada, puedes descifrarlos.'
      },
      clientSide: {
        title: 'Procesamiento Local',
        description: 'Todo el procesamiento ocurre exclusivamente en tu navegador. Tus claves privadas nunca salen de tu dispositivo. No hay servidores involucrados, garantizando máxima seguridad y privacidad.'
      },
      openSource: {
        title: 'Código Abierto',
        description: 'Este proyecto es de código abierto y utiliza OpenPGP.js para implementaciones criptográficas. La transparencia del código permite auditoría de seguridad por la comunidad.'
      }
    },
    key: {
      generate: { 
        title: 'Generar Par de Claves PGP', 
        subtitle: 'Crea un nuevo par de claves PGP para cifrado asimétrico',
        usePassphrase: 'Proteger con contraseña',
        passphrase: 'Contraseña', 
        passphrasePlaceholder: 'Ingresa una contraseña (mínimo 8 caracteres)', 
        passphraseHint: '¡Guardala en un lugar seguro! No se puede recuperar.',
        keySize: 'Tamaño de Clave', 
        bits2048: '2048 bits (Rápido)', 
        bits4096: '4096 bits (Recomendado)', 
        generating: 'Generando claves...', 
        generateButton: 'Generar Claves',
        publicKey: 'Clave Pública', 
        privateKey: 'Clave Privada', 
        fingerprint: 'Fingerprint', 
        fingerprintHint: 'Compara con el destinatario por canal confiable', 
        download: 'Descargar',
        copyPublic: 'Copiar Pública', 
        copyPrivate: 'Copiar Privada',
        success: '¡Claves generadas exitosamente!',
        warningPrivate: '⚠️ ¡Nunca compartas tu clave privada!',
        newPair: 'Generar Nuevo Par de Claves'
      },
      stored: {
        fingerprint: 'Fingerprint',
        remove: 'Eliminar'
      },
      card: {
        unknown: 'Desconocido',
        public: 'Pública',
        private: 'Privada'
      }
    },
    footer: {
      processing: 'Todo el procesamiento ocurre localmente en tu navegador. Ninguna clave se envía a servidores.',
      copyright: 'PGP Web Lab © 2026'
    },
    message: {
      encrypt: { 
        title: 'Cifrar Mensaje', 
        subtitle: 'Cifra un mensaje usando la clave pública del destinatario',
        recipientKey: 'Clave Pública del Destinatario', 
        recipientKeyPlaceholder: 'Pega o importa la clave pública PGP',
        message: 'Mensaje', 
        messagePlaceholder: 'Escribe tu mensaje secreto aquí...', 
        encrypted: 'Mensaje Cifrado', 
        encryptedHint: 'Copia y envía al destinatario',
        success: '¡Mensaje cifrado exitosamente!'
      },
      decrypt: { 
        title: 'Descifrar Mensaje', 
        subtitle: 'Descifra un mensaje usando tu clave privada',
        encryptedMessage: 'Mensaje Cifrado', 
        encryptedPlaceholder: 'Pega el mensaje cifrado aquí...', 
        privateKey: 'Tu Clave Privada', 
        privateKeyPlaceholder: 'Pega o importa tu clave privada PGP',
        usePassphrase: 'Mi clave tiene contraseña',
        passphrase: 'Contraseña', 
        passphrasePlaceholder: 'Ingresa tu contraseña', 
        decrypted: 'Mensaje Descifrado', 
        decryptedHint: 'Mensaje original',
        success: '¡Mensaje descifrado exitosamente!'
      }
    },
    file: {
      input: {
        placeholder: 'Haz clic o arrastra archivo de clave (.asc, .gpg, .pgp)',
        maxSize: 'Máximo 100KB'
      },
      drop: {
        placeholder: 'Arrastra un archivo aquí o haz clic para seleccionar'
      },
      encrypt: { 
        title: 'Cifrar Archivo', 
        subtitle: 'Cifra un archivo usando la clave pública del destinatario',
        selectFile: 'Seleccionar Archivo', 
        dropFile: 'Arrastra un archivo aquí o haz clic para seleccionar', 
        fileInfo: 'Información del Archivo', 
        fileName: 'Nombre', 
        fileSize: 'Tamaño', 
        fileType: 'Tipo', 
        recipientKey: 'Clave Pública del Destinatario', 
        recipientKeyPlaceholder: 'Pega o importa la clave pública PGP', 
        encrypting: 'Cifrando...', 
        downloadEncrypted: 'Descargar Archivo Cifrado', 
        maxSize: 'Tamaño máximo: 10 MB',
        success: '¡Archivo cifrado exitosamente!'
      },
      decrypt: { 
        title: 'Descifrar Archivo', 
        subtitle: 'Descifra un archivo usando tu clave privada',
        selectFile: 'Seleccionar Archivo Cifrado', 
        dropEncrypted: 'Arrastra el archivo .pgp aquí o haz clic para seleccionar', 
        privateKey: 'Tu Clave Privada', 
        privateKeyPlaceholder: 'Pega o importa tu clave privada PGP', 
        usePassphrase: 'Mi clave tiene contraseña',
        passphrase: 'Contraseña', 
        passphrasePlaceholder: 'Ingresa tu contraseña', 
        decrypting: 'Descifrando...', 
        downloadDecrypted: 'Descargar Archivo Original',
        success: '¡Archivo descifrado exitosamente!'
      }
    },
    validation: { 
      required: 'Campo requerido', 
      invalidEmail: 'Correo inválido', 
      minLength: 'Mínimo {min} caracteres', 
      invalidKey: 'Clave PGP inválida', 
      fileTooLarge: 'Archivo muy grande (máx 100KB para claves, 10MB para archivos)'
    }
  }
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  private _currentLang = signal<string>(this.getBrowserLang());
  readonly currentLang = this._currentLang.asReadonly();
  readonly availableLangs: LangOption[] = [
    { code: 'pt-BR', label: 'Português' },
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' }
  ];

  private getBrowserLang(): string {
    const browserLang = navigator.language;
    if (browserLang.startsWith('pt')) return 'pt-BR';
    if (browserLang.startsWith('es')) return 'es';
    return 'en';
  }

  setLanguage(lang: string): void {
    if (translations[lang]) {
      this._currentLang.set(lang);
      localStorage.setItem('pgp-web-lab-lang', lang);
    }
  }

  initLanguage(): void {
    const saved = localStorage.getItem('pgp-web-lab-lang');
    if (saved && translations[saved]) {
      this._currentLang.set(saved);
    }
  }

  t(key: string, params?: Record<string, string | number>): string {
    const keys = key.split('.');
    let value: unknown = translations[this._currentLang()];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }

    if (typeof value !== 'string') return key;

    if (params) {
      return value.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`));
    }
    return value;
  }
}
