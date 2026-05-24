import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {

  constructor(
    private readonly mailerService: MailerService,
  ) {}

  async enviarRecuperacion(
    destino: string,
    nombre: string,
    link: string,
  ) {

    await this.mailerService.sendMail({
      to: destino,
      subject: 'Recuperación de contraseña - DogChat',

      text:
`Hola ${nombre},

Recibimos una solicitud para restablecer tu contraseña.

Haz clic en el siguiente enlace:

${link}

Este enlace expirará en 15 minutos.

Si no solicitaste este cambio, ignora este mensaje.
`
    });
  }
}