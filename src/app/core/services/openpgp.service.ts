import { Injectable } from '@angular/core';
import * as openpgp from 'openpgp';

export interface KeyPair {
  publicKey: string;
  privateKey: string;
  fingerprint: string;
}

export interface KeyInfo {
  fingerprint: string;
  userIds: string[];
  creationTime: Date;
  algorithm: string;
  bits: number;
  type: 'public' | 'private';
}

@Injectable({ providedIn: 'root' })
export class OpenPGPService {
  async generateKeyPair(
    passphrase: string,
    numBits: 2048 | 4096 = 4096
  ): Promise<KeyPair> {
    const { privateKey, publicKey } = await openpgp.generateKey({
      type: 'rsa',
      rsaBits: numBits,
      userIDs: [{ name: 'PGP Web Lab User', email: '' }],
      passphrase,
      format: 'armored'
    });

    const pubKey = await openpgp.readKey({ armoredKey: publicKey });
    const fingerprint = this.formatFingerprint(pubKey.getFingerprint().toUpperCase());

    return { publicKey, privateKey, fingerprint };
  }

  async encryptMessage(plaintext: string, publicKeyArmored: string): Promise<string> {
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
    const message = await openpgp.createMessage({ text: plaintext });
    
    const encrypted = await openpgp.encrypt({
      message,
      encryptionKeys: publicKey
    });

    return encrypted as string;
  }

  async decryptMessage(
    encryptedMessage: string,
    privateKeyArmored: string,
    passphrase: string
  ): Promise<string> {
    const privateKey = await openpgp.decryptKey({
      privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
      passphrase
    });

    const message = await openpgp.readMessage({ armoredMessage: encryptedMessage });
    const { data: decrypted } = await openpgp.decrypt({
      message,
      decryptionKeys: privateKey
    });

    return decrypted as string;
  }

  async encryptFile(fileBuffer: ArrayBuffer, publicKeyArmored: string, filename: string): Promise<Blob> {
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
    
    const encrypted = await openpgp.encrypt({
      message: await openpgp.createMessage({ binary: new Uint8Array(fileBuffer), filename }),
      encryptionKeys: publicKey,
      format: 'binary'
    });

    return new Blob([new Uint8Array(encrypted as Uint8Array)], { type: 'application/octet-stream' });
  }

  async decryptFile(encryptedBlob: Blob, privateKeyArmored: string, passphrase: string): Promise<{ data: Blob; filename: string }> {
    const privateKey = await openpgp.decryptKey({
      privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
      passphrase
    });

    const encryptedBuffer = await encryptedBlob.arrayBuffer();
    const message = await openpgp.readMessage({ binaryMessage: new Uint8Array(encryptedBuffer) });
    
    const { data: decrypted, filename: originalFilename } = await openpgp.decrypt({
      message,
      decryptionKeys: privateKey,
      format: 'binary'
    });

    return {
      data: new Blob([new Uint8Array(decrypted as Uint8Array)]),
      filename: originalFilename || 'decrypted_file'
    };
  }

  async parseKey(armoredKey: string): Promise<KeyInfo> {
    try {
      const key = armoredKey.includes('PRIVATE KEY')
        ? await openpgp.readPrivateKey({ armoredKey })
        : await openpgp.readKey({ armoredKey });

      const userIds = key.users.map(u => u.userID?.userID || '').filter(Boolean);
      const algorithm = typeof key.keyPacket.algorithm === 'string' 
        ? key.keyPacket.algorithm 
        : 'rsa';
      
      return {
        fingerprint: this.formatFingerprint(key.getFingerprint().toUpperCase()),
        userIds,
        creationTime: key.keyPacket.created,
        algorithm,
        bits: 4096,
        type: armoredKey.includes('PRIVATE KEY') ? 'private' : 'public'
      };
    } catch {
      throw new Error('Invalid PGP key');
    }
  }

  async validateKey(armoredKey: string): Promise<boolean> {
    try {
      await this.parseKey(armoredKey);
      return true;
    } catch {
      return false;
    }
  }

  formatFingerprint(fingerprint: string): string {
    return fingerprint.match(/.{1,4}/g)?.join(' ') || fingerprint;
  }
}
