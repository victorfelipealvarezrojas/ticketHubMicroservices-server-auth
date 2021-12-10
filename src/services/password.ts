import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';//tomar esta función basada en devolución de llamada y la convierte en promesas.

const scryptAsync = promisify(scrypt);

export class Password {
    static async toHash(password: string) {
        const salt = randomBytes(8).toString('hex');
        const buf = (await scryptAsync(password, salt, 64)) as Buffer;

        return `${buf.toString('hex')}.${salt}`;
    }

    static async compare(storedPassword: string, suppliedPassword: string) {
        const [hashedPassword, salt] = storedPassword.split('.');
        const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

        return buf.toString('hex') === hashedPassword;
    }
}

//nota: los metodos estaticos son metodos que nos permiten acceder sin crear isntancias eje Password.toHash